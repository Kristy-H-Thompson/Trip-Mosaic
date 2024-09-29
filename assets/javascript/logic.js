//HTML For Drop Down to select which trip they are editing
/*<select id="tripSelector">
    <option value="">Select a Trip</option>
</select>
<div id="tripDetails"></div>
*/

// Function to populate the dropdown with trip destinations
function populateTripDropdown() {
    var tripSelector = document.getElementById('tripSelector');
    tripSelector.innerHTML = ''; // Clear existing options

    // Retrieve trip data from local storage
    var trips = JSON.parse(localStorage.getItem('trips'));

    // Check if trip data exists
    if (trips) {
        // Create an option for each trip
        trips.forEach(function(trip, index) {
            var option = document.createElement('option');
            option.value = index; // Store the index for later use
            option.textContent = trip.destination; // Display the destination
            tripSelector.appendChild(option);
        });
    }
}


// Function to display selected trip details
function displayTripDetails() {
    var tripSelector = document.getElementById('tripSelector');
    var tripDetails = document.getElementById('tripDetails');

    // Clear previous details
    tripDetails.innerHTML = '';

    // Get selected trip's index
    var selectedIndex = tripSelector.value;

    // Retrieve trip data from local storage
    var trips = JSON.parse(localStorage.getItem('trips'));
    var selectedTrip = trips ? trips[selectedIndex] : null;

    // If a trip is selected, display its details
    if (selectedTrip) {
        tripDetails.innerHTML = `
            <h3>Trip Details:</h3>
            <p>Destination: ${selectedTrip.destination}</p>
            <p>Start Date: ${selectedTrip.startDate}</p>
            <p>End Date: ${selectedTrip.endDate}</p>
            <p>Attendees: ${selectedTrip.attendees}</p>
            <p>Total Budget: $${selectedTrip.totalBudget}</p>
        `;
    }
}

// Add event listener to dropdown
document.getElementById('tripSelector').addEventListener('change', displayTripDetails);

// Call the function to populate the dropdown when the page loads
window.onload = function() {
    populateTripDropdown();
    displayTripDetails(); // Optional: Display details of the first trip if needed
};