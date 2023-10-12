const token = localStorage.getItem("user");

// Function to populate the coupon table
function populateCouponTable(item) {
  var bannerTable = document.getElementById("coupon-table-body");
  var couponTableBody = document.getElementById("coupon-table");

  // Clear the existing rows in couponTableBody
  while (couponTableBody.firstChild) {
    couponTableBody.removeChild(couponTableBody.firstChild);
  }
  console.log("item", item);

  var row = document.createElement("tr");

  row.innerHTML = `
      <td>1</td>
      <td>${item.about}</td>
      `;
  // <td>
  //     <button class="edit-button" style="border: none" data-coupon='${JSON.stringify(
  //       item
  //     )}'>
  //         <i class="fa-solid fa-pen"></i>
  //       </button>
  // </td>

  couponTableBody.appendChild(row);

  // Add an event listener to the "Edit" button
  var editButton = row.querySelector(".edit-button");
  editButton.addEventListener("click", function () {
    var couponData = JSON.parse(editButton.getAttribute("data-coupon"));
    editCoupon(couponData);
  });
}

function fetchDataFromAPI() {
  fetch("https://api.bhattacharjeesolution.in/book/api/aboutus.php", {
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
      console.log("data:", data);
      populateCouponTable(data);
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}
// coupon.js
document.addEventListener("DOMContentLoaded", function () {
  var couponTable = document.getElementById("coupon-table");
  var couponTableBody = document.getElementById("coupon-table-body");

  fetchDataFromAPI();

  // Add an event listener to the search input field
  const noCouponMessage = document.createElement("div");
  noCouponMessage.textContent = "No coupons found";
  // Apply CSS styles to the message element
  noCouponMessage.style.display = "none"; // Initially hide the message
  noCouponMessage.style.textAlign = "center"; // Center-align text
  noCouponMessage.style.padding = "20px 10px"; // Add padding
  noCouponMessage.style.width = "100%"; // Add padding
  noCouponMessage.style.columnSpan = 4;
  noCouponMessage.style.fontSize = "18px"; // Increase text size
  noCouponMessage.style.backgroundColor = "#f0f0f0"; // Background color (optional)

  // Append the message element just below the table
  couponTable.parentNode.insertBefore(noCouponMessage, couponTable.nextSibling);

  // Add an event listener to the search input field
  const searchInput = document.getElementById("searchbar");
  searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.trim().toLowerCase(); // Get the search text and convert to lowercase

    // Loop through the table rows (skip the first row which is the header)
    const rows = couponTableBody.querySelectorAll("tr");
    let anyMatch = false; // Flag to track if any match is found

    for (let i = 1; i < rows.length; i++) {
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

    // Show or hide the "No coupons found" message based on search results
    if (anyMatch) {
      noCouponMessage.style.display = "none"; // Hide the message
    } else {
      noCouponMessage.style.display = "block"; // Show the message
    }
  });
});

// Function to handle coupon deletion
function deleteCoupon(couponNo) {
  // Add your code here to handle the deletion of the coupon with the specified No
  // For example, you can show a confirmation dialog and then remove the coupon from the table and data array
  // alert("Coupon with No " + couponNo + " will be deleted.");
  if (window.confirm("Are you sure?") == true) {
    console.log(couponNo);
    const formdata = new FormData();
    formdata.append("bannerId", couponNo);
    var requestData = {
      bannerId: couponNo,
    };
    fetch(`https://api.bhattacharjeesolution.in/book/api/delete-banner.php`, {
      method: "POST",
      // body: JSON.stringify(requestData),
      body: formdata,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log(response);
        return response.json(); // Parse the response as JSON
      })
      .then(function (data) {
        // Call the populateBannerTableWithData function with the retrieved data
        // populateBannerTable(data);
        console.log("data:", data);
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });
  }
}

function editCoupon(couponData) {
  const editPopup = document.getElementById("editPopup");
  const closePopupButton = document.getElementById("closePopup");
  const nameInput = document.getElementById("name");
  const validityInput = document.getElementById("validity");
  const discountPriceInput = document.getElementById("discountPrice");

  // Set the initial values in the form fields
  nameInput.value = couponData.Name;
  validityInput.value = couponData.Validity; // Set the current date
  discountPriceInput.value = parseInt(couponData.Price);

  // Show the popup
  editPopup.style.display = "flex";

  // Add an event listener to the form submission
  const editForm = document.getElementById("editForm");
  editForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the form from submitting normally (you can handle the submission logic here)
    // You can access the form data using nameInput.value, validityInput.value, and priceInput.value
    console.log(
      "Form submitted:",
      nameInput.value,
      validityInput.value,
      discountPriceInput.value
    );

    const formData = new FormData();
    formData.append("name", nameInput.value);
    formData.append("validity", validityInput.value);
    formData.append("discountprice", discountPriceInput.value);
    formData.append("bannerId", couponData.id);

    try {
      const response = await fetch(
        "https://api.bhattacharjeesolution.in/book/api/edit-banner.php",
        {
          method: "POST",
          body: formData,
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

// Function to get the current date in the format YYYY-MM-DD
function getCurrentDate() {
  var today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
  var day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}
