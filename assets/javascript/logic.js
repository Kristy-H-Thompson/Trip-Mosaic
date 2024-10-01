//HTML For Drop Down to select which trip they are editing
/*<select id="tripSelector">
    <option value="">Select a Trip</option>
</select>
<div id="tripDetails"></div>

    <canvas id="budgetChart" width="400" height="400"></canvas>

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

document.addEventListener('DOMContentLoaded', function () {
    // Function to create the budget pie chart
    function createBudgetPieChart() {
        // Retrieve trips from local storage
        const trips = JSON.parse(localStorage.getItem('trips')) || [];

        // Prepare an object to store costs by category
        const categoryCosts = {};

        // Iterate over each trip
        trips.forEach(trip => {
            if (trip.activities) {
                trip.activities.forEach(activity => {
                    const category = activity.category;
                    const cost = activity.costPerPerson; // Assuming this is the cost per person
                    // Initialize category cost if it doesn't exist
                    if (!categoryCosts[category]) {
                        categoryCosts[category] = 0;
                    }
                    // Add the cost (assuming the cost is per person and you want the total)
                    categoryCosts[category] += cost * trip.attendees; // Multiply by number of attendees
                });
            }
        });

        // Prepare data for the chart
        const labels = Object.keys(categoryCosts);
        const data = Object.values(categoryCosts);

        // Create the pie chart
        const ctx = document.getElementById('budgetChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Budget by Category',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Budget Distribution by Category'
                    }
                }
            }
        });
    }

    // Call the function to create the pie chart
    createBudgetPieChart();
});