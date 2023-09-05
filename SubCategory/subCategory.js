const token = localStorage.getItem("user");
function fetchDataFromAPI() {
  fetch(
    "https://api.bhattacharjeesolution.in/book/api/admin-show-subcategory.php",
    {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    }
  ) // Replace with your API endpoint
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
  // Add your code here to handle the deletion of the banner with the specified Number
  // For example, you can show a confirmation dialog and then remove the banner from the table and data array
  // alert("Banner with Number " + bannerNumber + " will be deleted.");
  if (window.confirm("Are you sure?") == true) {
    console.log(bannerNumber);
    const formdata = new FormData();
    formdata.append("categoryId", bannerNumber);
    var requestData = {
      bannerId: bannerNumber,
    };
    fetch(
      `https://api.bhattacharjeesolution.in/book/api/delete-subcategory.php`,
      {
        method: "POST",
        // body: JSON.stringify(requestData),
        body: formdata,
        headers: {
          token: token,
        },
      }
    )
      .then(function (response) {
        console.log(response);
        return response.json(); // Parse the response as JSON\
      })
      .then(function (data) {
        // Call the populateBannerTableWithData function with the retrieved data
        // populateBannerTable(data);
        fetchDataFromAPI();
        console.log("data:", data);
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });
  }
}

// Flag to check if the submit event listener is already added
let isSubmitEventListenerAdded = false;

// Function to handle editing a banner
function editBanner(bannerData) {
  console.log(bannerData);
  fetchCategoryData();
  const editPopup = document.getElementById("editPopup");
  const editButtons = document.querySelectorAll(".edit-button");
  const closePopupButton = document.getElementById("closePopup");
  const bannerNameInput = document.getElementById("name");
  const bannerImageInput = document.getElementById("fileInput");
  const bannerImagePreInput = document.getElementById("preimage");
  const bannerDescripitonInput = document.getElementById("description");
  const category = document.getElementById("category");

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
      console.log("id", bannerData.id);

      const formData = new FormData();
      formData.append("name", bannerNameInput.value);
      formData.append("description", bannerDescripitonInput.value);
      formData.append("image", bannerImageInput.files[0]);
      formData.append("id", bannerData.id);
      formData.append("categoryId", category.value);

      try {
        const response = await fetch(
          "https://api.bhattacharjeesolution.in/book/api/edit-subcategory.php",
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
