// Define global variables for pagination
var currentPage = 1;
var itemsPerPage = 10; // Number of items to display per page
var filteredData = [];
var totalFilteredPages = 1; // Initialize to 1 page
const token = localStorage.getItem("user");

function fetchDataFromAPI() {
  fetch("https://api.bhattacharjeesolution.in/book/api/news.php", {
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
      console.log("data:", data.length);
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}
window.addEventListener("load", fetchDataFromAPI);

// Function to populate the banner table
function populateBannerTable(data) {
  var bannerTable = document.getElementById("banner-table");
  var bannerTableBody = document.getElementById("banner-table-body");

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

    // <td>${item.description}</td>
    // <td>${item.name}</td>
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.title}</td>
      <td>${item.description}</td>
      <td><img src="${item.images}" height="50px" widht="50px" /></td>
      <td>${item.added_by}</td>
      <td>${item.created_at}</td>
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

  // updatePaginationControls(totalFilteredPages);
  updatePaginationControls(data.length);
}

function searchTable() {
  const searchInput = document.getElementById("searchbar").value.toLowerCase();

  // Filter the data based on the search query
  filteredData = window.fetchedData.filter(function (item) {
    return item.title.toLowerCase().includes(searchInput);
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

// Function to handle banner deletion
function deleteBanner(bannerNumber) {
  const modal = document.getElementById("deleteBannerModal");
  const confirmDeleteBannerButton = document.getElementById(
    "confirmDeleteBanner"
  );
  const cancelButton = document.querySelector(
    "#deleteBannerModal .modal-footer .btn-secondary"
  );

  // Store the bannerNumber in a data attribute for later use
  modal.dataset.bannerNumber = bannerNumber;

  // Add an event listener for the "Delete" button inside the modal
  confirmDeleteBannerButton.addEventListener("click", function () {
    const bannerNumberToDelete = modal.dataset.bannerNumber;
    modal.classList.remove("show"); // Close the modal
    modal.style.display = "none";

    // Perform the deletion here
    console.log("id:", bannerNumberToDelete);
    // const formdata = new FormData();
    // formdata.append("id", bannerNumberToDelete);
    fetch(
      `https://api.bhattacharjeesolution.in/book/api/news.php?id=${bannerNumberToDelete}`,
      {
        method: "DELETE",
        // body: formdata,
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
        console.log(data);
        alert(data.data || "Book deleted!");
        window.location.reload();
        fetchDataFromAPI(); // Update the table after deletion
        console.log("data:", data);
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });

    // Remove the event listener to prevent multiple deletions
    confirmDeleteBannerButton.removeEventListener("click", this);
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
  fetchCategoryData(bannerData.categoryId);
  const editPopup = document.getElementById("editPopup");
  // const editButtons = document.querySelectorAll(".edit-button");
  const closePopupButton = document.getElementById("closemodal");
  // const bannerImageInput = document.getElementById("fileInput");
  editPopup.style.display = "flex";

  const bannerNameInput = document.getElementById("name");
  const category = document.getElementById("category");
  const bannerDescripitonInput = document.getElementById("description");
  const lang = document.getElementById("lang");
  const type = document.getElementById("type");
  const bannerImagePreInput = document.getElementById("imagePreview");
  // const image= document.getElementById("image").files[0];

  // Set the initial values in the form fields
  bannerNameInput.value = bannerData.title;
  bannerDescripitonInput.value = bannerData.description;
  category.value = bannerData.categoryId;
  lang.value = bannerData.lang;
  // type.value = bannerData.type;
  bannerImagePreInput.src = `${bannerData?.image}`;
  bannerImagePreInput.style.display = "block";

  // Show the popup
  // editButtons.forEach((button) => {
  //   button.addEventListener("click", () => {
  //   });
  // });

  // Add an event listener to the form submission only if it's not already added
  if (!isSubmitEventListenerAdded) {
    const editForm = document.querySelector(".addCategory form");
    editForm.addEventListener("submit", async function (e) {
      e.preventDefault(); // Prevent the form from submitting normally (you can handle the submission logic here)
      // You can access the form data using bannerNameInput.value and bannerImageInput.files[0]
      // console.log(
      //   "Form submitted:",
      //   bannerNameInput.value,
      //   bannerImageInput.files[0]
      // );
      console.log("id", bannerData.id);

      const formData = new FormData();
      formData.append("title", document.getElementById("name").value);
      formData.append(
        "description",
        document.getElementById("description").value
      );
      formData.append("category_id", document.getElementById("category").value);
      formData.append("lang", document.getElementById("lang").value);
      formData.append("update", 1);
      formData.append("added_by ", "Hunda");
      formData.append("photo", document.getElementById("image").files[0]);
      formData.append("news_id", bannerData.id);
      try {
        const response = await fetch(
          "https://api.bhattacharjeesolution.in/book/api/news.php",
          {
            method: "POST",
            body: formData,
            headers: {
              token: token,
            },
          }
        );

        if (response.ok) {
          // Handle success (e.g., display a success message)
          console.log("Form submitted successfully!");
          window.location.reload();
          fetchDataFromAPI();
          editPopup.style.display = "none"; // Close the popup after submission (you can replace this with your logic)
        } else {
          // Handle error (e.g., display an error message)
          console.error("Form submission failed!");
        }
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

// Add event listeners for opening the popup when the "edit" buttons are clicked
// const editButtons = document.querySelectorAll(".edit-button");
// editButtons.forEach((button) => {
//   const couponData = JSON.parse(button.getAttribute("data-coupon"));
//   addEditButtonClickHandler(button, couponData);
// });

function fetchCategoryData(id) {
  // Replace 'YOUR_API_URL' with the actual API endpoint
  console.log("fethichg", token);
  fetch(
    "https://api.bhattacharjeesolution.in/book/api/admin-show-category.php",
    {
      headers: {
        token: token,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);
      const categorySelect = document.getElementById("category");

      // Clear existing options
      categorySelect.innerHTML = "";

      // Add a default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "0";
      defaultOption.textContent = "Select a category";
      categorySelect.appendChild(defaultOption);

      // Populate the select with data from the API
      data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });

      categorySelect.value = id;

      // Add an event listener to fetch subcategories when a category is selected
      // categorySelect.addEventListener("change", fetchSubcategories);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
