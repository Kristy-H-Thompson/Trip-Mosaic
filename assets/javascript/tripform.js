/* 
------------------------------------------------------------------------------------------------------------

Handle the Trip Submission Form

------------------------------------------------------------------------------------------------------------ 
*/

// Add event listened to when page content is loaded -- then define some variables
document.addEventListener('DOMContentLoaded', function () {
    var tripForm = document.getElementById('tripForm');
    var errorBox = document.getElementById('error');

// Function to handle the trip submission form
    function handleTripSubmission(event) {
        event.preventDefault();

        //Define variables for each of the from data and error box
        var destination = document.getElementById('destination').value.trim();
        var startDate = document.getElementById('startDate').value;
        var endDate = document.getElementById('endDate').value;
        var attendees = parseInt(document.getElementById('attendees').value.trim(), 10); // Convert to integer
        var totalBudget = document.getElementById('totalBudget').value.trim();

        errorBox.innerHTML = '';

        // Error handling for if they do not fill out every section of the form
        if (!destination || !startDate || !endDate || !attendees || !totalBudget) {
            errorBox.innerHTML = 'Please fill in all fields.';
            return;
        }

        // Error handling to make sure start date is before the end date
        if (new Date(startDate) >= new Date(endDate)) {
            errorBox.innerHTML = 'End date must be after start date.';
            return;
        }

        // Error handling for the total budget make sure it is a positive number over one
        totalBudget = totalBudget.replace(/[^0-9.-]+/g, '');
        if (isNaN(totalBudget) || totalBudget <= 0) {
            errorBox.innerHTML = 'Total budget must be a positive number.';
            return;
        }

        // Error handling for attendees, make sure it a positive number
        if (isNaN(attendees)) {
            errorBox.innerHTML = 'Please put in the number of people coming on the trip';
        }

        if (attendees <= 1) {
            errorBox.innerHTML = 'Number of attendees must be 1 or greater';
            return;
        }

        var tripData = {
            destination: destination,
            startDate: startDate,
            endDate: endDate,
            attendees: attendees,
            totalBudget: totalBudget
        };

        // Retrieve existing trip data or initialize an empty array
        var trips = JSON.parse(localStorage.getItem('trips')) || [];
        trips.push(tripData); // Add new trip data to the array

        // Store the updated trips array back in local storage
        localStorage.setItem('trips', JSON.stringify(trips));

        tripForm.reset();
        window.location.href = 'trip.html';
    }

    tripForm.addEventListener('submit', handleTripSubmission);
});