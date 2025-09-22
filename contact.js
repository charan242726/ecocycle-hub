// Contact form handling
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm")

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(contactForm)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      timestamp: new Date().toISOString(),
    }

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      showNotification("Please fill in all required fields.", "error")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      showNotification("Please enter a valid email address.", "error")
      return
    }

    // Store contact submission (in real app, this would be sent to server)
    const contacts = JSON.parse(localStorage.getItem("contactSubmissions") || "[]")
    contacts.push(data)
    localStorage.setItem("contactSubmissions", JSON.stringify(contacts))

    // Show success message
    showNotification("Thank you for your message! We'll get back to you within 24 hours.", "success")

    // Reset form
    contactForm.reset()
  })
})

// Show notification function
function showNotification(message, type) {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `

  // Add to page
  document.body.appendChild(notification)

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    notification.remove()
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 5000)
}
