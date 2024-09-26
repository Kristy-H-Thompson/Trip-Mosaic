//HTML for the activity form
/*
<section>
    <h3>Add Activity</h3>
    <form id="activityForm">
        <label for="activityName">Activity Name:</label>
        <input type="text" id="activityName" required>

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
</section>
*/


// Store items in an array
var itemsToPackArray = [];

// Function to handle adding items to the list
function addItemToList() {
    var itemInput = document.getElementById('itemInput');
    var itemList = document.getElementById('itemList');
    
    var newItem = itemInput.value.trim();
    if (newItem) {
        itemsToPackArray.push(newItem);
        
        // Create a list item
        var listItem = document.createElement('li');
        listItem.textContent = newItem;
        
        // Optional: Add a button to remove the item
        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function() {
            itemsToPackArray.splice(itemsToPackArray.indexOf(newItem), 1);
            itemList.removeChild(listItem);
        };
        
        listItem.appendChild(removeButton);
        itemList.appendChild(listItem);
        
        // Clear the input field
        itemInput.value = '';
    }
}

// Function to add an activity to the selected trip
function handleActivitySubmission(event) {
    event.preventDefault();

    // Retrieve form values
    var activityName = document.getElementById('activityName').value.trim();
    var activityStartTime = document.getElementById('activityStartTime').value;
    var activityEndTime = document.getElementById('activityEndTime').value;
    var costPerPerson = document.getElementById('costPerPerson').value.trim();
    var category = document.getElementById('category').value.trim();
    var activityDescription = document.getElementById('activityDescription').value.trim();
    var activityErrorBox = document.getElementById('activityError');

    // Clear previous error messages
    activityErrorBox.innerHTML = '';

    // Validate inputs
    if (!activityName || !activityStartTime || !activityEndTime || !costPerPerson || !category || itemsToPackArray.length === 0 || !activityDescription) {
        activityErrorBox.innerHTML = 'Please fill in all fields.';
        return;
    }

    // Clean costPerPerson input
    costPerPerson = costPerPerson.replace(/[^0-9.-]+/g, ''); // Remove non-numeric characters

    // Validate costPerPerson
    if (isNaN(costPerPerson) || parseFloat(costPerPerson) <= 0) {
        activityErrorBox.innerHTML = 'Cost per person must be a valid positive number.';
        return;
    }

    // Standardize date and time formats
    var startTimeDate = new Date(`1970-01-01T${activityStartTime}:00`);
    var endTimeDate = new Date(`1970-01-01T${activityEndTime}:00`);

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
    var selectedKey = tripSelector.value;

    // Retrieve trip data from local storage
    var tripData = JSON.parse(localStorage.getItem('tripData')) || {};

    // If the selected trip doesn't exist, show an error
    if (!tripData[selectedKey]) {
        activityErrorBox.innerHTML = 'No trip selected.';
        return;
    }

    // Create the activity object
    var newActivity = {
        name: activityName,
        startTime: activityStartTime, // Keep original input for reference
        endTime: activityEndTime, // Keep original input for reference
        costPerPerson: parseFloat(costPerPerson), // Ensure costPerPerson is a float
        category: category,
        itemsToPack: itemsToPackArray, // Use the array of items
        description: activityDescription
    };

    // Add the activity to the trip's activities array
    if (!tripData[selectedKey].activities) {
        tripData[selectedKey].activities = []; // Initialize activities array if it doesn't exist
    }
    tripData[selectedKey].activities.push(newActivity);

    // Store updated trip data back to local storage
    localStorage.setItem('tripData', JSON.stringify(tripData));

    // Clear the form and reset itemsToPackArray
    document.getElementById('activityForm').reset();
    itemsToPackArray = []; // Reset the items array
    document.getElementById('itemList').innerHTML = ''; // Clear the displayed item list
    alert('Activity added successfully!');
}

// Add event listener to the add item button
document.getElementById('addItemButton').addEventListener('click', addItemToList);

// Add event listener to the activity form
document.getElementById('activityForm').addEventListener('submit', handleActivitySubmission);