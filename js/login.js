const client = new Appwrite.Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6779f088002dd0a4059d");

// Initialize your account
const account = new Appwrite.Account(client);

// Handle form submission
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get the email and password
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Old method for creating a session
  account
    .createEmailPasswordSession(email, password)
    .then((response) => {
      console.log;

      Toastify({
        text: "Login successful! Redirecting...",
        backgroundColor: "green",
        duration: 3000,
      }).showToast();

      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    })
    .catch((err) => {
      console.log("Error logging in", err);
      Toastify({
        text: "Error! " + err.message,
        backgroundColor: "red",
        duration: 3000,
      }).showToast();
    });
});
