const token = localStorage.getItem("user");
function fetchDataFromAPI() {
  fetch("https://api.bhattacharjeesolution.in/book/api/admin-show-book.php", {
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
      populateBannerTable(data);
      console.log("data:", data);
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

// Function to populate the banner table
function populateBannerTable(data) {
  var bannerTable = document.getElementById("banner-table");
  var bannerTableBody = document.getElementById("banner-table-body");

  // Clear the existing rows in bannerTableBody
  while (bannerTableBody.firstChild) {
    bannerTableBody.removeChild(bannerTableBody.firstChild);
  }
  data.forEach(function (item) {
    var row = document.createElement("tr");

    // <td>${item.description}</td>
    // <td>${item.name}</td>
    row.innerHTML = `
              <td>${item.id}</td>
              <td>${item.name}</td>
              <td>${item.description}</td>
              <td><img src="${item.images}" height="50px" widht="50px" /></td>
              <td>${item.type}</td>
              <td>${item.quantity}</td>
              <td>${item.mrp}</td>
              <td>${item.discount}</td>
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
// banner.js
document.addEventListener("DOMContentLoaded", function () {
  var bannerTable = document.getElementById("banner-table");
  var bannerTableBody = document.getElementById("banner-table-body");

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
    const formdata = new FormData();
    formdata.append("id", bannerNumberToDelete);
    fetch(`https://api.bhattacharjeesolution.in/book/api/delete-book.php`, {
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
  fetchCategoryData();
  const editPopup = document.getElementById("editPopup");
  const editButtons = document.querySelectorAll(".edit-button");
  const closePopupButton = document.getElementById("closemodal");
  const bannerImageInput = document.getElementById("fileInput");

  const bannerNameInput = document.getElementById("name");
  const category = document.getElementById("category");
  const bannerDescripitonInput = document.getElementById("description");
  const mrp = document.getElementById("mrp");
  const quantity = document.getElementById("quantity");
  const discount = document.getElementById("discount");
  const lang = document.getElementById("lang");
  const type = document.getElementById("type");
  const bannerImagePreInput = document.getElementById("imagePreview");
  // const image= document.getElementById("image").files[0];

  // Set the initial values in the form fields
  bannerNameInput.value = bannerData.name;
  bannerDescripitonInput.value = bannerData.description;
  category.value = bannerData.categoryId;
  mrp.value = bannerData.mrp;
  quantity.value = bannerData.quantity;
  discount.value = bannerData.discount;
  lang.value = bannerData.lang;
  type.value = bannerData.type;
  bannerImagePreInput.src = `${bannerData?.image}`;
  bannerImagePreInput.style.display = "block";

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
      // console.log(
      //   "Form submitted:",
      //   bannerNameInput.value,
      //   bannerImageInput.files[0]
      // );
      console.log("id", bannerData.id);

      const formData = new FormData();
      formData.append("name", document.getElementById("name").value);
      formData.append(
        "description",
        document.getElementById("description").value
      );
      formData.append("categoryId", document.getElementById("category").value);
      formData.append("mrp", document.getElementById("mrp").value);
      formData.append("quantity", document.getElementById("quantity").value);
      formData.append("discount", document.getElementById("discount").value);
      formData.append("lang", document.getElementById("lang").value);
      formData.append("type", document.getElementById("type").value);
      formData.append("image", document.getElementById("image").files[0]);
      formData.append("id", bannerData.id);
      // formData.append("pdf", document.getElementById("pdf").files[0]);

      try {
        const response = await fetch(
          "https://api.bhattacharjeesolution.in/book/api/edit-book.php",
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

function fetchCategoryData() {
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

      // Add an event listener to fetch subcategories when a category is selected
      // categorySelect.addEventListener("change", fetchSubcategories);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
