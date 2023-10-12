function handlelogout() {
  if (localStorage.getItem("user")) {
    localStorage.removeItem("user");
    window.location.href = "Index.html";
  }
}
if (!localStorage.getItem("user")) {
  parent.location.href = "../Index.html"; // Replace 'login.html' with the actual login page URL
} else {
  console.log("all good!");
}
