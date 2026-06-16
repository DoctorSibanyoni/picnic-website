const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.get("/", (req, res) => res.render("pages/home"));
router.get("/services", (req, res) => res.render("pages/services"));
router.get("/gallery", (req, res) => res.render("pages/gallery"));
router.get("/about", (req, res) => res.render("pages/about"));
router.get("/bookings", (req, res) => res.render("pages/bookings"));
router.get("/booking-success", (req, res) => res.render("pages/booking-success"));
router.get("/contact", (req, res) => res.render("pages/contact"));

module.exports = router;

const transporter = require("../services/emailService");

router.post("/bookings", async (req, res) => {
    const {
        full_name,
        email,
        phone,
        package_type,
        booking_date,
        guest_count,
        notes
    } = req.body;

    //form control 
    if (full_name.length > 50) {
        return res.status(400).send("Name cannot exceed 50 characters.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).send("Please enter a valid email address.");
    }

    const phoneRegex = /^(\+27|0)[1-8][0-9]{8}$/;

    if (!phoneRegex.test(phone)) {
    return res.status(400).send("Please enter a valid South African phone number.");
    }

    if (package_type === "Romantic Picnic" && Number(guest_count) > 2) {
        return res.send(`
        <script>
            alert("Romantic Picnic is limited to 2 guests only.");
            window.history.back();
        </script>
  `);
}

    if (notes && notes.length > 150) {
        return res.status(400).send("Additional notes cannot exceed 150 characters.");
    }

    const selectedDate = new Date(booking_date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        return res.status(400).send("Booking date cannot be in the past.");
    }

// Save clients booking
    const formattedDate = new Date(booking_date).toLocaleDateString("en-ZA");
    res.redirect("/booking-success");

    try {
        await transporter.sendMail({
            from: "blissfulbites109@gmail.com",
            to: "blissfulbites109@gmail.com",
            replyTo: email,
            subject: "New Picnic Booking",
            html: `
                <h2>New Booking Request</h2>
                <p><strong>Name:</strong> ${full_name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Package:</strong> ${package_type}</p>
                <p><strong>Guests:</strong> ${guest_count}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Notes:</strong> ${notes}</p>
            `
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to submit booking.");
    }

//send confirmation email to client
    transporter.sendMail({
    from: "blissfulbites109@gmail.com",
    to: email,
    subject: "Booking Request Received",
    html: `
        <h2>Thank You For Your Booking Request</h2>

        <p>Hello ${full_name},</p>

        <p>
            We have successfully received your picnic booking request.
        </p>

        <h3>Your Booking Details</h3>

        <ul>
            <li><strong>Package:</strong> ${package_type}</li>
            <li><strong>Guests:</strong> ${guest_count}</li>
            <li><strong>Date:</strong> ${formattedDate}</li>
        </ul>

        <p>
            Our team will review your request and contact you shortly
            to confirm the booking details.
        </p>

        <p>
            Thank you for choosing Blissful Bites.
        </p>
    `
}).catch(err => console.error(err));
});
