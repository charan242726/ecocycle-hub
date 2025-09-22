let currentSeller

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in as seller
  currentSeller = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentSeller || currentSeller.type !== "seller") {
    alert("Please login as a seller to access this page.")
    window.location.href = "login.html"
    return
  }

  // Load seller profile data
  loadSellerProfile()

  // Initialize tab functionality
  initializeTabs()

  // Initialize forms
  initializeForms()
})

function loadSellerProfile() {
  // Update header information
  document.getElementById("businessName").textContent = currentSeller.businessName
  document.getElementById("businessType").textContent = formatBusinessType(currentSeller.businessType)

  // Update verification status
  const verificationStatus = document.getElementById("verificationStatus")
  if (currentSeller.verified) {
    verificationStatus.innerHTML = '<i class="fas fa-check-circle"></i> Verified Business'
    verificationStatus.className = "verification-status verified"
  } else {
    verificationStatus.innerHTML = '<i class="fas fa-clock"></i> Verification Pending'
    verificationStatus.className = "verification-status pending"
  }

  // Update dashboard stats
  updateDashboardStats()

  // Load recent activity
  loadRecentActivity()

  // Load recent orders
  loadRecentOrders()

  // Load waste requests
  loadWasteRequests()

  // Update environmental impact
  updateEnvironmentalImpact()

  // Populate settings form
  populateSettingsForm()
}

function updateDashboardStats() {
  const products = currentSeller.products || []
  const orders = currentSeller.orders || []
  const wasteCollected = currentSeller.wasteCollected || 0

  document.getElementById("totalProducts").textContent = products.length
  document.getElementById("totalOrders").textContent = orders.length

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
  document.getElementById("totalRevenue").textContent = `₹${totalRevenue}`
  document.getElementById("wasteCollected").textContent = `${wasteCollected}kg`
}

function loadRecentActivity() {
  const activities = [
    {
      icon: "fas fa-user-plus",
      text: "Welcome to Real World! Complete your profile to start selling.",
      time: "Just now",
    },
  ]

  // Add more activities based on seller actions
  if (currentSeller.products && currentSeller.products.length > 0) {
    activities.unshift({
      icon: "fas fa-plus-circle",
      text: `Added ${currentSeller.products.length} product(s) to catalog`,
      time: "2 hours ago",
    })
  }

  if (currentSeller.orders && currentSeller.orders.length > 0) {
    activities.unshift({
      icon: "fas fa-shopping-cart",
      text: `Received ${currentSeller.orders.length} new order(s)`,
      time: "1 day ago",
    })
  }

  const activityContainer = document.getElementById("recentActivity")
  activityContainer.innerHTML = activities
    .map(
      (activity) => `
        <div class="activity-item">
            <i class="${activity.icon}"></i>
            <span>${activity.text}</span>
            <small>${activity.time}</small>
        </div>
    `,
    )
    .join("")
}

function loadRecentOrders() {
  const orders = currentSeller.orders || []
  const recentOrdersContainer = document.getElementById("recentOrders")

  if (orders.length === 0) {
    recentOrdersContainer.innerHTML = '<p class="no-data">No orders yet. Add products to start receiving orders!</p>'
    return
  }

  const recentOrders = orders.slice(-3).reverse()
  recentOrdersContainer.innerHTML = recentOrders
    .map(
      (order) => `
        <div class="order-item">
            <div class="order-info">
                <h4>Order #${order.id}</h4>
                <p>Customer: ${order.customerName}</p>
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

function loadWasteRequests() {
  // Mock waste collection requests
  const wasteRequests = currentSeller.wasteRequests || []
  const wasteRequestsContainer = document.getElementById("wasteRequests")

  if (wasteRequests.length === 0) {
    wasteRequestsContainer.innerHTML = '<p class="no-data">No waste collection requests yet.</p>'
    return
  }

  wasteRequestsContainer.innerHTML = wasteRequests
    .slice(-3)
    .map(
      (request) => `
        <div class="request-item">
            <div class="request-info">
                <h4>Request #${request.id}</h4>
                <p>${request.wasteTypes.join(", ")}</p>
                <p>${request.quantity}kg - ${request.location}</p>
            </div>
            <div class="request-status status-${request.status}">
                ${request.status}
            </div>
        </div>
    `,
    )
    .join("")
}

function updateEnvironmentalImpact() {
  // Calculate environmental impact based on seller's activities
  const orders = currentSeller.orders || []
  const wasteCollected = currentSeller.wasteCollected || 0

  const co2Prevented = orders.length * 3.2 + wasteCollected * 0.8 // Mock calculation
  const materialsRecycled = wasteCollected + orders.length * 2.5 // Mock calculation

  document.getElementById("co2Prevented").textContent = `${co2Prevented.toFixed(1)}kg`
  document.getElementById("materialsRecycled").textContent = `${materialsRecycled.toFixed(1)}kg`
}

function populateSettingsForm() {
  document.getElementById("updateBusinessName").value = currentSeller.businessName
  document.getElementById("updateBusinessType").value = currentSeller.businessType
  document.getElementById("updateRegistration").value = currentSeller.businessRegistration || ""
  document.getElementById("updateDescription").value = currentSeller.description || ""
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
  // Business update form
  document.getElementById("businessUpdateForm").addEventListener("submit", (e) => {
    e.preventDefault()

    // Update seller data
    currentSeller.businessName = document.getElementById("updateBusinessName").value
    currentSeller.businessType = document.getElementById("updateBusinessType").value
    currentSeller.businessRegistration = document.getElementById("updateRegistration").value
    currentSeller.description = document.getElementById("updateDescription").value

    // Update in localStorage
    const sellers = JSON.parse(localStorage.getItem("sellers")) || []
    const sellerIndex = sellers.findIndex((s) => s.id === currentSeller.id)
    if (sellerIndex !== -1) {
      sellers[sellerIndex] = currentSeller
      localStorage.setItem("sellers", JSON.stringify(sellers))
      localStorage.setItem("currentUser", JSON.stringify(currentSeller))
    }

    alert("Business information updated successfully!")
    loadSellerProfile() // Refresh the display
  })

  // Service area management
  document.getElementById("addServiceArea").addEventListener("click", () => {
    const newArea = document.getElementById("newServiceArea").value.trim()
    if (newArea) {
      if (!currentSeller.serviceAreas) {
        currentSeller.serviceAreas = []
      }

      if (!currentSeller.serviceAreas.includes(newArea)) {
        currentSeller.serviceAreas.push(newArea)
        updateSellerData()
        displayServiceAreas()
        document.getElementById("newServiceArea").value = ""
      } else {
        alert("This service area is already added.")
      }
    }
  })
}

function displayServiceAreas() {
  const serviceAreas = currentSeller.serviceAreas || []
  const container = document.getElementById("serviceAreasList")

  if (serviceAreas.length === 0) {
    container.innerHTML =
      '<div class="no-areas"><p>No service areas added yet. Add areas where you provide services.</p></div>'
    return
  }

  container.innerHTML = serviceAreas
    .map(
      (area) => `
        <div class="service-area-item">
            <span>${area}</span>
            <button class="btn-remove" onclick="removeServiceArea('${area}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `,
    )
    .join("")
}

function removeServiceArea(area) {
  if (currentSeller.serviceAreas) {
    currentSeller.serviceAreas = currentSeller.serviceAreas.filter((a) => a !== area)
    updateSellerData()
    displayServiceAreas()
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

function formatBusinessType(type) {
  const types = {
    recycling: "Recycling Company",
    manufacturer: "Eco Product Manufacturer",
    retailer: "Eco Retailer",
    individual: "Individual Seller",
    cooperative: "Waste Cooperative",
  }
  return types[type] || type
}

// Quick action functions
function viewAnalytics() {
  // Switch to analytics tab
  document.querySelector('[data-tab="analytics"]').click()
}

function updateProfile() {
  // Switch to settings tab
  document.querySelector('[data-tab="settings"]').click()
}

// Initialize service areas display on page load
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (currentSeller) {
      displayServiceAreas()
    }
  }, 100)
})
