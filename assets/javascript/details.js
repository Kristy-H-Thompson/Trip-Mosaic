document.addEventListener('DOMContentLoaded', function () {
    let budgetChartInstance; // Variable to hold the current chart instance

    // Function to create the budget pie chart
    function createBudgetPieChart(trip) {
        const categoryCosts = {};

        // Prepare costs by category for the selected trip
        if (trip.activities) {
            trip.activities.forEach(activity => {
                const category = activity.category;
                const cost = activity.costPerPerson; // Assuming this is the cost per person
                if (!categoryCosts[category]) {
                    categoryCosts[category] = 0;
                }
                categoryCosts[category] += cost * trip.attendees; // Multiply by number of attendees
            });
        }

        // Prepare data for the chart
        const labels = Object.keys(categoryCosts);
        const data = Object.values(categoryCosts);

        // Destroy the previous chart instance if it exists
        if (budgetChartInstance) {
            budgetChartInstance.destroy();
        }

        // Create the pie chart
        const ctx = document.getElementById('budgetChart').getContext('2d');
        budgetChartInstance = new Chart(ctx, {
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

    // Function to populate the dropdown with trip destinations from local storage
    function populateTripDropdown() {
        const tripSelector = document.getElementById('tripSelector');
        tripSelector.innerHTML = ''; // Clear existing options

        // Retrieve trip data from local storage
        const trips = JSON.parse(localStorage.getItem('trips'));

        // Check if trip data exists
        if (trips) {
            // Create an option for each trip
            trips.forEach((trip, index) => {
                const option = document.createElement('option');
                option.value = index; // Store the index for later use
                option.textContent = trip.destination; // Display the destination
                tripSelector.appendChild(option);
            });
        }
    }

    function displayTripDetails() {
        const tripSelector = document.getElementById('tripSelector');
        const packingListSection = document.getElementById('packingListSection');
        const budgetChart = document.getElementById('budgetChart');
        const itineraryTableBody = document.getElementById('itineraryTableBody');
        const itineraryTableHead = document.getElementById('itineraryTableHead');
    
        // Clear previous itinerary rows
        itineraryTableBody.innerHTML = '';
    
        // Get selected trip's index
        const selectedIndex = tripSelector.value;
    
        // Retrieve trip data from local storage
        const trips = JSON.parse(localStorage.getItem('trips'));
        const selectedTrip = trips ? trips[selectedIndex] : null;
    
        // If a trip is selected, display its itinerary, packing list, and budget chart
        if (selectedTrip) {
            // Show sections
            packingListSection.style.display = 'block';
            budgetChart.style.display = 'block'; // Show the chart
            itineraryTableHead.style.display = 'table-header-group'; // Show the table header
    
            // Populate the itinerary table
            if (selectedTrip.activities && selectedTrip.activities.length > 0) {
                selectedTrip.activities.forEach((activity, activityIndex) => {
                    const row = document.createElement('tr');
                    row.className = 'hover:bg-gray-100';
                    row.innerHTML = `
                        <td class="py-2 px-4 border-b">${activity.startTime}</td>
                        <td class="py-2 px-4 border-b">${activity.endTime}</td>
                        <td class="py-2 px-4 border-b">${activity.name}</td>
                        <td class="py-2 px-4 border-b">
                            <details class="group">
                                <summary class="cursor-pointer text-blue-600 hover:underline">View Details</summary>
                                <div class="mt-2 bg-gray-50 p-4 border border-gray-200">
                                    <p><strong>Description:</strong> ${activity.description}</p>
                                    <p><strong>Cost per Person:</strong> $${activity.costPerPerson}</p>
                                </div>
                            </details>
                        </td>
                        <td class="py-2 px-4 border-b">
                            <button class="text-red-600 hover:underline delete-button" data-index="${activityIndex}">Delete</button>
                        </td>
                    `;
                    itineraryTableBody.appendChild(row);
                });
            }
    
            // Clear previous packing list items
            const packingList = document.getElementById('packingList');
            packingList.innerHTML = '';
    
            // Collect unique items to pack
            const uniqueItems = new Set(); // Define uniqueItems
            selectedTrip.activities.forEach(activity => {
                if (activity.itemsToPack) {
                    activity.itemsToPack.forEach(item => uniqueItems.add(item));
                }
            });
    
            // Create cards for unique items
            uniqueItems.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'p-4 border rounded shadow bg-[#B598A2] hover:shadow-lg transition-shadow duration-200'; // Updated background color
                const itemName = document.createElement('h4');
                itemName.className = 'font-semibold text-white'; // Change text color for better contrast
                itemName.textContent = item;
                itemCard.appendChild(itemName);
                packingList.appendChild(itemCard);
            });
    
            // Create the budget chart for the selected trip
            createBudgetPieChart(selectedTrip);
        } else {
            // Hide the packing list and chart if no trip is selected
            packingListSection.style.display = 'none';
            budgetChart.style.display = 'none';
            itineraryTableHead.style.display = 'none'; // Hide the table header
        }
    }

    // Function to handle deletion
    function confirmDelete(activityIndex, trip) {
        const confirmed = confirm("Are you sure you want to delete this activity?");
        if (confirmed) {
            // Remove the activity
            trip.activities.splice(activityIndex, 1);
            
            // Retrieve trips from local storage
            const tripSelector = document.getElementById('tripSelector');
            const selectedIndex = tripSelector.value;
            const trips = JSON.parse(localStorage.getItem('trips'));
            
            // Update the specific trip in the array
            trips[selectedIndex] = trip;

            // Update local storage
            localStorage.setItem('trips', JSON.stringify(trips));

            // Refresh the itinerary display
            displayTripDetails();
        }
    }

    // Event delegation for delete buttons
    document.getElementById('itineraryTableBody').addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-button')) {
            const activityIndex = e.target.getAttribute('data-index');
            const tripSelector = document.getElementById('tripSelector');
            const selectedIndex = tripSelector.value;
            const trips = JSON.parse(localStorage.getItem('trips'));
            const selectedTrip = trips[selectedIndex];
            confirmDelete(activityIndex, selectedTrip);
        }
    });

    // Add event listener to dropdown
    document.getElementById('tripSelector').addEventListener('change', displayTripDetails);

    // Call the function to populate the dropdown when the page loads
    populateTripDropdown();
});