// Sample products data
const sampleProducts = [
  {
    id: 1,
    name: "Stainless Steel Water Bottle",
    category: "bottles",
    price: 899,
    comparePrice: 1299,
    description: "Premium stainless steel water bottle that keeps drinks fresh and reduces plastic waste.",
    icon: "🥤",
    co2Saving: 2.5,
    certifications: ["recycled", "carbon-neutral"],
    rating: 4.8,
    reviews: 156,
    inStock: true,
    stockQuantity: 50,
    featured: true,
  },
  {
    id: 2,
    name: "Organic Cotton Shopping Bag",
    category: "bags",
    price: 399,
    comparePrice: 599,
    description: "Durable organic cotton bag perfect for grocery shopping and daily use.",
    icon: "🛍",
    co2Saving: 1.8,
    certifications: ["organic", "fair-trade"],
    rating: 4.6,
    reviews: 89,
    inStock: true,
    stockQuantity: 75,
    featured: false,
  },
  {
    id: 3,
    name: "Plant-Based All-Purpose Cleaner",
    category: "cleaners",
    price: 699,
    comparePrice: 899,
    description: "Natural cleaning solution that's safe for your family and the environment.",
    icon: "🧴",
    co2Saving: 1.2,
    certifications: ["organic", "biodegradable"],
    rating: 4.7,
    reviews: 203,
    inStock: true,
    stockQuantity: 30,
    featured: true,
  },
  {
    id: 4,
    name: "LED Energy Efficient Bulb",
    category: "lighting",
    price: 299,
    comparePrice: 450,
    description: "Long-lasting LED bulb that reduces electricity consumption by 80%.",
    icon: "💡",
    co2Saving: 3.2,
    certifications: ["carbon-neutral"],
    rating: 4.9,
    reviews: 312,
    inStock: true,
    stockQuantity: 100,
    featured: false,
  },
  {
    id: 5,
    name: "Bamboo Kitchen Utensil Set",
    category: "kitchen",
    price: 799,
    comparePrice: 1199,
    description: "Sustainable bamboo utensils that replace plastic kitchen tools.",
    icon: "🍽",
    co2Saving: 2.1,
    certifications: ["organic", "biodegradable"],
    rating: 4.5,
    reviews: 67,
    inStock: true,
    stockQuantity: 25,
    featured: false,
  },
  {
    id: 6,
    name: "Natural Soap Bar Set",
    category: "personal-care",
    price: 549,
    comparePrice: 799,
    description: "Handmade natural soap bars free from harmful chemicals.",
    icon: "🧽",
    co2Saving: 0.8,
    certifications: ["organic", "fair-trade"],
    rating: 4.4,
    reviews: 134,
    inStock: true,
    stockQuantity: 40,
    featured: false,
  },
]

let currentProducts = [...sampleProducts]
let currentPage = 1
const productsPerPage = 6

document.addEventListener("DOMContentLoaded", () => {
  initializeProductsPage()
  loadProducts()
  updateCartCount()
})

function initializeProductsPage() {
  // Initialize filters
  document.getElementById("categoryFilter").addEventListener("change", filterProducts)
  document.getElementById("priceFilter").addEventListener("change", filterProducts)
  document.getElementById("sortFilter").addEventListener("change", filterProducts)

  // Load more button
  document.getElementById("loadMoreBtn").addEventListener("click", loadMoreProducts)
}

function loadProducts() {
  displayProducts(currentProducts.slice(0, currentPage * productsPerPage))
  updateLoadMoreButton()
}

function displayProducts(products) {
  const container = document.getElementById("productsGrid")

  if (products.length === 0) {
    container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search criteria.</p>
            </div>
        `
    return
  }

  container.innerHTML = products
    .map(
      (product) => `
        <div class="product-card ${product.featured ? "featured" : ""}" data-id="${product.id}">
            ${product.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> Featured</div>' : ""}
            <div class="product-image">
                <div class="product-icon">${product.icon}</div>
                ${!product.inStock ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ""}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-certifications">
                    ${product.certifications.map((cert) => `<span class="cert-badge cert-${cert}">${formatCertification(cert)}</span>`).join("")}
                </div>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="eco-impact">
                    <i class="fas fa-leaf"></i>
                    <span>Saves ${product.co2Saving}kg CO₂</span>
                </div>
            </div>
            <div class="product-pricing">
                ${product.comparePrice ? `<div class="compare-price">₹${product.comparePrice}</div>` : ""}
                <div class="product-price">₹${product.price}</div>
                ${product.comparePrice ? `<div class="discount">${Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF</div>` : ""}
            </div>
            <div class="product-actions">
                <button class="btn btn-primary ${!product.inStock ? "disabled" : ""}" 
                        onclick="addToCart(${product.id})" 
                        ${!product.inStock ? "disabled" : ""}>
                    <i class="fas fa-shopping-cart"></i> 
                    ${!product.inStock ? "Out of Stock" : "Add to Cart"}
                </button>
                <button class="btn btn-secondary" onclick="addToWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function filterProducts() {
  const category = document.getElementById("categoryFilter").value
  const priceRange = document.getElementById("priceFilter").value
  const sortBy = document.getElementById("sortFilter").value

  let filteredProducts = [...sampleProducts]

  // Filter by category
  if (category !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category === category)
  }

  // Filter by price range
  if (priceRange !== "all") {
    const [min, max] = priceRange.split("-").map(Number)
    if (max) {
      filteredProducts = filteredProducts.filter((product) => product.price >= min && product.price <= max)
    } else {
      filteredProducts = filteredProducts.filter((product) => product.price >= min)
    }
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id // Assuming higher ID means newer
      case "featured":
      default:
        return b.featured - a.featured || b.rating - a.rating
    }
  })

  currentProducts = filteredProducts
  currentPage = 1
  loadProducts()
}

function loadMoreProducts() {
  currentPage++
  loadProducts()
}

function updateLoadMoreButton() {
  const loadMoreBtn = document.getElementById("loadMoreBtn")
  const totalShown = currentPage * productsPerPage
  const totalProducts = currentProducts.length

  if (totalShown >= totalProducts) {
    loadMoreBtn.style.display = "none"
  } else {
    loadMoreBtn.style.display = "block"
    loadMoreBtn.textContent = `Load More (${totalProducts - totalShown} remaining)`
  }
}

function addToCart(productId) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser) {
    alert("Please login to add items to cart.")
    window.location.href = "login.html"
    return
  }

  const product = sampleProducts.find((p) => p.id === productId)
  if (!product) return

  const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || []
  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      icon: product.icon,
      description: product.description,
      co2Saving: product.co2Saving,
      quantity: 1,
    })
  }

  localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart))
  updateCartCount()
  alert(`${product.name} added to cart!`)
}

function addToWishlist(productId) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser) {
    alert("Please login to add items to wishlist.")
    window.location.href = "login.html"
    return
  }

  const product = sampleProducts.find((p) => p.id === productId)
  if (!product) return

  const wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || []
  const existingItem = wishlist.find((item) => item.id === productId)

  if (existingItem) {
    alert("Item is already in your wishlist!")
    return
  }

  wishlist.push({
    id: product.id,
    name: product.name,
    price: product.price,
    icon: product.icon,
    description: product.description,
  })

  localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist))
  alert(`${product.name} added to wishlist!`)
}

function updateCartCount() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser) return

  const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || []
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const cartCountElements = document.querySelectorAll("#cartCount")
  cartCountElements.forEach((element) => {
    element.textContent = totalItems
  })
}

// Helper functions
function formatCertification(cert) {
  const certMap = {
    organic: "Organic",
    recycled: "Recycled",
    biodegradable: "Biodegradable",
    "fair-trade": "Fair Trade",
    "carbon-neutral": "Carbon Neutral",
  }
  return certMap[cert] || cert
}

function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let stars = ""

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>'
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>'
  }

  return stars
}
