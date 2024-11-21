const wrapper = document.querySelector(".wrapper");
const more = document.querySelector(".btn_more");
const loading = document.querySelector(".loading");
const body = document.querySelector("body");
const buttonContainer = document.getElementById("buttonContainer");

let offset = 1;
let perPageCount = 4;
let totalProducts = 0; 
let currentCategory = ""; 

const categories = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
];

categories.forEach((category) => {
  const button = document.createElement("button");
  button.textContent = category.replace(/-/g, " ");
  button.classList.add("category-btn");
  button.addEventListener("click", () => {
    currentCategory = category;
    offset = 1; 
    fetchData(`https://dummyjson.com/products/category/${category}?limit=${perPageCount}`);
  });
  buttonContainer.appendChild(button);
});


async function fetchData(api) {
  loading.style.display = "flex";
  more.setAttribute("disabled", true);

  try {
    const response = await fetch(api);
    const data = await response.json();
    totalProducts = data.total; 
    if (offset === 1) wrapper.innerHTML = ""; 
    createCard(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.style.display = "none";
    body.style.opacity = 1;
  }
}

function createCard(data) {
  data.products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.title}">
      <h3>${product.title}</h3>
      <strong>$${product.price}</strong>
      <br>
      <button class="buy-btn">Buy Now</button>
    `;
    wrapper.appendChild(card);
  });

  if (offset * perPageCount >= totalProducts) {
    more.style.display = "none"; 
  } else {
    more.style.display = "block";
    more.removeAttribute("disabled");
  }
}

function seeMore() {
  offset++;
  fetchData(
    currentCategory
      ? `https://dummyjson.com/products/category/${currentCategory}?limit=${perPageCount}&skip=${
          perPageCount * (offset - 1)
        }`
      : `https://dummyjson.com/products?limit=${perPageCount}&skip=${perPageCount * (offset - 1)}`
  );
}

more.addEventListener("click", seeMore);

fetchData(`https://dummyjson.com/products?limit=${perPageCount}`);
