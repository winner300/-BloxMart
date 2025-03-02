function showLoader() {
  document.getElementById("preloder").style.display = "block";
  document.getElementById("gen-container").style.display = "none";
}

function hideLoader() {
  document.getElementById("preloder").style.display = "none";
  document.getElementById("gen-container").style.display = "block";
}

const client = new Appwrite.Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6779f088002dd0a4059d");

const account = new Appwrite.Account(client);
const database = new Appwrite.Databases(client);

async function fetchUserSession() {
  try {
    const session = await account.get();
    sessionStorage.setItem("currentUser", JSON.stringify({}));
  } catch (err) {
    console.log(err);
    window.location.href = "/signin.html";
  }
}

// Get the cart items from the database
const userId = sessionStorage.getItem("currentUser");
console.log("user Id", userId);

async function fetchCartItems() {
  try {
    const response = await database.listDocuments(
      "679587e4002df7e86073", // database Id
      "67958b8e002fc9fb1da4", // collection Id
      [Appwrite.Query.equal("userId", userId)]
    );
    console.log("response", response);
    const cartItems = response.documents;
    return cartItems; // we are returning cart items because we want to use the content outside of this function
  } catch (error) {
    console.log("Error Fetching Cart Items:", error);
    return []; //return an empty array when theres an error
  } finally {
    hideLoader();
  }
}

async function displayCart() {
  const cartItems = await fetchCartItems();
  console.log("cart items", cartItems);
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p>Your Cart is empty </p>";
    return;
  }

  let totalAmount = 0;

  cartItems.forEach((item) => {
    totalAmount += item.price * item.quantity;

    const itemDIv = document.createElement("div");
    itemDIv.className = "cart-item";
    itemDIv.innerHTML = `
    <img src="${item.imageUrl}" alt="${item.productName}"> 
    <div class="cart-item-details">
      <h4> ${item.productName}</h4>
      <p>${item.price}</p>
      <p>${item.quantity} </p>
    </div>
    <div class="cart-item-actions">
    <button data-id="${item.$id}" class="delete-item"> Delete</button>
    </div>
    `;
    cartContainer.appendChild(itemDIv);
  });
  document.querySelectorAll(".delete-item").forEach((button) => {
    button.addEventListener("click", handleDeleteCLick);
  });
}
const handleDeleteCLick = (event) => {
  const itemId = event.target.dataset.id;
  const itemName = event.target
    .closest(".cart-item")
    .querySelector("h4").innerText; // Show modal
  const modal = document.getElementById("confirmation-modal");
  const itemNameElement = document.getElementById("modal-item-name");
  itemNameElement.innerText = itemName;
  // show the modal
  modal.style.display = "flex";
  // function for the deleting the cart items
  //trash
  // Add event listener for confirmation and cancel buttons

  const confirmationButton = document.getElementById("confirm-delete");

  const cancelButton = document.getElementById("cancel-delete");

  confirmationButton.onclick = async () => {
    await deleteCart(itemId); //pass the itemId directly to the delete button
    modal.style.display = "none";
    displayCart(); // We call this to re-render the new cart items
    cancelButton.onelick = () => {
      modal.style.display = "none";
    }
  };
  async function deleteCart(itemId) {
    try {
      await database.deleteDocument(
        "679587e4002df7e86073",
        "67958b8e002fc9fb1da4",
        itemId
      );
      Toastify({
        text: "object removed from cart :)",
        backgroundColor: "green",
        duration: 3000,
      }).showToast();
      displayCart(); // We call this to re-render the new cart items
    } catch (err) {
      console.log(err);
    }
  }
};
displayCart();
