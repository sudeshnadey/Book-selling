// users.js
document.addEventListener("DOMContentLoaded", function () {
  var userTable = document.getElementById("user-table");
  var userTableBody = document.getElementById("user-table-body");

  // Sample user data (simulated delay for demonstration)
  setTimeout(function () {
    var userData = [
      {
        Number: 1,
        Name: "John Doe",
        "Phone Number": "123-456-7890",
        Image: "<img src='user1.jpg' alt='User 1'>",
      },
      {
        Number: 2,
        Name: "Jane Smith",
        "Phone Number": "987-654-3210",
        Image: "<img src='user2.jpg' alt='User 2'>",
      },
      // Add more user data as needed
    ];

    // Function to populate the user table
    function populateUserTable(data) {
      data.forEach(function (item) {
        var row = document.createElement("tr");

        row.innerHTML = `
                  <td>${item.Number}</td>
                  <td>${item.Name}</td>
                  <td>${item["Phone Number"]}</td>
                  <td>${item.Image}</td>
                  <td>
                      <button
                          data-toggle="modal"
                          data-target="#exampleModal"
                          style="border: none; color: red"
                          onclick="deleteUser(${item.Number})"
                        >
                          <i class="fa-solid fa-trash"></i>
                        </button>
                  </td>
              `;

        userTableBody.appendChild(row);
      });
    }

    // Call the populateUserTable function with your user data on initial render
    populateUserTable(userData);
  }, 0); // No simulated delay in this example (adjust as needed)
});

// Function to handle user deletion
function deleteUser(userId) {
  // Add your code here to handle the deletion of the user with the specified ID
  // For example, you can show a confirmation dialog and then remove the user from the table and data array
  alert("User with ID " + userId + " will be deleted.");
}
