const bars = document.querySelector(".bars");
const sidebar = document.querySelector(".sidebar");

bars.addEventListener("click",function(){
    bars.classList.toggle("barsleft")
    sidebar.classList.toggle("display")
})


function toggleDropdown() {
    var dropdown = document.getElementById("classDropdown");
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
}


document.getElementById("addClassButton").addEventListener("click", function () {
    // Get the modal element by its ID
    var modal = document.getElementById("addClassModal");

    // Show the modal
    modal.style.display = "block";

    // Close the modal if the close button is clicked
    document.getElementById("closeModalButton").addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener("click", function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});


$(document).ready(function() {
    // Show/hide table based on class selection
    $("#classSelector").change(function() {
        var selectedClass = $(this).val();
        if (selectedClass === "") {
            $("#classTable").hide();
        } else {
            $("#classTable").show();
            // You can populate the table with data here based on the selected class
            // Example: You can use AJAX to fetch data from a server and populate the table.
        }
    });
});




