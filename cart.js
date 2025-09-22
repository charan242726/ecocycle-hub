document.addEventListener("DOMContentLoaded", () => {
  loadCart()
  initializeCartEvents()
  updateCartCount()
})

function loadCart() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser) {
    showEmptyCart()
    return
  }

  const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || []

  if (cart.length === 0) {
    showEmptyCart()
    return
  }

  displayCartItems(cart)
  updateCartSummary(cart)
}

function showEmptyCart() {
  document.querySelector(".cart-content").style.display = "none"
  document.getElementById("emptyCart").style.display = "block"
}

function displayCartItems(cart) {
  const cartItemsContainer = document.getElementById("cartItems")

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <div class="product-icon">${item.icon}</div>
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="item-features">
                    <span class="eco-badge"><i class="fas fa-leaf"></i> Eco-Friendly</span>
                    <span class="co2-saving">Saves ${item.co2Saving}kg CO₂</span>
                </div>
            </div>
            <div class="item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="item-price">
                <div class="unit-price">₹${item.price} each</div>
                <div class="total-price">₹${item.price * item.quantity}</div>
            </div>
            <div class="item-actions">
                <button class="btn-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function updateCartSummary(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 1000 ? 0 : 50 // Free shipping over ₹1000
  const ecoDiscount = Math.floor(subtotal * 0.05) // 5% eco discount
  const total = subtotal + shipping - ecoDiscount
  const totalCO2 = cart.reduce((sum, item) => sum + item.co2Saving * item.quantity, 0)

  document.getElementById("subtotal").textContent = `₹${subtotal}`
  document.getElementById("shipping").textContent = shipping === 0 ? "Free" : `₹${shipping}`
  document.getElementById("ecoDiscount").textContent = `-₹${ecoDiscount}`
  document.getElementById("total").textContent = `₹${total}`
  document.getElementById("co2Impact").textContent = `${totalCO2}kg`

  // Enable/disable checkout button
  const checkoutBtn = document.getElementById("checkoutBtn")
  if (cart.length > 0) {
    checkoutBtn.disabled = false
    checkoutBtn.onclick = () => proceedToCheckout(total)
  } else {
    checkoutBtn.disabled = true
  }
}

function updateQuantity(productId, change) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser) return

  const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || []
  const itemIndex = cart.findIndex((item) => item.id === productId)

  if (itemIndex !== -1) {
    cart[itemIndex].quantity += change

    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1)
    }

    localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart))
    loadCart()
    updateCartCount()
  }
}

function removeFromCart(productId) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser) return

  let cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || []
  cart = cart.filter((item) => item.id !== productId)

  localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cart))
  loadCart()
  updateCartCount()
}

function initializeCartEvents() {
  // Clear cart
  document.getElementById("clearCart").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"))
      if (currentUser) {
        localStorage.removeItem(`cart_${currentUser.id}`)
        loadCart()
        updateCartCount()
      }
    }
  })

  // Apply promo code
  document.getElementById("applyPromo").addEventListener("click", () => {
    const promoCode = document.getElementById("promoCode").value.trim().toUpperCase()

    const validCodes = {
      ECO10: 10,
      GREEN15: 15,
      SAVE20: 20,
    }

    if (validCodes[promoCode]) {
      alert(`Promo code applied! You saved ${validCodes[promoCode]}%`)
      // In a real app, you would apply the discount here
    } else {
      alert("Invalid promo code. Try ECO10, GREEN15, or SAVE20")
    }
  })
}

function proceedToCheckout(total) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser) {
    alert("Please login to proceed with checkout.")
    window.location.href = "login.html"
    return
  }

  // Create order
  const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || []
  const order = {
    id: Date.now(),
    date: new Date().toISOString(),
    items: cart,
    total: total,
    status: "pending",
    discount: Math.floor(total * 0.05),
  }

  // Add to user's orders
  if (!currentUser.orders) {
    currentUser.orders = []
  }
  currentUser.orders.push(order)

  // Update eco points (1 point per ₹10 spent)
  const pointsEarned = Math.floor(total / 10)
  currentUser.ecoPoints = (currentUser.ecoPoints || 0) + pointsEarned

  // Update user data
  const users = JSON.parse(localStorage.getItem("users")) || []
  const userIndex = users.findIndex((u) => u.id === currentUser.id)
  if (userIndex !== -1) {
    users[userIndex] = currentUser
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
  }

  // Clear cart
  localStorage.removeItem(`cart_${currentUser.id}`)

  alert(`Order placed successfully! Order ID: ${order.id}\nYou earned ${pointsEarned} Eco Points!`)
  window.location.href = "buyer-profile.html"
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
