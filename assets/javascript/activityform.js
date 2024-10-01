//HTML for the activity form
/*
        <h3>Add Activity</h3>
        <form id="activityForm">
            <label for="activityName">Activity Name:</label>
            <input type="text" id="activityName" required>

            <label for="activityDate">Activity Date</label>
            <input type="date" id="activityDate" required>
    
            <label for="activityStartTime">Start Time:</label>
            <input type="time" id="activityStartTime" required>
    
            <label for="activityEndTime">End Time:</label>
            <input type="time" id="activityEndTime" required>
    
            <label for="costPerPerson">Cost per Person:</label>
            <input type="number" id="costPerPerson" required>
    
            <label for="category">Category:</label>
            <input type="text" id="category" required>
    
            <label for="itemInput">Item to Pack:</label>
            <input type="text" id="itemInput">
            <button type="button" id="addItemButton">Add Item</button>
            
            <ul id="itemList"></ul> <!-- List to display items to pack -->
    
            <label for="activityDescription">Description:</label>
            <textarea id="activityDescription" required></textarea>
    
            <button type="submit">Add Activity</button>
        </form>
        <div id="activityError" style="color: red;"></div>
*/


// Function to populate the dropdown with trip destinations from local storage
function populateTripDropdown() {
    var tripSelector = document.getElementById('tripSelector');
    tripSelector.innerHTML = ''; // Clear existing options

    // Retrieve trip data from local storage
    var trips = JSON.parse(localStorage.getItem('trips'));

    // Check if trip data exists
    if (Array.isArray(trips) && trips.length > 0) {
        // Create an option for each trip
        trips.forEach(function(trip, index) {
            if (trip.destination) { // Ensure destination exists
                var option = document.createElement('option');
                option.value = index; // Store the index for later use
                option.textContent = trip.destination; // Display the destination
                tripSelector.appendChild(option);
            }
        });
    } else {
        // Optional: Add a default message if no trips are available
        var option = document.createElement('option');
        option.value = '';
        option.textContent = 'No trips available';
        tripSelector.appendChild(option);
    }
}

// Call the function to populate the dropdown when the page loads
window.onload = function() {
    populateTripDropdown();
};