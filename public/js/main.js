

// Main JavaScript file for Picnic website
document.addEventListener("DOMContentLoaded", () => {
  console.log("Picnic website loaded");
});


//Bookings date validation and submit button handling
document.addEventListener("DOMContentLoaded", () => {

    const bookingDate = document.getElementById("bookingDate");

    if (bookingDate) {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 3);

        bookingDate.setAttribute(
            "min",
            minDate.toISOString().split("T")[0]
        );
    }
});

// Disable submit button after form submission to prevent multiple submissions
const bookingForm = document.querySelector("form");
const submitBtn = document.getElementById("submitBtn");

if (bookingForm && submitBtn) {
    bookingForm.addEventListener("submit", () => {
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";
    });
}