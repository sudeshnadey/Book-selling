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

// Define global variables for pagination
var currentPage = 1;
var itemsPerPage = 10; // Number of items to display per page
var filteredData = [];
var totalFilteredPages = 1; // Initialize to 1 page
const token = localStorage.getItem("user");

function fetchDataFromAPI() {
  fetch("https://api.bhattacharjeesolution.in/book/api/admin-order.php", {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  }) // Replace with your API endpoint
    .then(function (response) {
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the response as JSON
    })
    .then(function (data) {
      // Call the populateBannerTableWithData function with the retrieved data
      const spec = data.data;
      window.fetchedData = spec;
      filteredData = spec;
      totalFilteredPages = spec.length; // Calculate total pages for the original data
      console.log("totalpage:", totalFilteredPages);
      populateTable(spec);
      console.log("data:", spec.length);
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}


// Function to populate the table
function populateTable(data) {
  var tbody = document.getElementById("table-body");

  
  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  for (let index = startIndex; index < endIndex; index++) {
    const item = data[index];
    var row = document.createElement("tr");

    row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name || ""}</td>
            <td>${item.payment_method}</td>
            <td>${item.total_price}</td>
            <td>${item.created_at}</td>
            
            <td>${item.status === "delivered" ? `<span class="badge badge-danger" style="background-color: green;"  >${item.status}</span>` : `<span class="badge badge-success" style="background-color: red;">${item.status}</span>` }</td>
            <td>
                <button class="edit-button" style="border: none"  data-coupon='${JSON.stringify(
                  item
                )}'>
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button data-toggle="modal" data-target="#exampleModal" style="border: none; color: red">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;

    tbody.appendChild(row);

    var editButton = row.querySelector(".edit-button");
    addEditButtonClickHandler(editButton, item);
  };

  
  function addEditButtonClickHandler(editButton, item) {
    editButton.addEventListener("click", function () {
      var couponData = JSON.parse(editButton.getAttribute("data-coupon"));
      console.log('item', item);
      editBanner(item); // Pass the 'item' to the editCategory function
    });
  }

  // updatePaginationControls(totalFilteredPages);
  updatePaginationControls(data.length);
}

function editBanner(item) {
  // const item = JSON.parse(decodeURIComponent(itemString));
  console.log(item);

  const formdata = new FormData();
  formdata.append("id", item.id)
  formdata.append("status", item.status === "delivered" ? 'pending' : 'delivered')

  fetch('https://api.bhattacharjeesolution.in/book/api/update-order.php', {
      method: "POST",
      headers: {
        token: `${token}`, // Include the Bearer token in the header
        // "Content-Type": "application/json", // You can adjust the content type as needed
      },
      body: formdata
    }).then((response) => {
      response.json()
    })
    .then((res) => {
      console.log(res);
      window.location.reload();
    }).catch((err) => {
      console.log(err);
    })

  // localStorage.setItem('coachingeditdata', itemString)

  // const queryParams = `data=${encodeURIComponent(JSON.stringify(itemData))}`;
  // window.location.href = `edit-student.php`;
}


function searchTable() {
  const searchInput = document.getElementById("searchbar").value.toLowerCase();

  // Filter the data based on the search query
  filteredData = window.fetchedData.filter(function (item) {
    return item.name.toLowerCase().includes(searchInput);
    // Add more fields to search as needed
  });

  // Reset the current page to 1 when searching
  currentPage = 1;
  // Calculate the total number of pages for the filtered data
  totalFilteredPages = filteredData.length / itemsPerPage;

  // Update the pagination controls based on the filtered data length
  updatePaginationControls(filteredData.length);
  // Update the table with the filtered data
  populateTable(filteredData);
}

function updatePaginationControls(totalItems) {
  console.log("rows: ", totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageInfo = document.getElementById("page-info");
  pageInfo.textContent = "Page " + currentPage + " of " + totalPages;

  const prevButton = document.getElementById("prev-button");
  const nextButton = document.getElementById("next-button");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    populateTable(filteredData); // Display data for the updated page
    // populateTable(window.fetchedData); // Display data for the updated page
  }
}

function nextPage() {
  const totalPages = Math.ceil(window.fetchedData.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    populateTable(filteredData); // Display data for the updated page
    // populateTable(window.fetchedData); // Display data for the updated page
  }
}


// script.js
document.addEventListener("DOMContentLoaded", fetchDataFromAPI);
