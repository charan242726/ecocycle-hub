let currentSeller

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in as seller
  currentSeller = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentSeller || currentSeller.type !== "seller") {
    alert("Please login as a seller to access this page.")
    window.location.href = "login.html"
    return
  }

  // Initialize form
  initializeProductForm()
})

function initializeProductForm() {
  const form = document.getElementById("addProductForm")
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    addProduct()
  })

  // Auto-select first icon if none selected
  const firstIcon = document.querySelector('input[name="productIcon"]')
  if (firstIcon) {
    firstIcon.checked = true
  }

  // Add price validation
  document.getElementById("productPrice").addEventListener("input", validatePricing)
  document.getElementById("comparePrice").addEventListener("input", validatePricing)

  // Free shipping toggle
  document.getElementById("freeShipping").addEventListener("change", function () {
    const shippingCost = document.getElementById("shippingCost")
    if (this.checked) {
      shippingCost.value = "0"
      shippingCost.disabled = true
    } else {
      shippingCost.disabled = false
    }
  })
}

function validatePricing() {
  const price = Number.parseFloat(document.getElementById("productPrice").value) || 0
  const comparePrice = Number.parseFloat(document.getElementById("comparePrice").value) || 0

  if (comparePrice > 0 && comparePrice <= price) {
    document.getElementById("comparePrice").setCustomValidity("Compare price should be higher than selling price")
  } else {
    document.getElementById("comparePrice").setCustomValidity("")
  }
}

function addProduct() {
  const productData = collectProductData()

  // Validation
  if (!validateProductData(productData)) {
    return
  }

  // Add product to seller's products
  if (!currentSeller.products) {
    currentSeller.products = []
  }

  productData.id = Date.now()
  productData.sellerId = currentSeller.id
  productData.sellerName = currentSeller.businessName
  productData.createdDate = new Date().toISOString()
  productData.status = "active"
  productData.views = 0
  productData.sales = 0

  currentSeller.products.push(productData)

  // Update seller data
  updateSellerData()

  alert("Product added successfully!")
  window.location.href = "seller-products.html"
}

function saveDraft() {
  const productData = collectProductData()
  productData.status = "draft"

  // Basic validation for draft
  if (!productData.name || !productData.category) {
    alert("Please provide at least a product name and category to save as draft.")
    return
  }

  if (!currentSeller.products) {
    currentSeller.products = []
  }

  productData.id = Date.now()
  productData.sellerId = currentSeller.id
  productData.sellerName = currentSeller.businessName
  productData.createdDate = new Date().toISOString()
  productData.views = 0
  productData.sales = 0

  currentSeller.products.push(productData)
  updateSellerData()

  alert("Product saved as draft!")
  window.location.href = "seller-products.html"
}

function collectProductData() {
  // Get selected icon
  const selectedIcon = document.querySelector('input[name="productIcon"]:checked')
  const icon = selectedIcon ? selectedIcon.value : "📦"

  // Get eco certifications
  const certifications = []
  document.querySelectorAll('.certification-options input[type="checkbox"]:checked').forEach((checkbox) => {
    certifications.push(checkbox.value)
  })

  return {
    name: document.getElementById("productName").value.trim(),
    category: document.getElementById("productCategory").value,
    condition: document.getElementById("productCondition").value,
    description: document.getElementById("productDescription").value.trim(),
    icon: icon,
    price: Number.parseFloat(document.getElementById("productPrice").value) || 0,
    comparePrice: Number.parseFloat(document.getElementById("comparePrice").value) || 0,
    stockQuantity: Number.parseInt(document.getElementById("stockQuantity").value) || 0,
    stockUnit: document.getElementById("stockUnit").value,
    trackInventory: document.getElementById("trackInventory").checked,
    co2Saving: Number.parseFloat(document.getElementById("co2Saving").value) || 0,
    materialsUsed: Number.parseInt(document.getElementById("materialsUsed").value) || 0,
    certifications: certifications,
    sustainabilityStory: document.getElementById("sustainabilityStory").value.trim(),
    weight: Number.parseFloat(document.getElementById("weight").value) || 0,
    shippingCost: document.getElementById("freeShipping").checked
      ? 0
      : Number.parseFloat(document.getElementById("shippingCost").value) || 0,
    processingTime: document.getElementById("processingTime").value,
    freeShipping: document.getElementById("freeShipping").checked,
    tags: document
      .getElementById("tags")
      .value.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag),
    specialInstructions: document.getElementById("specialInstructions").value.trim(),
    featured: document.getElementById("featuredProduct").checked,
  }
}

function validateProductData(data) {
  if (!data.name) {
    alert("Please enter a product name.")
    document.getElementById("productName").focus()
    return false
  }

  if (!data.category) {
    alert("Please select a product category.")
    document.getElementById("productCategory").focus()
    return false
  }

  if (!data.description) {
    alert("Please provide a product description.")
    document.getElementById("productDescription").focus()
    return false
  }

  if (data.price <= 0) {
    alert("Please enter a valid price.")
    document.getElementById("productPrice").focus()
    return false
  }

  if (data.stockQuantity < 0) {
    alert("Stock quantity cannot be negative.")
    document.getElementById("stockQuantity").focus()
    return false
  }

  if (data.comparePrice > 0 && data.comparePrice <= data.price) {
    alert("Compare price should be higher than the selling price.")
    document.getElementById("comparePrice").focus()
    return false
  }

  return true
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
