const token = localStorage.getItem("user");

// Number of items per page
var itemsPerPage = 5;
var currentPage = 1;
var allBannersData;
var filteredBannersData = []; // This will store the filtered data

function fetchDataFromAPI() {
  fetch("https://api.bhattacharjeesolution.in/book/api/admin-show-banner.php", {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  })
    .then(function (response) {
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the response as JSON
    })
    .then(function (data) {
      // Store the fetched data globally
      allBannersData = data;

      // Call the populateBannerTable function with the retrieved data
      populateBannerTable(currentPage);

      // Handle pagination
      handlePagination();
      console.log("data:", data);
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

// Function to populate the banner table
function populateBannerTable(page) {
  var bannerTable = document.getElementById("banner-table");
  var bannerTableBody = document.getElementById("banner-table-body");

  // Clear the existing rows in bannerTableBody
  while (bannerTableBody.firstChild) {
    bannerTableBody.removeChild(bannerTableBody.firstChild);
  }

  var startIndex = (page - 1) * itemsPerPage;
  var endIndex = startIndex + itemsPerPage;
  // var data = allBannersData.slice(startIndex, endIndex);
  filteredBannersData = allBannersData.slice(startIndex, endIndex);

  filteredBannersData.forEach(function (item) {
    var row = document.createElement("tr");
    row.id = "row-" + item.id; // Assign a unique ID to each row
    row.innerHTML = `
              <td>${item.id}</td>
              <td>${item.name}</td>
              <td>${item.description}</td>
              <td>
              <img src="${item.image.replace(
                " ",
                "%20"
              )}" alt="" style="width: calc(80% - 30px); flex: 5; object-fit: cover; max-width: 100px; max-height: 100px;" />
              </td>
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
    editButton.addEventListener("click", function () {
      var couponData = JSON.parse(editButton.getAttribute("data-coupon"));
      editBanner(couponData);
    });
  });
}

function handlePagination() {
  var pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  var totalPages = Math.ceil(allBannersData.length / itemsPerPage);

  for (var i = 1; i <= totalPages; i++) {
    var pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.textContent = i;
    pageLink.className = "btn btn-outline-primary"; // Apply Bootstrap styling here

    pageLink.addEventListener("click", function (e) {
      e.preventDefault();
      currentPage = parseInt(this.textContent);
      populateBannerTable(currentPage);
    });

    pagination.appendChild(pageLink);
  }
}

// banner.js
document.addEventListener("DOMContentLoaded", function () {
  var bannerTable = document.getElementById("banner-table");
  var bannerTableBody = document.getElementById("banner-table-body");

  // Sample banner data (simulated delay for demonstration)
  setTimeout(function () {
    // Call the populateBannerTable function with your banner data on initial render
    // populateBannerTable(bannerData);
    // Function to fetch data from the API
    // handlePagination();
    fetchDataFromAPI(currentPage);

    // Add an event listener to the search input field
    var searchInput = document.getElementById("searchbar");
    searchInput.addEventListener("input", function () {
      var searchText = searchInput.value.trim().toLowerCase();

      // Loop through the filtered data
      for (var i = 0; i < filteredBannersData.length; i++) {
        var item = filteredBannersData[i];
        var nameText = item.name.trim().toLowerCase();
        var row = document.getElementById("row-" + item.id); // Get the corresponding row by ID
        console.log("nameText:", nameText);
        console.log("searchText:", searchText);

        if (row) {
          if (nameText.includes(searchText)) {
            row.style.display = ""; // Show the row
          } else {
            row.style.display = "none"; // Hide the row
          }
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
    fetch(`https://api.bhattacharjeesolution.in/book/api/delete-banner.php`, {
      method: "POST",
      body: formdata,
      headers: {
        token: token,
      },
    })
      .then(function (response) {
        console.log(response);
        return response.json(); // Parse the response as JSON
      })
      .then(function (data) {
        fetchDataFromAPI(); // Update the table after deletion
        console.log("data:", data);
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
  const bannerNameInput = document.getElementById("name");
  const bannerImageInput = document.getElementById("fileInput");
  const bannerImagePreInput = document.getElementById("preimage");
  const bannerDescripitonInput = document.getElementById("description");

  // Set the initial values in the form fields
  bannerNameInput.value = bannerData.name;
  bannerDescripitonInput.value = bannerData.description;
  bannerImagePreInput.src = `${bannerData.image.replace(" ", "%20")}`;

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
      console.log(
        "Form submitted:",
        bannerNameInput.value,
        bannerImageInput.files[0]
      );

      const formData = new FormData();
      formData.append("name", bannerNameInput.value);
      formData.append("description", bannerDescripitonInput.value);
      if (bannerImageInput.files[0]) {
        formData.append("image", bannerImageInput.files[0]);
      }
      formData.append("bannerId", bannerData.id);
      console.log(token);
      try {
        fetch("https://api.bhattacharjeesolution.in/book/api/edit-banner.php", {
          method: "POST",
          body: formData,
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
              console.log("Form submitted successfully!");
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
  closePopupButton.addEventListener("click", () => {
    editPopup.style.display = "none";
  });
}
