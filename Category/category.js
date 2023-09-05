const token = localStorage.getItem("user");
// Function to populate the category table

function fetchDataFromAPI() {
  console.log("fetchig");
  // fetch(
  // "https://api.bhattacharjeesolution.in/book/api/admin-show-banner.php",
  fetch(
    "https://api.bhattacharjeesolution.in/book/api/admin-show-category.php",
    {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    }
  ) // Replace with your API endpoint
    .then(function (response) {
      // console.log(response);
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
      return response.json(); // Parse the response as JSON
    })
    .then(function (data) {
      // Call the populateBannerTableWithData function with the retrieved data
      console.log("data:", data);
      populateCategoryTable(data);
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

function populateCategoryTable(data) {
  var categoryTable = document.getElementById("category-table");
  var categoryTableBody = document.getElementById("category-table-body");

  // Clear the existing rows in bannerTableBody
  while (categoryTableBody.firstChild) {
    categoryTableBody.removeChild(categoryTableBody.firstChild);
  }

  data.forEach(function (item) {
    var row = document.createElement("tr");

    row.innerHTML = `
                  <td>${item.id}</td>
                  <td>${item.name}</td>
                  <td>
                  <img src="${item.image.replace(
                    " ",
                    "%20"
                  )}" alt="" style="width: calc(80% - 30px); flex: 5; object-fit: cover; max-width: 100px; max-height: 100px;" />
                  </td>
                  <td>${item.description}</td>
                  <td>
                      <button class="edit-button" style="border: none" data-coupon='${JSON.stringify(
                        item
                      )}'>
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button style="border: none; color: red"  onclick="deleteCategory(${
                          item.id
                        })">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                  </td>
              `;

    categoryTableBody.appendChild(row);

    var editButton = row.querySelector(".edit-button");
    editButton.addEventListener("click", function () {
      var couponData = JSON.parse(editButton.getAttribute("data-coupon"));
      editCategory(couponData);
    });
  });
}

// category.js
document.addEventListener("DOMContentLoaded", function () {
  var categoryTable = document.getElementById("category-table");
  var categoryTableBody = document.getElementById("category-table-body");
  console.log("handleskjl");
  // Sample category data (simulated delay for demonstration)
  setTimeout(function () {
    var categoryData = [
      {
        Number: 1,
        Name: "Category 1",
        Image: "image1.jpg",
        Description: "Description 1",
      },
      {
        Number: 2,
        Name: "Category 2",
        Image: "image2.jpg",
        Description: "Description 2",
      },
      // Add more category data as needed
    ];

    // Call the populateCategoryTable function with your category data on initial render
    // populateCategoryTable(categoryData);
    fetchDataFromAPI();
  }, 0); // No simulated delay in this example (adjust as needed)

  // Create a message element for displaying "No categories found" message
  const noCategoryMessage = document.createElement("div");
  noCategoryMessage.textContent = "No categories found";
  noCategoryMessage.style.display = "none"; // Initially hide the message
  noCategoryMessage.style.textAlign = "center"; // Center-align the message
  noCategoryMessage.style.padding = "10px"; // Add padding
  noCategoryMessage.style.fontSize = "18px"; // Increase text size

  // Append the message element just below the table
  categoryTable.parentNode.insertBefore(
    noCategoryMessage,
    categoryTable.nextSibling
  );

  // Add an event listener to the search input field
  const searchInput = document.getElementById("searchbar");
  searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.trim().toLowerCase(); // Get the search text and convert to lowercase

    // Loop through the table rows (skip the first row which is the header)
    const rows = categoryTableBody.querySelectorAll("tr");
    let anyMatch = false; // Flag to track if any match is found

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const nameColumn = row.querySelector("td:nth-child(2)"); // Target the "Name" column (2nd column)
      const nameText = nameColumn.textContent.trim().toLowerCase();

      // Hide or show the row based on the search criteria for the "Name" column
      if (nameText.includes(searchText)) {
        row.style.display = ""; // Show the row
        anyMatch = true; // Match found
      } else {
        row.style.display = "none"; // Hide the row
      }
    }

    // Show or hide the "No categories found" message based on search results
    if (anyMatch) {
      noCategoryMessage.style.display = "none"; // Hide the message
    } else {
      // Hide all rows (except the header) and show the message
      for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = "none"; // Hide all rows except the header
      }
      noCategoryMessage.style.display = "block"; // Show the message
    }
  });
});

// Function to handle category deletion
function deleteCategory(categoryNumber) {
  // Add your code here to handle the deletion of the category with the specified Number
  // For example, you can show a confirmation dialog and then remove the category from the table and data array
  // alert("Category with Number " + categoryNumber + " will be deleted.");
  if (window.confirm("Are you sure?") == true) {
    console.log("num", categoryNumber);
    const formdata = new FormData();
    formdata.append("categoryId", categoryNumber);
    fetch(`https://api.bhattacharjeesolution.in/book/api/delete-category.php`, {
      method: "POST",
      // body: JSON.stringify(requestData),
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
        // Call the populateBannerTableWithData function with the retrieved data
        fetchDataFromAPI();
        console.log("data:", data);
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });
  }
}

// Function to handle editing a category
function editCategory(categoryData) {
  console.log(categoryData);
  const editButtons = document.querySelectorAll(".edit-button");
  const editPopup = document.getElementById("editPopup");
  const closePopupButton = document.getElementById("closePopup");
  const nameInput = document.getElementById("name");
  const imageInput = document.getElementById("image");
  const categoryImageInput = document.getElementById("fileInput");
  const categoryImagePreInput = document.getElementById("preimage");
  const descriptionInput = document.getElementById("description");

  // Set the initial values in the form fields
  nameInput.value = categoryData.name;
  descriptionInput.value = categoryData.description;
  categoryImagePreInput.src = `${categoryData.image.replace(" ", "%20")}`;

  // Show the popup
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      editPopup.style.display = "flex";
    });
  });
  // editPopup.style.display = "flex";

  // Add an event listener to the form submission
  const editForm = document.querySelector(".addCategory form");
  editForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the form from submitting normally (you can handle the submission logic here)
    // You can access the form data using nameInput.value, imageInput.files, and descriptionInput.value
    console.log(
      "Form submitted:",
      nameInput.value,
      categoryImageInput.files[0],
      descriptionInput.value
    );

    const formData = new FormData();
    formData.append("name", nameInput.value);
    formData.append("description", descriptionInput.value);
    formData.append("image", categoryImageInput.files[0]);
    formData.append("categoryId", categoryData.id);

    try {
      const response = await fetch(
        "https://api.bhattacharjeesolution.in/book/api/edit-category.php",
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
    editPopup.style.display = "none"; // Close the popup after submission (you can replace this with your logic)
  });

  // Close the popup when the "Close" button is clicked
  closePopupButton.addEventListener("click", () => {
    editPopup.style.display = "none";
  });
}
