document.addEventListener("DOMContentLoaded", () => {
  // Initialize all animations
  initScrollAnimations()
  initFormAnimations()
  initButtonEffects()
  initCounterAnimations()
  initParallaxEffects()
  initPageSpecificAnimations()
})

// Scroll-triggered animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")

        // Trigger counter animations
        if (entry.target.classList.contains("stat-number")) {
          animateCounter(entry.target)
        }
      }
    })
  }, observerOptions)

  // Observe all elements with animation classes
  document
    .querySelectorAll(".animate-on-scroll, .scroll-reveal, .scroll-reveal-left, .scroll-reveal-right")
    .forEach((el) => {
      observer.observe(el)
    })
}

// Form input animations
function initFormAnimations() {
  const inputs = document.querySelectorAll(".form-input")

  inputs.forEach((input) => {
    // Floating label animation
    input.addEventListener("focus", function () {
      const label = this.nextElementSibling
      if (label && label.classList.contains("floating-label")) {
        label.style.transform = "translateY(-25px) scale(0.8)"
        label.style.color = "var(--primary-green)"
      }
    })

    input.addEventListener("blur", function () {
      const label = this.nextElementSibling
      if (label && label.classList.contains("floating-label") && !this.value) {
        label.style.transform = "translateY(0) scale(1)"
        label.style.color = "#9ca3af"
      }
    })

    // Input validation animation
    input.addEventListener("input", function () {
      if (this.checkValidity()) {
        this.style.borderColor = "var(--primary-green)"
        this.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"
      } else {
        this.style.borderColor = "#ef4444"
        this.style.boxShadow = "0 0 0 3px rgba(239,68,68,0.1)"
      }
    })
  })
}

// Button ripple effects
function initButtonEffects() {
  const buttons = document.querySelectorAll(".btn, .auth-btn, .checkout-btn, .filter-btn")

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple-effect")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
}

// Counter animations
function animateCounter(element) {
  const target = Number.parseInt(element.textContent)
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current).toLocaleString()
  }, 16)
}

function initCounterAnimations() {
  const elements = document.querySelectorAll(".stat-number")

  elements.forEach((element) => {
    animateCounter(element)
  })
}

// Parallax effects
function initParallaxEffects() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".parallax")

    parallaxElements.forEach((element) => {
      const speed = element.dataset.speed || 0.5
      const yPos = -(scrolled * speed)
      element.style.transform = `translateY(${yPos}px)`
    })
  })
}

// Page-specific animations
function initPageSpecificAnimations() {
  const currentPage = window.location.pathname.split("/").pop().replace(".html", "")

  switch (currentPage) {
    case "buyer-profile":
      initBuyerProfileAnimations()
      break
    case "cart":
      initCartAnimations()
      break
    case "products":
      initProductsAnimations()
      break
    case "seller-profile":
      initSellerProfileAnimations()
      break
    case "contact":
      initContactAnimations()
      break
    default:
      initGeneralAnimations()
  }
}

// Buyer profile specific animations
function initBuyerProfileAnimations() {
  // Animate profile stats on load
  setTimeout(() => {
    document.querySelectorAll(".stat-card").forEach((card, index) => {
      setTimeout(() => {
        card.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`
      }, index * 100)
    })
  }, 500)

  // Order history hover effects
  document.querySelectorAll(".order-item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(10px) scale(1.02)"
    })

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0) scale(1)"
    })
  })
}

// Cart specific animations
function initCartAnimations() {
  // Quantity button animations
  document.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.style.transform = "scale(0.9) rotate(180deg)"
      setTimeout(() => {
        this.style.transform = "scale(1) rotate(0deg)"
      }, 150)
    })
  })

  // Cart item removal animation
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", function () {
      const cartItem = this.closest(".cart-item")
      cartItem.style.animation = "slideOutRight 0.5s ease-out forwards"
      setTimeout(() => {
        cartItem.remove()
        updateCartTotal()
      }, 500)
    })
  })
}

// Products page animations
function initProductsAnimations() {
  // Filter button animations
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
      // Add active class to clicked button
      this.classList.add("active")

      // Animate product grid
      const grid = document.querySelector(".products-grid")
      grid.style.opacity = "0"
      grid.style.transform = "translateY(20px)"

      setTimeout(() => {
        grid.style.opacity = "1"
        grid.style.transform = "translateY(0)"
      }, 300)
    })
  })

  // Product card hover effects
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const image = this.querySelector(".product-image")
      if (image) {
        image.style.transform = "scale(1.1) rotate(2deg)"
      }
    })

    card.addEventListener("mouseleave", function () {
      const image = this.querySelector(".product-image")
      if (image) {
        image.style.transform = "scale(1) rotate(0deg)"
      }
    })
  })
}

// Seller profile animations
function initSellerProfileAnimations() {
  // Dashboard cards stagger animation
  document.querySelectorAll(".dashboard-card").forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`
    card.classList.add("animate-fade-in")
  })

  // Earnings chart animation
  const chart = document.querySelector(".earnings-chart")
  if (chart) {
    setTimeout(() => {
      chart.style.animation = "slideInUp 0.8s ease-out"
    }, 600)
  }
}

// Contact page animations
function initContactAnimations() {
  // Contact items stagger animation
  document.querySelectorAll(".contact-item").forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`
    item.classList.add("animate-slide-up")
  })

  // Form submission animation
  const contactForm = document.querySelector(".contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const submitBtn = this.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent

      submitBtn.textContent = "Sending..."
      submitBtn.style.background = "var(--gray)"
      submitBtn.disabled = true

      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = "Message Sent!"
        submitBtn.style.background = "var(--primary-green)"

        setTimeout(() => {
          submitBtn.textContent = originalText
          submitBtn.disabled = false
          this.reset()
        }, 2000)
      }, 1500)
    })
  }
}

// General animations for all pages
function initGeneralAnimations() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Loading animation for images
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("load", function () {
      this.style.animation = "fadeIn 0.5s ease-out"
    })
  })
}

// Utility functions
function updateCartTotal() {
  // Update cart total with animation
  const total = document.querySelector(".cart-total")
  if (total) {
    total.style.animation = "pulse 0.5s ease-out"
  }
}

// CSS for additional animations
const additionalStyles = `
.ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100px);
    }
}
`

// Inject additional styles
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)
