// Define global variables for pagination
var currentPage = 1;
var itemsPerPage = 10; // Number of items to display per page
var filteredData = [];
var totalFilteredPages = 1; // Initialize to 1 page
const token = localStorage.getItem("user");
// Function to populate the category table

function fetchDataFromAPI() {
  console.log("fetchig");
  const courseid = localStorage.getItem("addCourseDetailId");
  // fetch(
  // "https://api.bhattacharjeesolution.in/book/api/admin-show-banner.php",
  fetch(
    `https://api.bhattacharjeesolution.in/book/api/courses.php?type=video&id=${courseid}`,
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
    .then(function (odata) {
      const data = [];
      data.push(odata);
      // Call the populateBannerTableWithData function with the retrieved data
      console.log("data:", data);
      window.fetchedData = data;
      filteredData = data;
      totalFilteredPages = data.length; // Calculate total pages for the original data
      populateCategoryTable(data);
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

function populateCategoryTable(data) {
  var categoryTable = document.getElementById("category-table");
  var categoryTableBody = document.getElementById("category-table-body");
  var videoBody = document.getElementById("table-video");

  // Clear the existing rows in bannerTableBody
  while (categoryTableBody.firstChild) {
    categoryTableBody.removeChild(categoryTableBody.firstChild);
  }
  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  for (let index = startIndex; index < endIndex; index++) {
    const item = data[index];
    var row = document.createElement("tr");

    var tbody = document.createElement("tbody");
    tbody.innerHTML = `
      <tr>
        <th>#</th>
        <td>${item.id}</td>
      </tr>
      <tr>
        <th>Name</th>
        <td>${item.name}</td>
      </tr>
      <tr>
        <th>Image</th>
        <td>
          <img src="${item.images[0]}" alt="" style="width: calc(80% - 30px); flex: 5; object-fit: cover; max-width: 100px; max-height: 100px;" />
        </td>
      </tr>
      <tr>
        <th>Price</th>
        <td>${item.mrp}</td>
      </tr>
      <tr>
        <th>Discount</th>
        <td>${item.discount}</td>
      </tr>
      <tr>
        <th>Type</th>
        <td>${item.type}</td>
      </tr>
      <tr>
        <th>Description</th>
        <td>${item.description}</td>
      </tr>
      `;

    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>
      <img src="${
        item.image
      }" alt="" style="width: calc(80% - 30px); flex: 5; object-fit: cover; max-width: 100px; max-height: 100px;" />
      </td>
      <td>${item.mrp}</td>
      <td>${item.discount}</td>
      <td>${item.type}</td>
      <td>${item.description}</td>
      <td class="addstyle">
        <a href="#" onclick="sendDetail(${item.id})">View Resources</a> 
      </td>
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
        </td>`;
    // <a href="#" onclick="sendTest(${item.id}, '${item.name}')">Test</a>
    // <a href="#" onclick="sendPdf(${item.id}, '${item.name}')">Pdfs</a>
    // <a href="#" onclick="sendRoute(${item.id}, '${item.name}')">Video</a>

    categoryTableBody.appendChild(tbody);

    var editButton = row.querySelector(".edit-button");
    // Use a closure to capture the item data for each edit button
    addEditButtonClickHandler(editButton, item);
    console.log(item);
    console.log(item.videos);
    // if (item.videos) {

    var newbody = document.createElement("tbody");

    // Loop through the object and populate the table
    for (const day in item.videos) {
      console.log("day:", day);
      if (item.videos.hasOwnProperty(day)) {
        const items = item.videos[day];
        console.log("items", items);

        items.forEach((item) => {
          const rowss = document.createElement("tr");
          rowss.innerHTML = `
                    <td>${day}</td>
                    <td>${item.title}</td>
                    <td>Video</td>
                    <td>${item.description}</td>
                    <td><a href="${item.link}" target="_blank">${
            item.link
          }</a></td>
                    <td>
        <button class="edit-button" style="border: none"  onclick="handleVideoEdit('${encodeURIComponent(
          JSON.stringify(item)
        )}')" data-coupon='${JSON.stringify(item)}'>
          <i class="fa-solid fa-pen"></i>
        </button>
        <button style="border: none; color: red"  onclick="deleteVideo(${
          item.id
        })">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
                `;
          console.log(rowss);
          newbody.appendChild(rowss);
        });
      }
    }
    for (const day in item.pdfs) {
      console.log("day:", day);
      if (item.pdfs.hasOwnProperty(day)) {
        const items = item.pdfs[day];
        console.log("items", items);

        items.forEach((item) => {
          const rowss = document.createElement("tr");
          rowss.innerHTML = `
            <td>${day}</td>
            <td>${item.title}</td>
            <td>PDF</td>
            <td>${item.description}</td>
            <td><a href="${item.link}" target="_blank">${item.link}</a></td>
            <td>
              <button class="edit-button" style="border: none" onclick="handleEditCoaching('${encodeURIComponent(
                JSON.stringify(item)
              )}')" data-coupon='${JSON.stringify(item)}'>
                <i class="fa-solid fa-pen"></i>
              </button>
              <button style="border: none; color: red"  onclick="deletePdfs(${
                item.id
              })">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          `;
          console.log(rowss);
          newbody.appendChild(rowss);
        });
      }
    }
    for (const day in item.tests) {
      console.log("day:", day);
      if (item.tests.hasOwnProperty(day)) {
        const items = item.tests[day];
        console.log("items", items);

        items.forEach((item) => {
          const rowss = document.createElement("tr");
          rowss.innerHTML = `
            <td>${day}</td>
            <td>${item.title}</td>
            <td>Tests</td>
            <td>${item.description}</td>
            <td><a href="${item.link}" target="_blank">${item.link}</a></td>
            <td>
              <button class="edit-button" style="border: none" onclick="handleEditTests('${encodeURIComponent(
                JSON.stringify(item)
              )}')" data-coupon='${JSON.stringify(item)}'>
                <i class="fa-solid fa-pen"></i>
              </button>
              <button style="border: none; color: red"  onclick="deleteTests(${
                item.id
              })">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          `;
          console.log(rowss);
          newbody.appendChild(rowss);
        });
      }
    }
    videoBody.appendChild(newbody);
    localStorage.setItem("addvideoId", item.id);
    localStorage.setItem("addvideoName", item.name);
    // }
  }
  function addEditButtonClickHandler(editButton, item) {
    editButton.addEventListener("click", function () {
      var couponData = JSON.parse(editButton.getAttribute("data-coupon"));
      editCategory(item); // Pass the 'item' to the editCategory function
    });
  }

  updatePaginationControls(data.length);
}

function handleEditCoaching(itemString) {
  const item = JSON.parse(decodeURIComponent(itemString));
  console.log(item);

  const typediplay = document.getElementById("pdfdisplay");
  typediplay.style.display = "flex";
  typediplay.style.flexDirection = "column";

  const editButtons = document.querySelectorAll(".edit-button");
  const editPopup = document.getElementById("editPopup");
  const closePopupButton = document.getElementById("closemodal");

  document.getElementById("nameedit").value = item.title;
  document.getElementById("descriptionedit").value = item.description;
  // const category = document.getElementById("category").value;
  // const pdf = document.getElementById("pdf").files[0];
  document.getElementById("daynoedit").value = item.day_no;

  editPopup.style.display = "flex";
  // editPopup.style.display = "flex";

  // Add an event listener to the form submission
  const editForm = document.querySelector(".addCategory form");
  editForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the form from submitting normally (you can handle the submission logic here)
    // You can access the form data using nameInput.value, imageInput.files, and descriptionInput.value

    const formData = new FormData();
    formData.append("title", document.getElementById("nameedit").value);
    formData.append(
      "description",
      document.getElementById("descriptionedit").value
    );
    // formData.append("course_id", item.id);
    // formData.append("content", document.getElementById("pdfedit").files[0]);
    formData.append("day_no", document.getElementById("daynoedit").value);
    formData.append("course_id", localStorage.getItem("addCourseDetailId"));

    fetch(
      `https://api.bhattacharjeesolution.in/book/api/pdf.php/?id=${item.id}`,
      {
        method: "POST",
        body: formData,
        headers: {
          token: token,
        },
      }
    )
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.message) {
          // Handle success (e.g., display a success message)
          alert(res.message || "Form submitted successfully!");
          window.location.reload();
          // fetchDataFromAPI();
          editPopup.style.display = "none"; // Close the popup after submission (you can replace this with your logic)
        } else {
          // Handle error (e.g., display an error message)
          console.error("Form submission failed!");
          alert(res.error || "Form submission failed!");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    // editPopup.style.display = "none"; // Close the popup after submission (you can replace this with your logic)
  });

  // Close the popup when the "Close" button is clicked
  closePopupButton.addEventListener("click", () => {
    editPopup.style.display = "none";
  });
}

function handleEditTests(itemString) {
  const item = JSON.parse(decodeURIComponent(itemString));
  console.log(item);

  const typediplay = document.getElementById("pdfdisplay");
  typediplay.style.display = "flex";
  typediplay.style.flexDirection = "column";

  const editButtons = document.querySelectorAll(".edit-button");
  const editPopup = document.getElementById("editPopup");
  const closePopupButton = document.getElementById("closemodal");

  document.getElementById("nameedit").value = item.title;
  document.getElementById("descriptionedit").value = item.description;
  // const category = document.getElementById("category").value;
  // const pdf = document.getElementById("pdf").files[0];
  document.getElementById("daynoedit").value = item.day_no;

  editPopup.style.display = "flex";
  // editPopup.style.display = "flex";

  // Add an event listener to the form submission
  const editForm = document.querySelector(".addCategory form");
  editForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the form from submitting normally (you can handle the submission logic here)
    // You can access the form data using nameInput.value, imageInput.files, and descriptionInput.value

    const formData = new FormData();
    formData.append("title", document.getElementById("nameedit").value);
    formData.append(
      "description",
      document.getElementById("descriptionedit").value
    );
    // formData.append("course_id", item.id);
    // formData.append("content", document.getElementById("pdfedit").files[0]);
    formData.append("day_no", document.getElementById("daynoedit").value);
    formData.append("course_id", localStorage.getItem("addCourseDetailId"));

    fetch(
      `https://api.bhattacharjeesolution.in/book/api/test.php/?id=${item.id}`,
      {
        method: "POST",
        body: formData,
        headers: {
          token: token,
        },
      }
    )
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.message) {
          // Handle success (e.g., display a success message)
          alert(res.message || "Form submitted successfully!");
          window.location.reload();
          // fetchDataFromAPI();
          editPopup.style.display = "none"; // Close the popup after submission (you can replace this with your logic)
        } else {
          // Handle error (e.g., display an error message)
          console.error("Form submission failed!");
          alert(res.error || "Form submission failed!");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    // editPopup.style.display = "none"; // Close the popup after submission (you can replace this with your logic)
  });

  // Close the popup when the "Close" button is clicked
  closePopupButton.addEventListener("click", () => {
    editPopup.style.display = "none";
  });
}

function handleVideoEdit(itemString) {
  const item = JSON.parse(decodeURIComponent(itemString));
  console.log(item);
  console.log(item);

  const typediplay = document.getElementById("videodisplay");
  typediplay.style.display = "flex";
  typediplay.style.flexDirection = "column";

  const editButtons = document.querySelectorAll(".edit-button");
  const editPopup = document.getElementById("editPopup");
  const closePopupButton = document.getElementById("closemodal");

  document.getElementById("nameedit").value = item.title;
  document.getElementById("descriptionedit").value = item.description;
  // const category = document.getElementById("category").value;
  document.getElementById("linkedit").value = item.link;
  document.getElementById("daynoedit").value = item.day_no;

  editPopup.style.display = "flex";
  // editPopup.style.display = "flex";

  // Add an event listener to the form submission
  const editForm = document.querySelector(".addCategory form");
  editForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the form from submitting normally (you can handle the submission logic here)
    // You can access the form data using nameInput.value, imageInput.files, and descriptionInput.value

    const formData = {
      title: document.getElementById("nameedit").value,
      description: document.getElementById("descriptionedit").value,
      link: document.getElementById("linkedit").value,
      day_no: document.getElementById("daynoedit").value,
      course_id: localStorage.getItem("addCourseDetailId"),
    };
    // formData.append("course_id", item.id);

    fetch(
      `https://api.bhattacharjeesolution.in/book/api/video.php/?id=${item.id}`,
      {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          token: token,
        },
      }
    )
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.message) {
          // Handle success (e.g., display a success message)
          alert(res.message || "Form submitted successfully!");
          window.location.reload();
          // fetchDataFromAPI();
          editPopup.style.display = "none"; // Close the popup after submission (you can replace this with your logic)
        } else {
          // Handle error (e.g., display an error message)
          console.error("Form submission failed!");
          alert(res.error || "Form submission failed!");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    // editPopup.style.display = "none"; // Close the popup after submission (you can replace this with your logic)
  });

  // Close the popup when the "Close" button is clicked
  closePopupButton.addEventListener("click", () => {
    editPopup.style.display = "none";
  });
}

function sendDetail(id) {
  console.log("routing");
  localStorage.setItem("addCourseDetailId", id);
  window.location.href = "DetailCourse.html";
}

function sendTest(id, name) {
  console.log("routing");
  localStorage.setItem("addvideoId", id);
  localStorage.setItem("addvideoName", name);
  window.location.href = "AddTest.html";
}

function sendPdf(id, name) {
  console.log("routing");
  localStorage.setItem("addvideoId", id);
  localStorage.setItem("addvideoName", name);
  window.location.href = "AddPdf.html";
}

function sendRoute(id, name) {
  console.log("routing");
  localStorage.setItem("addvideoId", id);
  localStorage.setItem("addvideoName", name);
  window.location.href = "AddVideo.html";
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
  totalFilteredPages = filteredData.length / itemsPerPage;

  // Update the pagination controls based on the filtered data length
  updatePaginationControls(filteredData.length);
  // Update the table with the filtered data
  populateCategoryTable(filteredData);
}

function updatePaginationControls(totalItems) {
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
    populateCategoryTable(filteredData); // Display data for the updated page
  }
}

function nextPage() {
  const totalPages = Math.ceil(window.fetchedData.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    populateCategoryTable(filteredData); // Display data for the updated page
  }
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
function deleteTests(categoryNumber) {
  const modal = document.getElementById("deleteCategoryModal");
  const confirmDeleteCategoryButton = document.getElementById(
    "confirmDeleteCategory"
  );
  const cancelButton = document.querySelector(
    "#deleteCategoryModal .modal-footer .btn-secondary"
  );

  // Store the categoryNumber in a data attribute for later use
  modal.dataset.categoryNumber = categoryNumber;

  // Add an event listener for the "Delete" button inside the modal
  confirmDeleteCategoryButton.addEventListener("click", function () {
    const categoryNumberToDelete = modal.dataset.categoryNumber;
    modal.classList.remove("show"); // Close the modal
    modal.style.display = "none";

    // Perform the deletion here
    const formdata = new FormData();
    formdata.append("categoryId", categoryNumberToDelete);
    fetch(
      `https://api.bhattacharjeesolution.in/book/api/test.php?id=${categoryNumberToDelete}`,
      {
        method: "DELETE",
        body: formdata,
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
        alert(data.data || "Successfully Deleted!");
        window.location.reload();
        console.log("data:", data);
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });

    // Remove the event listener to prevent multiple deletions
    confirmDeleteCategoryButton.removeEventListener("click", this);
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
// Function to handle category deletion
function deletePdfs(categoryNumber) {
  const modal = document.getElementById("deleteCategoryModal");
  const confirmDeleteCategoryButton = document.getElementById(
    "confirmDeleteCategory"
  );
  const cancelButton = document.querySelector(
    "#deleteCategoryModal .modal-footer .btn-secondary"
  );

  // Store the categoryNumber in a data attribute for later use
  modal.dataset.categoryNumber = categoryNumber;

  // Add an event listener for the "Delete" button inside the modal
  confirmDeleteCategoryButton.addEventListener("click", function () {
    const categoryNumberToDelete = modal.dataset.categoryNumber;
    modal.classList.remove("show"); // Close the modal
    modal.style.display = "none";

    // Perform the deletion here
    const formdata = new FormData();
    formdata.append("categoryId", categoryNumberToDelete);
    fetch(
      `https://api.bhattacharjeesolution.in/book/api/pdf.php?id=${categoryNumberToDelete}`,
      {
        method: "DELETE",
        body: formdata,
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
        alert(data.data || "Successfully Deleted!");
        window.location.reload();
        console.log("data:", data);
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });

    // Remove the event listener to prevent multiple deletions
    confirmDeleteCategoryButton.removeEventListener("click", this);
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

// Function to handle category deletion
function deleteVideo(categoryNumber) {
  const modal = document.getElementById("deleteCategoryModal");
  const confirmDeleteCategoryButton = document.getElementById(
    "confirmDeleteCategory"
  );
  const cancelButton = document.querySelector(
    "#deleteCategoryModal .modal-footer .btn-secondary"
  );

  // Store the categoryNumber in a data attribute for later use
  modal.dataset.categoryNumber = categoryNumber;

  // Add an event listener for the "Delete" button inside the modal
  confirmDeleteCategoryButton.addEventListener("click", function () {
    const categoryNumberToDelete = modal.dataset.categoryNumber;
    modal.classList.remove("show"); // Close the modal
    modal.style.display = "none";

    // Perform the deletion here
    const formdata = new FormData();
    formdata.append("categoryId", categoryNumberToDelete);
    fetch(
      `https://api.bhattacharjeesolution.in/book/api/video.php?id=${categoryNumberToDelete}`,
      {
        method: "DELETE",
        body: formdata,
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
        alert(data.data || "Successfully Deleted!");
        window.location.reload();
        console.log("data:", data);
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });

    // Remove the event listener to prevent multiple deletions
    confirmDeleteCategoryButton.removeEventListener("click", this);
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
// Function to handle category deletion
function deleteCategory(categoryNumber) {
  const modal = document.getElementById("deleteCategoryModal");
  const confirmDeleteCategoryButton = document.getElementById(
    "confirmDeleteCategory"
  );
  const cancelButton = document.querySelector(
    "#deleteCategoryModal .modal-footer .btn-secondary"
  );

  // Store the categoryNumber in a data attribute for later use
  modal.dataset.categoryNumber = categoryNumber;

  // Add an event listener for the "Delete" button inside the modal
  confirmDeleteCategoryButton.addEventListener("click", function () {
    const categoryNumberToDelete = modal.dataset.categoryNumber;
    modal.classList.remove("show"); // Close the modal
    modal.style.display = "none";

    // Perform the deletion here
    const formdata = new FormData();
    formdata.append("categoryId", categoryNumberToDelete);
    fetch(`https://api.bhattacharjeesolution.in/book/api/delete-category.php`, {
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
        alert(data.data || "Successfully Deleted!");
        window.location.reload();
        fetchDataFromAPI(); // Update the table after deletion
        console.log("data:", data);
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });

    // Remove the event listener to prevent multiple deletions
    confirmDeleteCategoryButton.removeEventListener("click", this);
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

// Function to handle editing a category
function editCategory(categoryData) {
  console.log(categoryData);
  const editButtons = document.querySelectorAll(".edit-button");
  const editPopup = document.getElementById("editPopup");
  const closePopupButton = document.getElementById("closemodal");

  const nameInput = document.getElementById("name");
  const descriptionInput = document.getElementById("description");
  // const image = document.getElementById("image");
  const category = document.getElementById("category");
  const mrp = document.getElementById("mrp");
  const discount = document.getElementById("discount");
  const typeInput = document.getElementById("edittype");
  const lang = document.getElementById("lang");
  const isfree = document.getElementById("isfree");

  // const imageInput = document.getElementById("image");
  // const categoryImageInput = document.getElementById("image");
  // const categoryImagePreInput = document.getElementById("imagePreview");

  // Set the initial values in the form fields
  nameInput.value = categoryData.name;
  descriptionInput.value = categoryData.description;
  mrp.value = categoryData.mrp;
  discount.value = categoryData.discount;
  lang.value = categoryData.lang;
  isfree.value = categoryData.is_free;
  typeInput.value = categoryData.type;
  // categoryImagePreInput.src = `${categoryData?.image}`;

  // Show the popup
  // editButtons.forEach((button) => {
  //   button.addEventListener("click", () => {
  //   });
  // });
  editPopup.style.display = "flex";
  // editPopup.style.display = "flex";

  // Add an event listener to the form submission
  const editForm = document.querySelector(".addCategory form");
  editForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the form from submitting normally (you can handle the submission logic here)
    // You can access the form data using nameInput.value, imageInput.files, and descriptionInput.value

    const formData = {
      name: nameInput.value,
      description: descriptionInput.value,
      mrp: mrp.value,
      category_id: category.value,
      type: typeInput.value,
      lang: lang.value,
      is_free: isfree.value === "true",
      discount: discount.value,
    };

    fetch(
      `https://api.bhattacharjeesolution.in/book/api/courses.php?id=${categoryData.id}`,
      {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          token: token,
        },
      }
    )
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res.message) {
          // Handle success (e.g., display a success message)
          alert(res.message || "Form submitted successfully!");
          // window.location.reload();
          // fetchDataFromAPI();
          editPopup.style.display = "none"; // Close the popup after submission (you can replace this with your logic)
        } else {
          // Handle error (e.g., display an error message)
          console.error("Form submission failed!");
          alert(res.error || "Form submission failed!");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    // editPopup.style.display = "none"; // Close the popup after submission (you can replace this with your logic)
  });

  // Close the popup when the "Close" button is clicked
  closePopupButton.addEventListener("click", () => {
    editPopup.style.display = "none";
  });
}
