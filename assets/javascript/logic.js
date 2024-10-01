//HTML For Drop Down to select which trip they are editing
/*<select id="tripSelector">
    <option value="">Select a Trip</option>
</select>
<div id="tripDetails"></div>

    <canvas id="budgetChart" width="400" height="400"></canvas>

*/

// Function to populate the dropdown with trip destinations from local storage
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

// Add event listener to dropdown
document.getElementById('tripSelector').addEventListener('change', displayTripDetails);

// Call the function to populate the dropdown when the page loads
window.onload = function() {
    populateTripDropdown();
    // Do not display details until a selection is made
};