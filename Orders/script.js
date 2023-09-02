// script.js
document.addEventListener("DOMContentLoaded", function () {
  // Sample JSON data
  var jsonData = [
    {
      id: 1,
      name: "Hunda",
      date: "12/5/2012",
      status: "complete",
    },
    {
      id: 2,
      name: "Hunda",
      date: "12/5/2012",
      status: "complete",
    },
    {
      id: 3,
      name: "Hunda",
      date: "12/5/2012",
      status: "complete",
    },
    // Add more JSON data as needed
  ];

  // Function to populate the table
  function populateTable(data) {
    var tbody = document.getElementById("table-body");

    data.forEach(function (item) {
      var row = document.createElement("tr");

      row.innerHTML = `
              <td>${item.id}</td>
              <td>${item.name}</td>
              <td>${item.date}</td>
              <td><span class="badge badge-info" style="background-color: green;">${item.status}</span></td>
              <td>
                  <button data-toggle="modal" data-target="#exampleModal" style="border: none; color: red">
                      <i class="fa-solid fa-trash"></i>
                  </button>
              </td>
          `;

      tbody.appendChild(row);
    });
  }

  // Call the populateTable function with your JSON data on initial render
  populateTable(jsonData);
});
