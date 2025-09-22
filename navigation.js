// Navigation helper functions for all pages
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("active")
      navMenu?.classList.remove("active")
    })
  })

  // Add active class to current page navigation
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (
      href === currentPage ||
      (currentPage === "index.html" && href === "home.html") ||
      (currentPage === "" && href === "home.html")
    ) {
      link.classList.add("active")
    }
  })
})

// User authentication state management
function checkAuthState() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null")
  const loginBtn = document.querySelector('a[href="login.html"]')

  if (currentUser && loginBtn) {
    // Replace login button with user menu
    const userType = currentUser.userType || "buyer"
    const profilePage = userType === "seller" ? "seller-profile.html" : "buyer-profile.html"

    loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`
    loginBtn.href = profilePage
    loginBtn.classList.remove("btn-primary")
    loginBtn.classList.add("btn-user")
  }
}

// Call auth check on page load
document.addEventListener("DOMContentLoaded", checkAuthState)
