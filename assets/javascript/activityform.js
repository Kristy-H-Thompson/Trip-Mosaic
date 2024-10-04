/* 
------------------------------------------------------------------------------------------------------------

    Handling the activity form submission

------------------------------------------------------------------------------------------------------------ 
*/

//add in an event listener for the content to load
document.addEventListener('DOMContentLoaded', function() {
    var tripSelector = document.getElementById('tripSelector');
    var activityForm = document.getElementById('activityForm');
    var activityErrorBox = document.getElementById('activityError');
    var trips = JSON.parse(localStorage.getItem('trips')) || [];
    var itemsToPackArray = []; // Array to hold items to pack


    /* 
    ------------------------------------------------------------------------------------------------------------

        Populate the Dropdown

    ------------------------------------------------------------------------------------------------------------ 
    */

    // Function to populate the dropdown with trip destinations from local storage
    function populateTripDropdown() {
        tripSelector.innerHTML = ''; // Clear existing options

        if (Array.isArray(trips) && trips.length > 0) {
            trips.forEach(function(trip, index) {
                if (trip.destination) { // Ensure destination exists
                    var option = document.createElement('option');
                    option.value = index; // Store the index for later use
                    option.textContent = trip.destination; // Display the destination
                    tripSelector.appendChild(option);
                }
            });
        } else {
            var option = document.createElement('option');
            option.value = '';
            option.textContent = 'No trips available';
            tripSelector.appendChild(option);
        }
    }

    // Show or hide activity form based on trip selection
    tripSelector.addEventListener('change', function() {
        if (this.value) {
            activityForm.style.display = 'block'; // Show activity form
            activityErrorBox.innerHTML = ''; // Clear previous errors
        } else {
            activityForm.style.display = 'none'; // Hide activity form
            itemsToPackArray = []; // Reset items to pack
            document.getElementById('itemList').innerHTML = ''; // Clear the item list
        }
    });


    /* 
    ------------------------------------------------------------------------------------------------------------

        Handling the items to pack

    ------------------------------------------------------------------------------------------------------------ 
    */
    // Handle adding items to pack
    document.getElementById('addItemButton').addEventListener('click', function() {
        var itemInput = document.getElementById('itemInput').value.trim();
        if (itemInput) {
            itemsToPackArray.push(itemInput); // Add item to array
            var itemList = document.getElementById('itemList');
            var listItem = document.createElement('li');
            listItem.textContent = itemInput; // Display the item
            itemList.appendChild(listItem);
            document.getElementById('itemInput').value = ''; // Clear input
        }
    });




    /* 
    ------------------------------------------------------------------------------------------------------------

        Handling the activity form submission

    ------------------------------------------------------------------------------------------------------------ 
    */
    // Handle activity submission
    activityForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        activityErrorBox.innerHTML = ''; // Clear previous errors

        var selectedTripIndex = tripSelector.value;
        var activityName = document.getElementById('activityName').value.trim();
        var activityDate = document.getElementById('activityDate').value;
        var activityStartTime = document.getElementById('activityStartTime').value;
        var activityEndTime = document.getElementById('activityEndTime').value;
        var costPerPerson = parseFloat(document.getElementById('costPerPerson').value.trim());
        var category = document.getElementById('category').value.trim();
        var activityDescription = document.getElementById('activityDescription').value.trim();

        // Validate inputs
        if (!activityName || !activityDate || !activityStartTime || !activityEndTime || isNaN(costPerPerson) || !category || !activityDescription) {
            activityErrorBox.innerHTML = 'Please fill in all fields correctly.';
            return;
        }

        // Check if end time is after start time
        var startTimeDate = new Date(`${activityDate}T${activityStartTime}`);
        var endTimeDate = new Date(`${activityDate}T${activityEndTime}`);
        if (endTimeDate <= startTimeDate) {
            activityErrorBox.innerHTML = 'End time must be after start time.';
            return;
        }

        // Validate activity date against the selected trip
        var selectedTrip = trips[selectedTripIndex];
        var tripStartDate = new Date(selectedTrip.startDate);
        var tripEndDate = new Date(selectedTrip.endDate);
        var activityDateObj = new Date(activityDate);

        if (activityDateObj < tripStartDate || activityDateObj > tripEndDate) {
            activityErrorBox.innerHTML = `Activity date must fall between trip dates: ${tripStartDate.toLocaleDateString()} and ${tripEndDate.toLocaleDateString()}.`;
            return;
        }

        // Create the activity object
        var activityData = {
            name: activityName,
            date: activityDate,
            startTime: activityStartTime,
            endTime: activityEndTime,
            costPerPerson: costPerPerson,
            category: category,
            itemsToPack: itemsToPackArray, // Use the array of items to pack
            description: activityDescription
        };

        // Add activity to the selected trip
        if (!selectedTrip.activities) {
            selectedTrip.activities = []; // Initialize activities array if it doesn't exist
        }
        selectedTrip.activities.push(activityData);
        localStorage.setItem('trips', JSON.stringify(trips)); // Update local storage

        // Reset the activity form
        activityForm.reset();
        itemsToPackArray = []; // Reset items to pack
        document.getElementById('itemList').innerHTML = ''; // Clear the item list
        activityForm.style.display = 'none'; // Hide form after submission
        alert('Activity added successfully!');
    });

    // Call the function to populate the dropdown when the page loads
    populateTripDropdown();
});