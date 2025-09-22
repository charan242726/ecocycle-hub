// User data storage (in real app, this would be a database)
const users = JSON.parse(localStorage.getItem("users")) || []
const sellers = JSON.parse(localStorage.getItem("sellers")) || []
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null

// Tab switching functionality
document.addEventListener("DOMContentLoaded", () => {
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
})

// Buyer Login
if (document.getElementById("buyerLoginForm")) {
  document.getElementById("buyerLoginForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("buyerEmail").value
    const password = document.getElementById("buyerPassword").value

    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      currentUser = { ...user, type: "buyer" }
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      alert("Login successful! Welcome back, " + user.firstName)
      window.location.href = "buyer-profile.html"
    } else {
      alert("Invalid email or password. Please try again.")
    }
  })
}

// Seller Login
if (document.getElementById("sellerLoginForm")) {
  document.getElementById("sellerLoginForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("sellerEmail").value
    const password = document.getElementById("sellerPassword").value

    const seller = sellers.find((s) => s.email === email && s.password === password)

    if (seller) {
      currentUser = { ...seller, type: "seller" }
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      alert("Login successful! Welcome back, " + seller.businessName)
      window.location.href = "seller-profile.html"
    } else {
      alert("Invalid email or password. Please try again.")
    }
  })
}

// Buyer Signup
if (document.getElementById("buyerSignupForm")) {
  document.getElementById("buyerSignupForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value
    const address = document.getElementById("address").value

    // Validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    if (users.find((u) => u.email === email)) {
      alert("Email already registered. Please use a different email.")
      return
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      joinDate: new Date().toISOString(),
      cart: [],
      orders: [],
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    alert("Account created successfully! Please login to continue.")
    window.location.href = "login.html"
  })
}

// Seller Signup
if (document.getElementById("sellerSignupForm")) {
  document.getElementById("sellerSignupForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const businessName = document.getElementById("businessName").value
    const businessType = document.getElementById("businessType").value
    const businessRegistration = document.getElementById("businessRegistration").value
    const ownerName = document.getElementById("ownerName").value
    const businessEmail = document.getElementById("businessEmail").value
    const businessPhone = document.getElementById("businessPhone").value
    const alternatePhone = document.getElementById("alternatePhone").value
    const businessAddress = document.getElementById("businessAddress").value
    const businessDescription = document.getElementById("businessDescription").value
    const password = document.getElementById("sellerPassword").value
    const confirmPassword = document.getElementById("confirmSellerPassword").value

    // Get selected product categories
    const categories = []
    document.querySelectorAll('.product-categories input[type="checkbox"]:checked').forEach((checkbox) => {
      categories.push(checkbox.value)
    })

    // Validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    if (sellers.find((s) => s.email === businessEmail)) {
      alert("Email already registered. Please use a different email.")
      return
    }

    if (categories.length === 0) {
      alert("Please select at least one product category.")
      return
    }

    // Create new seller
    const newSeller = {
      id: Date.now(),
      businessName,
      businessType,
      businessRegistration,
      ownerName,
      email: businessEmail,
      phone: businessPhone,
      alternatePhone,
      address: businessAddress,
      description: businessDescription,
      categories,
      password,
      joinDate: new Date().toISOString(),
      products: [],
      orders: [],
      verified: false,
    }

    sellers.push(newSeller)
    localStorage.setItem("sellers", JSON.stringify(sellers))

    alert(
      "Seller account created successfully! Please login to continue. Your account will be verified within 24 hours.",
    )
    window.location.href = "login.html"
  })
}

// Check if user is logged in
function checkAuth() {
  return currentUser !== null
}

// Logout function
function logout() {
  currentUser = null
  localStorage.removeItem("currentUser")
  alert("Logged out successfully!")
  window.location.href = "home.html"
}

// Update navigation based on login status
function updateNavigation() {
  const navMenu = document.querySelector(".nav-menu")
  if (!navMenu) return

  if (currentUser) {
    // User is logged in, show profile link
    const loginLink = navMenu.querySelector('a[href="login.html"]')
    if (loginLink) {
      const profileUrl = currentUser.type === "buyer" ? "buyer-profile.html" : "seller-profile.html"
      const profileName = currentUser.type === "buyer" ? currentUser.firstName : currentUser.businessName

      loginLink.href = profileUrl
      loginLink.innerHTML = `<i class="fas fa-user"></i> ${profileName}`
      loginLink.classList.remove("btn", "btn-primary")
      loginLink.classList.add("nav-link")
    }
  }
}

// Initialize navigation on page load
document.addEventListener("DOMContentLoaded", updateNavigation)
