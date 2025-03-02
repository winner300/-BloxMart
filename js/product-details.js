// Getting the id of each product from the url
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
console.log("product id", productId);
const currentUser = sessionStorage.getItem("currentUser");
console.log("current user", currentUser);

// Fetch the product detail from the api

async function fetchProduct(productId) {
  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch product detail");
    const product = await response.json();
    console.log(product);
    renderProduct(product);
    // Add event listener for the Add to Cart button
    const addToCartButton = document.querySelector(".add-to-cart");
    addToCartButton.addEventListener("click", () => addToCart(product));
  } catch (err) {
    console.log(err);
  }
}

// fetchProduct(8);

// Render product detail into html
function renderProduct(product) {
  const container = document.getElementById("productContainer");

  container.innerHTML = `
  <div class="item-view"> 
    <!--Image Section -->
    <div class="image-section"> 
    <img src="${product.images[0]}" alt="${product.title}" >
    </div>
    <!-- Details section -->

    <div class="item-details"> 
        <h1>${product.title} </h1>
        <div class="stars">${generateStars(product.rating)} </div>
        <p> ${product.description} </p>
        <div class="price">PRICE per one: $${product.price.toFixed(2)} </div>
        <div class="availability">Availability: <strong> ${
          product.availabilityStatus
        } </strong></div>
        <div class="category">Category: <strong>${product.category} </strong>
        </div>
        
        <div class="details"> 
        <p> <strong>Brand: </strong> ${product.brand} </p>
        <p> <strong>SKU: </strong> ${product.sku} </p>
        <p> <strong>Weight: </strong> ${product.weight} </p>
        <p> <strong>Dimensions: </strong> ${product.dimensions.width} X ${
    product.dimensions.height
  } X ${product.dimensions.depth} </p>
        <p> <strong>Minimum: </strong> ${product.minimumOrderQuantity} </p>
        </div>

        <div class="quantity">
        <label for="quantity">Quantity: </label>
        <input type="number" id="quantity" value="${
          product.minimumOrderQuantity
        }" >
        </div>

        <div class="total-price">Total:${
          product.price.toFixed(2) * product.minimumOrderQuantity
        }  </div>

        <div class="actions"> 
        <button class="add-to-cart"> Add to cart </button>
        </div>
    </div>
  </div>
  
  
  
  `;
  // Handle quantity input change
  const quantityInput = document.getElementById("quantity");
  const totalPriceElement = document.querySelector(".total-price");

  // update the total price based on the quantity
  quantityInput.addEventListener("input", (e) => {
    console.log(e);
    // COnverting the string from the input to a number
    let quantity = parseInt(e.target.value, 10);
    if (isNaN(quantity) || quantity < product.minimumOrderQuantity) {
      // All this must return before we execute what is in this code block
      quantity = product.minimumOrderQuantity;
    }
    e.target.value = quantity;

    const totalPrice = quantity * product.price;
    totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)}`;
    console.log(totalPrice);
  });
}
// Function to generate starts for the rating
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return "&#9733;".repeat(fullStars) + "&#9734;".repeat(emptyStars);
}

// fetch and display the product
if (productId) {
  fetchProduct(productId);
} else {
  console.error("No product Id provided in the url");
}

const clients = new Appwrite.Client()

  .setEndpoint("https://cloud.appwrite.io/v1")

  .setProject("6779f088002dd0a4059d");

async function addToCart(product) {
  const database = new Appwrite.Databases(clients);

  try {
    const userId = currentUser;

    if (!userId) {
      Toastify({
        text: "No User logged in, Please log in!!!",
        backgroundColor: "red",
        duration: 3000,
      }).showToast();
      return;
    }
    const quantity = parseInt(document.getElementById("quantity").value);
    console.log("quantity", quantity);
    // Prepare the data we want to save
    const cartData = {
      userId,
      productId,
      productName: product.title,
      price: product.price,
      quantity,
      imageUrl: product.images[0],
    };

    // Save the data  or cart items in the database

    const response = await database.createDocument(
      "679587e4002df7e86073", //database id
      "67958b8e002fc9fb1da4", //collection id
      Appwrite.ID.unique(),
      cartData
    );
    Toastify({
      text: "Product added to cart successfully!!!",
      backgroundColor: "green",
      duration: 3000,
    }).showToast();
    setTimeout(() => {
      window.location.href = "/cart.html";
    }, 3000);
    console.log(response);
    return;
  } catch (err) {
    console.log(err);
  }
}
