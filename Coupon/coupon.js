// Define global variables for pagination
var currentPage = 1;
var itemsPerPage = 10; // Number of items to display per page
var filteredData = [];
var totalFilteredPages = 1; // Initialize to 1 page
const token = localStorage.getItem("user");

function fetchDataFromAPI() {
  fetch("https://api.bhattacharjeesolution.in/book/api/coupon.php", {
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
      window.fetchedData = data;
      filteredData = data;
      totalFilteredPages = data.length; // Calculate total pages for the original data
      console.log("totalpage:", totalFilteredPages);
      populateBannerTable(data);
      console.log("data:", data);
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

// Function to populate the banner table
function populateBannerTable(data) {
  var bannerTable = document.getElementById("coupon-table-body");
  var bannerTableBody = document.getElementById("coupon-table");

  // Clear the existing rows in bannerTableBody
  while (bannerTableBody.firstChild) {
    bannerTableBody.removeChild(bannerTableBody.firstChild);
  }

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  for (let index = startIndex; index < endIndex; index++) {
    const item = data[index];
    var row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.code}</td>
      <td>${item.type}</td>
      <td>${item.value}</td>
      <td>${item.minimum_amount}</td>
      <td>${item.valid_from}</td>
      <td>${item.valid_until}</td>
      <td>
          <button class="edit-button" style="border: none"  data-coupon='${JSON.stringify(
            item
          )}'>
              <i class="fa-solid fa-pen"></i>
            </button>
            <button style="border: none; color: red" onclick="deleteBanner(${
              item.id
            })">
              <i class="fa-solid fa-trash"></i>
            </button>
      </td>
    `;

    bannerTableBody.appendChild(row);
    var editButton = row.querySelector(".edit-button");
    addEditButtonClickHandler(editButton, item);
    // editButton.addEventListener("click", function () {
    //   var couponData = JSON.parse(editButton.getAttribute("data-coupon"));
    //   editBanner(couponData);
    // });
  }

  function addEditButtonClickHandler(editButton, item) {
    editButton.addEventListener("click", function () {
      var couponData = JSON.parse(editButton.getAttribute("data-coupon"));
      editBanner(item); // Pass the 'item' to the editCategory function
    });
  }

  updatePaginationControls(data.length);
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
  populateBannerTable(filteredData);
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
    populateBannerTable(filteredData); // Display data for the updated page
    // populateBannerTable(window.fetchedData); // Display data for the updated page
  }
}

function nextPage() {
  const totalPages = Math.ceil(window.fetchedData.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    populateBannerTable(filteredData); // Display data for the updated page
    // populateBannerTable(window.fetchedData); // Display data for the updated page
  }
}

// banner.js
document.addEventListener("DOMContentLoaded", function () {
  var bannerTable = document.getElementById("coupon-table-body");
  var bannerTableBody = document.getElementById("coupon-table");

  // Sample banner data (simulated delay for demonstration)
  setTimeout(function () {
    // Call the populateBannerTable function with your banner data on initial render
    // populateBannerTable(bannerData);
    // Function to fetch data from the API

    fetchDataFromAPI();

    // Add an event listener to the search input field
    var searchInput = document.getElementById("searchbar");
    searchInput.addEventListener("input", function () {
      var searchText = searchInput.value.trim().toLowerCase();

      // Loop through the table rows (skip the first row which is the header)
      var rows = bannerTableBody.querySelectorAll("tr");

      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var nameColumn = row.querySelector("td:nth-child(2)"); // Target the "Banner Name" column (2nd column)
        var nameText = nameColumn.textContent.trim().toLowerCase();

        if (nameText.includes(searchText)) {
          row.style.display = ""; // Show the row
        } else {
          row.style.display = "none"; // Hide the row
        }
      }
    });
  }, 0); // No simulated delay in this example (adjust as needed)
});

// Function to handle banner deletion
function deleteBanner(bannerNumber) {
  const modal = document.getElementById("deleteBannerModal");
  const confirmDeleteButton = document.getElementById("confirmDelete");
  const cancelButton = document.querySelector(
    "#deleteBannerModal .modal-footer .btn-secondary"
  );

  // Store the bannerNumber in a data attribute for later use
  modal.dataset.bannerNumber = bannerNumber;

  // Add an event listener for the "Delete" button inside the modal
  confirmDeleteButton.addEventListener("click", function () {
    const bannerNumberToDelete = modal.dataset.bannerNumber;
    modal.classList.remove("show"); // Close the modal
    modal.style.display = "none";

    // Perform the deletion here
    const formdata = new FormData();
    formdata.append("bannerId", bannerNumberToDelete);
    var requestData = {
      bannerId: bannerNumberToDelete,
    };
    fetch(
      `https://api.bhattacharjeesolution.in/book/api/coupon.php?id=${bannerNumberToDelete}`,
      {
        method: "POST",
        headers: {
          token: token,
        },
      }
    )
      .then(function (response) {
        console.log(response);
        return response.json(); // Parse the response as JSON
      })
      .then(function (data) {
        console.log("data:", data);
        alert(data.data || "Successfully Deleted!");
        window.location.reload();
        fetchDataFromAPI(); // Update the table after deletion
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });

    // Remove the event listener to prevent multiple deletions
    confirmDeleteButton.removeEventListener("click", this);
  });

  // Add an event listener to the "Cancel" button to close the modal
  cancelButton.addEventListener("click", function () {
    modal.classList.remove("show");
    modal.style.display = "none";
  });

  // Show the Bootstrap modal
  modal.classList.add("show");
  modal.style.display = "block";
}

// Flag to check if the submit event listener is already added
let isSubmitEventListenerAdded = false;

// Function to handle editing a banner
function editBanner(bannerData) {
  console.log(bannerData);
  const editPopup = document.getElementById("editPopup");
  const editButtons = document.querySelectorAll(".edit-button");
  const closePopupButton = document.getElementById("closePopup");

  const minimum_amount = document.getElementById("minimum_amount");
  const valid_until = document.getElementById("valid_until");
  const valid_from = document.getElementById("valid_from");
  const value = document.getElementById("value");
  const type = document.getElementById("type");
  const code = document.getElementById("code");

  // Set the initial values in the form fields
  minimum_amount.value = bannerData.minimum_amount;
  valid_until.value = bannerData.valid_until;
  valid_from.value = bannerData.valid_from;
  value.value = bannerData.value;
  type.value = bannerData.type;
  code.value = bannerData.code;

  // Show the popup
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      editPopup.style.display = "flex";
    });
  });

  // Add an event listener to the form submission only if it's not already added
  if (!isSubmitEventListenerAdded) {
    const editForm = document.querySelector(".addCategory form");
    editForm.addEventListener("submit", async function (e) {
      e.preventDefault(); // Prevent the form from submitting normally (you can handle the submission logic here)
      // You can access the form data using bannerNameInput.value and bannerImageInput.files[0]

      const formData = {
        code: code.value,
        type: type.value,
        value: value.value,
        valid_from: valid_from.value,
        valid_until: valid_until.value,
        minimum_amount: minimum_amount.value,
        id: bannerData.id,
      };
      console.log(token);
      try {
        fetch("https://api.bhattacharjeesolution.in/book/api/coupon.php", {
          method: "PUT",
          body: JSON.stringify(formData),
          headers: {
            // "Content-Type": "application/json",
            token: token,
          },
        })
          .then(async (response) => {
            // console.log(response);
            // response.json();
            if (response.ok) {
              const data = await response.json();
              console.log(data);
              // Handle success (e.g., display a success message)
              alert("Form submitted successfully!");
              window.location.reload();
              fetchDataFromAPI();
              editPopup.style.display = "none"; // Close the popup after submission (you can replace this with your logic)
            } else {
              // Handle error (e.g., display an error message)
              console.error("Form submission failed!");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            document.querySelector(".error-message").textContent =
              "An error occurred while logging in.";
          });
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });

    isSubmitEventListenerAdded = true; // Set the flag to true to indicate that the listener has been added
  }

  // Close the popup when the "Close" button is clicked
  // closePopupButton.addEventListener("click", () => {
  //   editPopup.style.display = "none";
  // });
}
