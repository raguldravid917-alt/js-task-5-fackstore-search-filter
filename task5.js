const API_URL = "https://fakestoreapi.com/products";

const productsGrid = document.getElementById("productsGrid");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("errorMsg");
const infoText = document.getElementById("infoText");

const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");

let allProducts = []; // original data
let filteredProducts = []; // currently visible data

// ------------- FETCH PRODUCTS -------------
fetch(API_URL)
  .then((res) => res.json())
  .then((data) => {
    allProducts = data;
    filteredProducts = [...allProducts];

    loader.style.display = "none";

    populateCategories(allProducts);
    renderProducts(filteredProducts);
  })
  .catch((err) => {
    console.error("API error:", err);
    loader.style.display = "none";
    errorMsg.style.display = "block";
  });

// ------------- POPULATE CATEGORY DROPDOWN -------------
function populateCategories(products) {
  const categories = new Set(products.map((p) => p.category));

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat; // already lowercase / words
    categorySelect.appendChild(option);
  });
}

// ------------- RENDER PRODUCTS -------------
function renderProducts(list) {
  productsGrid.innerHTML = "";

  if (list.length === 0) {
    infoText.textContent = "No products found.";
    return;
  }

  infoText.textContent = `Showing ${list.length} product(s)`;

  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <div class="product-title">${product.title}</div>
      <div class="product-category">${product.category}</div>
      <div class="product-footer">
        <span class="product-price">₹${(product.price * 80).toFixed(0)}</span>
        <span class="product-rating">⭐ ${product.rating.rate} (${product.rating.count})</span>
      </div>
    `;

    productsGrid.appendChild(card);
  });
}

// ------------- APPLY ALL FILTERS (search + category + sort) -------------
function applyFilters() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCategory = categorySelect.value;
  const sortValue = sortSelect.value;

  // filter
  let result = allProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchText);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // sort
  if (sortValue === "low-high") {
    result.sort((a, b) => a.price - b.price);
  } else if (sortValue === "high-low") {
    result.sort((a, b) => b.price - a.price);
  }

  filteredProducts = result;
  renderProducts(filteredProducts);
}

// ------------- EVENT LISTENERS -------------

// search typing
searchInput.addEventListener("input", () => {
  applyFilters();
});

// category change
categorySelect.addEventListener("change", () => {
  applyFilters();
});

// sort change
sortSelect.addEventListener("change", () => {
  applyFilters();
});
