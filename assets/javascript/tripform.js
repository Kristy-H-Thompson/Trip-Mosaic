// Populate the dropdown with trip destinations from local storage
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

// Function to handle activity submission
function handleActivitySubmission(event) {
    event.preventDefault();

    // Retrieve form values
    var activityName = document.getElementById('activityName').value.trim();
    var activityDate = document.getElementById('activityDate').value;
    var activityStartTime = document.getElementById('activityStartTime').value;
    var activityEndTime = document.getElementById('activityEndTime').value;
    var costPerPerson = document.getElementById('costPerPerson').value.trim();
    var category = document.getElementById('category').value.trim();
    var activityDescription = document.getElementById('activityDescription').value.trim();
    var activityErrorBox = document.getElementById('activityError');

    // Clear previous error messages
    activityErrorBox.innerHTML = '';

    // Validate inputs
    if (!activityName || !activityDate || !activityStartTime || !activityEndTime || !costPerPerson || !category || !activityDescription) {
        activityErrorBox.innerHTML = 'Please fill in all fields.';
        return;
    }

    // Clean costPerPerson input
    costPerPerson = costPerPerson.replace(/[^0-9.-]+/g, '');

    // Validate costPerPerson
    if (isNaN(costPerPerson) || parseFloat(costPerPerson) <= 0) {
        activityErrorBox.innerHTML = 'Cost per person must be a valid positive number.';
        return;
    }

    // Standardize date and time formats
    var startTimeDate = new Date(`${activityDate}T${activityStartTime}:00`);
    var endTimeDate = new Date(`${activityDate}T${activityEndTime}:00`);

    // Validate start and end times
    if (isNaN(startTimeDate.getTime()) || isNaN(endTimeDate.getTime())) {
        activityErrorBox.innerHTML = 'Please enter valid start and end times.';
        return;
    }

    if (endTimeDate <= startTimeDate) {
        activityErrorBox.innerHTML = 'End time must be after start time.';
        return;
    }

    // Get the selected trip
    var tripSelector = document.getElementById('tripSelector');
    var selectedIndex = tripSelector.value;

    // Retrieve trip data from local storage
    var trips = JSON.parse(localStorage.getItem('trips')) || [];

    // If the selected trip doesn't exist, show an error
    if (!trips[selectedIndex]) {
        activityErrorBox.innerHTML = 'No trip selected.';
        return;
    }

    // Calculate current total cost of activities
    var currentTotalCost = trips[selectedIndex].activities.reduce((total, activity) => total + (activity.costPerPerson * trips[selectedIndex].attendees), 0);
    var newActivityCost = parseFloat(costPerPerson) * trips[selectedIndex].attendees;

    // Check if the new total exceeds the budget
    var totalBudget = parseFloat(trips[selectedIndex].totalBudget);
    if (currentTotalCost + newActivityCost > totalBudget) {
        activityErrorBox.innerHTML = 'Adding this activity exceeds the total budget for the trip.';
        return;
    }

    // Check for overlapping activities
    if (trips[selectedIndex].activities) {
        for (var activity of trips[selectedIndex].activities) {
            var existingStartDate = new Date(`${activityDate}T${activity.startTime}:00`);
            var existingEndDate = new Date(`${activityDate}T${activity.endTime}:00`);

            if ((startTimeDate >= existingStartDate && startTimeDate < existingEndDate) || 
                (endTimeDate > existingStartDate && endTimeDate <= existingEndDate) || 
                (startTimeDate <= existingStartDate && endTimeDate >= existingEndDate)) {
                activityErrorBox.innerHTML = 'This activity overlaps with an existing activity.';
                return;
            }
        }
    }

    // Create the activity object
    var newActivity = {
        name: activityName,
        date: activityDate,
        startTime: activityStartTime,
        endTime: activityEndTime,
        costPerPerson: parseFloat(costPerPerson),
        category: category,
        description: activityDescription
    };

    // Add the activity to the trip's activities array
    trips[selectedIndex].activities.push(newActivity);

    // Store updated trip data back to local storage
    localStorage.setItem('trips', JSON.stringify(trips));

    // Clear the form
    document.getElementById('activityForm').reset();
    alert('Activity added successfully!');
}

// Add event listener to the form
document.getElementById('activityForm').addEventListener('submit', handleActivitySubmission);

// Populate the dropdown when the page loads
window.onload = function() {
    populateTripDropdown();
};