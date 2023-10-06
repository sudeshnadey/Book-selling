var currentPage = 1;
var itemsPerPage = 10; // Number of items to display per page
var filteredData = [];
var totalFilteredPages = 1; // Initialize to 1 page
const token = localStorage.getItem("user");

function fetchDataFromAPI() {
  const quizId = localStorage.getItem("addQuestionId");
  console.log("fetchig");
  fetch(
    `https://api.bhattacharjeesolution.in/book/api/questions.php?quiz_id=${quizId}`,
    {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    }
  ) // Replace with your API endpoint
    .then(function (response) {
      return response.json(); // Parse the response as JSON
    })
    .then(function (data) {
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
  console.log(data);
  const questionList = document.getElementById("question-list");
  const editModal = document.getElementById("edit-modal");

  // Example data (replace with your actual data)
  const questions = [
    {
      id: 1,
      text: "Question 1",
      options: [
        { option_text: "Option 1", is_correct: 1 },
        { option_text: "Option 2", is_correct: 0 },
      ],
    },
    {
      id: 2,
      text: "Question 2",
      options: [
        { option_text: "Option 1", is_correct: 0 },
        { option_text: "Option 2", is_correct: 1 },
      ],
    },
  ];

  // Function to open the edit modal and populate it with question data
  function openEditModal(question) {
    const editQuestionText = document.getElementById("edit-question-text");
    const editOptionsContainer = document.getElementById(
      "edit-options-container"
    );

    // Populate the modal with question data
    editQuestionText.value = question.text;

    // Clear any previous options
    editOptionsContainer.innerHTML = "";

    // Populate options in the modal
    question.options.forEach((option, index) => {
      const optionInput = document.createElement("input");
      optionInput.type = "text";
      optionInput.className = "form-control";
      optionInput.value = option.option_text;
      optionInput.name = `edit-choiceText${index + 1}`;
      optionInput.placeholder = `Edit Choice ${index + 1}`;
      editOptionsContainer.appendChild(optionInput);
    });

    // Open the Bootstrap modal
    $("#edit-modal").modal("show");
  }

  // Edit button click handler
  function handleEditClick(question) {
    console.log(question);
    return function () {
      openEditModal(question);
    };
  }

  // Function to add a question to the list
  function addQuestion(question) {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";
    questionDiv.innerHTML = `
      <div>
        <div class="text">${question.text}</div>
        <div class="options">
            <ul>
              ${
                question.options &&
                question?.options
                  .map(
                    (option) =>
                      `<li class="${option.is_correct ? "correct" : ""}">${
                        option.option_text
                      } 
                    </li>`
                  )
                  .join("")
              }
            </ul>
        </div>
      </div>
      <div>
        <button class="edit"  data-coupon='${JSON.stringify(
          question
        )}'>Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;

    // Edit button click handler
    // Edit button click handler
    const editButton = questionDiv.querySelector(".edit");
    addEditButtonClickHandler(editButton, question);

    // Delete button click handler
    questionDiv.querySelector(".delete").addEventListener("click", () => {
      // Handle delete action here (e.g., prompt for confirmation)
      const confirmDelete = confirm(`Delete question ${question.id}?`);
      if (confirmDelete) {
        // Remove the question element from the DOM
        // questionList.removeChild(questionDiv);
        fetch(
          `https://api.bhattacharjeesolution.in/book/api/questions.php?id=${question.id}`,
          {
            method: "DELETE",
            headers: {
              token: token,
            },
          }
        ) // Replace with your API endpoint
          .then(function (response) {
            return response.json(); // Parse the response as JSON
          })
          .then(function (data) {
            console.log("data:", data);
            if (data.message) {
              alert(data.message || "Deleted successfully");
              window.location.reload();
            } else {
              alert(data.error || "Failed to Deleted successfully");
            }
          })
          .catch(function (error) {
            console.error("Error fetching data:", error);
          });
        // Handle actual deletion (e.g., making an API request)
      }
    });

    questionList.appendChild(questionDiv);
  }

  function addEditButtonClickHandler(editButton, item) {
    editButton.addEventListener("click", function () {
      var couponData = JSON.parse(editButton.getAttribute("data-coupon"));
      editCategory(item); // Pass the 'item' to the editCategory function
    });
  }

  // Add questions to the list
  data.forEach(addQuestion);
}

// script.js
// document.addEventListener("DOMContentLoaded", function () {
// });
function editCategory(question) {
  console.log(question);
  const editButtons = document.querySelectorAll(".edit-button");
  const editPopup = document.getElementById("editPopup");
  const closePopupButton = document.getElementById("closemodal");

  const editQuestionText = document.getElementById("edit-question-text");
  const editOptionsContainer = document.getElementById(
    "edit-options-container"
  );

  // Populate the modal with question data
  editQuestionText.value = question.text;

  // Clear any previous options
  editOptionsContainer.innerHTML = "";
  let choiceCount = 2; // Start with 2 choices (you can adjust this as needed)

  // Populate options in the modal
  question.options.forEach((option, index) => {
    const optionInput = document.createElement("input");
    optionInput.type = "text";
    optionInput.className = "form-control";
    optionInput.value = option.option_text;
    optionInput.name = `edit-choiceText${index + 1}`;
    optionInput.placeholder = `Edit Choice ${index + 1}`;

    const choiceInput = document.createElement("input");
    choiceInput.type = "radio";
    choiceInput.name = "correct-answer";
    choiceInput.checked = option.is_correct == "1" ? true : false;
    choiceInput.value = `edit-choiceText${choiceCount}`; // Assign a value to each radio button based on the choice text input name

    editOptionsContainer.appendChild(choiceInput);
    editOptionsContainer.appendChild(optionInput);
  });

  // Open the Bootstrap modal
  $("#edit-modal").modal("show");

  editPopup.style.display = "flex";
  // editPopup.style.display = "flex";

  // Add an event listener to the form submission
  const editForm = document.querySelector(".addCategory form");
  editForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the form from submitting normally (you can handle the submission logic here)
    // You can access the form data using nameInput.value, imageInput.files, and descriptionInput.value
    const choices = [];

    let correctAnswer; // Store the correct answer value

    // Gather all choice inputs
    const choiceTextInputs = document.querySelectorAll(
      'input[type="text"][name^="edit-choiceText"]'
    );
    choiceTextInputs.forEach((choiceTextInput) => {
      choices.push(choiceTextInput.value);

      // Check if the choice is marked as correct
      const choiceInput = document.querySelector(
        `input[type="radio"][value="${choiceTextInput.name}"]`
      );

      console.log(choiceInput);
      if (choiceInput && choiceInput.checked) {
        correctAnswer = choiceTextInput.value;
      }
    });

    // Transform 'choices' into the specified format
    const options = choices.map((choice) => {
      return {
        option_text: choice,
        is_correct: choice === correctAnswer ? 1 : 0,
      };
    });

    const formData = {
      text: editQuestionText.value,
      choices: options,
      id: question.id,
      quize_id: question.quize_id,
    };

    console.log(formData);

    fetch(`https://api.bhattacharjeesolution.in/book/api/questions.phpf`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        token: token,
      },
    })
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

window.addEventListener("load", fetchDataFromAPI);
