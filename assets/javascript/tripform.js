// Define Global Variables
var tripForm = document.getElementById('tripForm');
var errorBox = document.getElementById('error');

// Handle Trip Form
function handleTripSubmission(event) {
    event.preventDefault();

    // Define some variables to use later
    var destination = document.getElementById('destination').value.trim();
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var attendees = document.getElementById('attendees').value.trim();
    var totalBudget = document.getElementById('totalBudget').value;

    // Clear previous error messages
    errorBox.innerHTML = '';

    // Validate inputs
    if (!destination || !startDate || !endDate || !attendees || !totalBudget) {
        errorBox.innerHTML = 'Please fill in all fields.';
        return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
        errorBox.innerHTML = 'End date must be after start date.';
        return;
    }

    if (isNaN(totalBudget) || totalBudget <= 0) {
        errorBox.innerHTML = 'Total budget must be a positive number.';
        return;
    }

    // Create an object to hold trip data
    var tripData = {
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        attendees: attendees,
        totalBudget: totalBudget
    };

    // Store trip data in local storage
    localStorage.setItem('tripData', JSON.stringify(tripData));

    // Optionally, clear the form
    tripForm.reset();

    // Redirect to trip.html
    window.location.href = 'trip.html';
}

// Add event listener to the form
tripForm.addEventListener('submit', handleTripSubmission);