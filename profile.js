// Declare currentUser variable before using it
let currentUser

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser || currentUser.type !== "buyer") {
    alert("Please login as a buyer to access this page.")
    window.location.href = "login.html"
    return
  }

  // Load user profile data
  loadProfileData()

  // Initialize tab functionality
  initializeTabs()

  // Initialize forms
  initializeForms()

  // Update cart count
  updateCartCount()
})

function loadProfileData() {
  // Update profile header
  document.getElementById("userName").textContent = `${currentUser.firstName} ${currentUser.lastName}`
  document.getElementById("userEmail").textContent = currentUser.email

  const joinDate = new Date(currentUser.joinDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
  document.getElementById("memberSince").textContent = joinDate

  // Update stats
  document.getElementById("totalOrders").textContent = currentUser.orders ? currentUser.orders.length : 0
  document.getElementById("ecoPoints").textContent = currentUser.ecoPoints || 0
  document.getElementById("currentPoints").textContent = currentUser.ecoPoints || 0

  // Calculate total saved (mock calculation)
  const totalSaved = (currentUser.orders || []).reduce((sum, order) => sum + (order.discount || 0), 0)
  document.getElementById("totalSaved").textContent = `₹${totalSaved}`

  // Load environmental impact
  loadEnvironmentalImpact()

  // Load recent orders
  loadRecentOrders()

  // Load wishlist
  loadWishlist()

  // Populate settings form
  populateSettingsForm()
}

function loadEnvironmentalImpact() {
  // Mock environmental impact calculation
  const orders = currentUser.orders || []
  const co2Saved = orders.length * 2.5 // 2.5kg CO2 per order
  const wasteReduced = orders.length * 1.2 // 1.2kg waste per order

  document.getElementById("co2Saved").textContent = `${co2Saved}kg`
  document.getElementById("wasteReduced").textContent = `${wasteReduced}kg`
}

function loadRecentOrders() {
  const recentOrdersContainer = document.getElementById("recentOrders")
  const orders = currentUser.orders || []

  if (orders.length === 0) {
    recentOrdersContainer.innerHTML =
      '<p class="no-data">No orders yet. <a href="products.html">Start shopping!</a></p>'
    return
  }

  const recentOrders = orders.slice(-3).reverse() // Last 3 orders
  recentOrdersContainer.innerHTML = recentOrders
    .map(
      (order) => `
        <div class="order-item">
            <div class="order-info">
                <h4>Order #${order.id}</h4>
                <p>${new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div class="order-status status-${order.status}">
                ${order.status}
            </div>
            <div class="order-total">₹${order.total}</div>
        </div>
    `,
    )
    .join("")
}

function loadWishlist() {
  const wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || []
  const wishlistPreview = document.getElementById("wishlistPreview")
  const wishlistItems = document.getElementById("wishlistItems")

  if (wishlist.length === 0) {
    wishlistPreview.innerHTML = '<p class="no-data">Your wishlist is empty.</p>'
    wishlistItems.innerHTML = `
            <div class="no-wishlist">
                <i class="fas fa-heart"></i>
                <h4>Your wishlist is empty</h4>
                <p>Save products you love to buy them later.</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `
    return
  }

  // Show preview in overview
  const previewItems = wishlist.slice(0, 3)
  wishlistPreview.innerHTML = previewItems
    .map(
      (item) => `
        <div class="wishlist-preview-item">
            <span>${item.name}</span>
            <span>₹${item.price}</span>
        </div>
    `,
    )
    .join("")

  // Show full wishlist in wishlist tab
  wishlistItems.innerHTML = wishlist
    .map(
      (item) => `
        <div class="wishlist-item">
            <div class="product-image">
                <div class="product-icon">${item.icon}</div>
            </div>
            <div class="product-details">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="product-price">₹${item.price}</div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${item.id})">Add to Cart</button>
                <button class="btn btn-secondary" onclick="removeFromWishlist(${item.id})">Remove</button>
            </div>
        </div>
    `,
    )
    .join("")
}

function populateSettingsForm() {
  document.getElementById("updateFirstName").value = currentUser.firstName
  document.getElementById("updateLastName").value = currentUser.lastName
  document.getElementById("updatePhone").value = currentUser.phone
  document.getElementById("updateAddress").value = currentUser.address
}

function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab")

      // Remove active class from all tabs and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked tab and corresponding content
      this.classList.add("active")
      document.getElementById(tabName + "-tab").classList.add("active")
    })
  })
}

function initializeForms() {
  // Profile update form
  document.getElementById("profileUpdateForm").addEventListener("submit", (e) => {
    e.preventDefault()

    // Update user data
    currentUser.firstName = document.getElementById("updateFirstName").value
    currentUser.lastName = document.getElementById("updateLastName").value
    currentUser.phone = document.getElementById("updatePhone").value
    currentUser.address = document.getElementById("updateAddress").value

    // Update in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || []
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = currentUser
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
    }

    alert("Profile updated successfully!")
    loadProfileData() // Refresh the display
  })

  // Password change form
  document.getElementById("passwordChangeForm").addEventListener("submit", function (e) {
    e.preventDefault()

    const currentPassword = document.getElementById("currentPassword").value
    const newPassword = document.getElementById("newPassword").value
    const confirmPassword = document.getElementById("confirmNewPassword").value

    if (currentPassword !== currentUser.password) {
      alert("Current password is incorrect.")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.")
      return
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.")
      return
    }

    // Update password
    currentUser.password = newPassword

    // Update in localStorage
    const users = JSON.parse(localStorage.getItem("users")) || []
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = currentUser
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
    }

    alert("Password changed successfully!")
    this.reset()
  })

  // Clear wishlist
  document.getElementById("clearWishlist").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your entire wishlist?")) {
      localStorage.removeItem(`wishlist_${currentUser.id}`)
      loadWishlist()
    }
  })
}

function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem(`wishlist_${currentUser.id}`)) || []
  wishlist = wishlist.filter((item) => item.id !== productId)
  localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlist))
  loadWishlist()
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || []
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  document.getElementById("cartCount").textContent = totalItems
}
