let currentSeller

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in as seller
  currentSeller = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentSeller || currentSeller.type !== "seller") {
    alert("Please login as a seller to access this page.")
    window.location.href = "login.html"
    return
  }

  // Initialize products management
  initializeProductsManagement()
  loadProducts()
  updateProductStats()
})

function initializeProductsManagement() {
  // Search functionality
  document.getElementById("productSearch").addEventListener("input", filterProducts)

  // Filter controls
  document.getElementById("statusFilter").addEventListener("change", filterProducts)
  document.getElementById("categoryFilter").addEventListener("change", filterProducts)
  document.getElementById("sortBy").addEventListener("change", filterProducts)
}

function loadProducts() {
  const products = currentSeller.products || []
  displayProducts(products)
}

function displayProducts(products) {
  const container = document.getElementById("productsList")
  const emptyState = document.getElementById("emptyProducts")

  if (products.length === 0) {
    container.style.display = "none"
    emptyState.style.display = "block"
    return
  }

  container.style.display = "block"
  emptyState.style.display = "none"

  container.innerHTML = products
    .map(
      (product) => `
        <div class="product-item" data-id="${product.id}">
            <div class="product-image">
                <div class="product-icon">${product.icon}</div>
                ${product.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> Featured</div>' : ""}
            </div>
            <div class="product-details">
                <div class="product-header">
                    <h4>${product.name}</h4>
                    <div class="product-status status-${product.status}">${formatStatus(product.status)}</div>
                </div>
                <p class="product-description">${truncateText(product.description, 100)}</p>
                <div class="product-meta">
                    <span class="category">${formatCategory(product.category)}</span>
                    <span class="condition">${formatCondition(product.condition)}</span>
                    ${product.certifications.length > 0 ? `<span class="eco-certified"><i class="fas fa-leaf"></i> Eco Certified</span>` : ""}
                </div>
                <div class="product-stats">
                    <div class="stat">
                        <i class="fas fa-eye"></i>
                        <span>${product.views || 0} views</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-shopping-cart"></i>
                        <span>${product.sales || 0} sold</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-boxes"></i>
                        <span>${product.stockQuantity} ${product.stockUnit}</span>
                    </div>
                </div>
            </div>
            <div class="product-pricing">
                <div class="price">₹${product.price}</div>
                ${product.comparePrice > 0 ? `<div class="compare-price">₹${product.comparePrice}</div>` : ""}
                ${product.freeShipping ? '<div class="free-shipping"><i class="fas fa-shipping-fast"></i> Free Shipping</div>' : ""}
            </div>
            <div class="product-actions">
                <button class="btn btn-primary btn-small" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-secondary btn-small" onclick="toggleProductStatus(${product.id})">
                    <i class="fas fa-${product.status === "active" ? "pause" : "play"}"></i> 
                    ${product.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function updateProductStats() {
  const products = currentSeller.products || []

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.status === "active").length
  const draftProducts = products.filter((p) => p.status === "draft").length
  const lowStockProducts = products.filter((p) => p.stockQuantity <= 5 && p.trackInventory).length

  document.getElementById("totalProducts").textContent = totalProducts
  document.getElementById("activeProducts").textContent = activeProducts
  document.getElementById("draftProducts").textContent = draftProducts
  document.getElementById("lowStockProducts").textContent = lowStockProducts
}

function filterProducts() {
  const searchTerm = document.getElementById("productSearch").value.toLowerCase()
  const statusFilter = document.getElementById("statusFilter").value
  const categoryFilter = document.getElementById("categoryFilter").value
  const sortBy = document.getElementById("sortBy").value

  let filteredProducts = currentSeller.products || []

  // Apply search filter
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    )
  }

  // Apply status filter
  if (statusFilter !== "all") {
    if (statusFilter === "out-of-stock") {
      filteredProducts = filteredProducts.filter((product) => product.stockQuantity === 0)
    } else {
      filteredProducts = filteredProducts.filter((product) => product.status === statusFilter)
    }
  }

  // Apply category filter
  if (categoryFilter !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category === categoryFilter)
  }

  // Apply sorting
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdDate) - new Date(a.createdDate)
      case "oldest":
        return new Date(a.createdDate) - new Date(b.createdDate)
      case "name":
        return a.name.localeCompare(b.name)
      case "price-high":
        return b.price - a.price
      case "price-low":
        return a.price - b.price
      case "stock":
        return b.stockQuantity - a.stockQuantity
      default:
        return 0
    }
  })

  displayProducts(filteredProducts)
}

function editProduct(productId) {
  // In a real app, this would navigate to an edit form
  alert(`Edit product functionality would be implemented here for product ID: ${productId}`)
}

function toggleProductStatus(productId) {
  const products = currentSeller.products || []
  const productIndex = products.findIndex((p) => p.id === productId)

  if (productIndex !== -1) {
    const product = products[productIndex]
    const newStatus = product.status === "active" ? "inactive" : "active"

    if (confirm(`Are you sure you want to ${newStatus === "active" ? "activate" : "deactivate"} this product?`)) {
      products[productIndex].status = newStatus
      updateSellerData()
      loadProducts()
      updateProductStats()
    }
  }
}

function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
    const products = currentSeller.products || []
    currentSeller.products = products.filter((p) => p.id !== productId)
    updateSellerData()
    loadProducts()
    updateProductStats()
    alert("Product deleted successfully.")
  }
}

function updateSellerData() {
  const sellers = JSON.parse(localStorage.getItem("sellers")) || []
  const sellerIndex = sellers.findIndex((s) => s.id === currentSeller.id)
  if (sellerIndex !== -1) {
    sellers[sellerIndex] = currentSeller
    localStorage.setItem("sellers", JSON.stringify(sellers))
    localStorage.setItem("currentUser", JSON.stringify(currentSeller))
  }
}

// Helper functions
function formatStatus(status) {
  const statusMap = {
    active: "Active",
    inactive: "Inactive",
    draft: "Draft",
    "out-of-stock": "Out of Stock",
  }
  return statusMap[status] || status
}

function formatCategory(category) {
  const categoryMap = {
    bottles: "Reusable Bottles",
    bags: "Eco Bags",
    cleaners: "Natural Cleaners",
    lighting: "LED Lighting",
    kitchen: "Kitchen Items",
    "personal-care": "Personal Care",
    "recycled-materials": "Recycled Materials",
    "upcycled-items": "Upcycled Items",
    "organic-products": "Organic Products",
  }
  return categoryMap[category] || category
}

function formatCondition(condition) {
  const conditionMap = {
    new: "New",
    "like-new": "Like New",
    good: "Good",
    recycled: "Recycled",
  }
  return conditionMap[condition] || condition
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}
