let currentSeller

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in as seller
  currentSeller = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentSeller || currentSeller.type !== "seller") {
    alert("Please login as a seller to access this page.")
    window.location.href = "login.html"
    return
  }

  // Initialize waste collection management
  initializeWasteCollection()
  loadCollectionRequests()
  updateCollectionStats()
})

function initializeWasteCollection() {
  // Initialize waste service form
  document.getElementById("wasteServiceForm").addEventListener("submit", (e) => {
    e.preventDefault()
    saveWasteService()
  })

  // Initialize filters
  document.getElementById("statusFilter").addEventListener("change", filterRequests)
  document.getElementById("dateFilter").addEventListener("change", filterRequests)
}

function saveWasteService() {
  const formData = {
    serviceName: document.getElementById("serviceName").value,
    serviceType: document.getElementById("serviceType").value,
    wasteTypes: getSelectedWasteTypes(),
    serviceArea: document.getElementById("serviceArea").value,
    collectionFee: Number.parseFloat(document.getElementById("collectionFee").value) || 0,
    minQuantity: Number.parseInt(document.getElementById("minQuantity").value) || 1,
    maxQuantity: Number.parseInt(document.getElementById("maxQuantity").value) || 100,
    availableDays: getSelectedDays(),
    startTime: document.getElementById("startTime").value,
    endTime: document.getElementById("endTime").value,
    description: document.getElementById("serviceDescription").value,
    active: true,
    createdDate: new Date().toISOString(),
  }

  // Validation
  if (!formData.serviceName || !formData.serviceType || formData.wasteTypes.length === 0) {
    alert("Please fill in all required fields and select at least one waste type.")
    return
  }

  if (formData.availableDays.length === 0) {
    alert("Please select at least one available day.")
    return
  }

  if (!formData.startTime || !formData.endTime) {
    alert("Please set your available time range.")
    return
  }

  // Save to seller's services
  if (!currentSeller.wasteServices) {
    currentSeller.wasteServices = []
  }

  formData.id = Date.now()
  currentSeller.wasteServices.push(formData)

  // Update seller data
  updateSellerData()

  alert("Waste collection service saved successfully!")
  document.getElementById("wasteServiceForm").reset()
}

function getSelectedWasteTypes() {
  const checkboxes = document.querySelectorAll('.waste-types-grid input[type="checkbox"]:checked')
  return Array.from(checkboxes).map((cb) => cb.value)
}

function getSelectedDays() {
  const checkboxes = document.querySelectorAll('.days-selection input[type="checkbox"]:checked')
  return Array.from(checkboxes).map((cb) => cb.value)
}

function loadCollectionRequests() {
  // Mock collection requests data
  const requests = [
    {
      id: "WC001",
      customerName: "John Doe",
      customerPhone: "+91 98765 43210",
      customerAddress: "123 Green Street, Mumbai, 400001",
      wasteTypes: ["paper", "plastic", "metal"],
      estimatedQuantity: 15,
      preferredDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      preferredTimeSlot: "10:00 AM - 2:00 PM",
      status: "pending",
      requestDate: new Date().toISOString(),
      notes: "Please call before arriving",
    },
    {
      id: "WC002",
      customerName: "Jane Smith",
      customerPhone: "+91 87654 32109",
      customerAddress: "456 Eco Avenue, Mumbai, 400002",
      wasteTypes: ["electronics", "plastic"],
      estimatedQuantity: 8,
      preferredDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      preferredTimeSlot: "2:00 PM - 6:00 PM",
      status: "accepted",
      requestDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      notes: "Old computer and printer",
    },
  ]

  // Store requests in seller data
  if (!currentSeller.collectionRequests) {
    currentSeller.collectionRequests = requests
    updateSellerData()
  }

  displayCollectionRequests(currentSeller.collectionRequests || [])
}

function displayCollectionRequests(requests) {
  const container = document.getElementById("requestsList")

  if (requests.length === 0) {
    container.innerHTML = `
            <div class="no-requests">
                <i class="fas fa-clipboard-list"></i>
                <h4>No collection requests</h4>
                <p>New waste collection requests will appear here.</p>
            </div>
        `
    return
  }

  container.innerHTML = requests
    .map(
      (request) => `
        <div class="request-card" data-id="${request.id}">
            <div class="request-header">
                <div class="request-id">#${request.id}</div>
                <div class="request-status status-${request.status}">${formatStatus(request.status)}</div>
            </div>
            <div class="request-details">
                <div class="customer-info">
                    <h4><i class="fas fa-user"></i> ${request.customerName}</h4>
                    <p><i class="fas fa-phone"></i> ${request.customerPhone}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${request.customerAddress}</p>
                </div>
                <div class="waste-info">
                    <div class="waste-types">
                        ${request.wasteTypes.map((type) => `<span class="waste-tag">${getWasteIcon(type)} ${formatWasteType(type)}</span>`).join("")}
                    </div>
                    <div class="waste-quantity">
                        <strong>Estimated: ${request.estimatedQuantity}kg</strong>
                    </div>
                    <div class="preferred-time">
                        <i class="fas fa-clock"></i> Preferred: ${formatDate(request.preferredDate)}, ${request.preferredTimeSlot}
                    </div>
                    ${request.notes ? `<div class="request-notes"><i class="fas fa-sticky-note"></i> ${request.notes}</div>` : ""}
                </div>
            </div>
            <div class="request-actions">
                ${getActionButtons(request)}
            </div>
        </div>
    `,
    )
    .join("")
}

function getActionButtons(request) {
  switch (request.status) {
    case "pending":
      return `
                <button class="btn btn-primary" onclick="acceptRequest('${request.id}')">
                    <i class="fas fa-check"></i> Accept
                </button>
                <button class="btn btn-secondary" onclick="viewRequestDetails('${request.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
                <button class="btn btn-danger" onclick="rejectRequest('${request.id}')">
                    <i class="fas fa-times"></i> Reject
                </button>
            `
    case "accepted":
      return `
                <button class="btn btn-primary" onclick="scheduleCollection('${request.id}')">
                    <i class="fas fa-calendar"></i> Schedule
                </button>
                <button class="btn btn-secondary" onclick="viewRequestDetails('${request.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            `
    case "scheduled":
      return `
                <button class="btn btn-primary" onclick="startCollection('${request.id}')">
                    <i class="fas fa-truck"></i> Start Collection
                </button>
                <button class="btn btn-secondary" onclick="viewRequestDetails('${request.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            `
    case "in-progress":
      return `
                <button class="btn btn-primary" onclick="completeCollection('${request.id}')">
                    <i class="fas fa-check-circle"></i> Complete
                </button>
                <button class="btn btn-secondary" onclick="viewRequestDetails('${request.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            `
    default:
      return `
                <button class="btn btn-secondary" onclick="viewRequestDetails('${request.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            `
  }
}

function acceptRequest(requestId) {
  updateRequestStatus(requestId, "accepted")
  alert("Request accepted! You can now schedule the collection.")
}

function rejectRequest(requestId) {
  if (confirm("Are you sure you want to reject this request?")) {
    updateRequestStatus(requestId, "cancelled")
    alert("Request rejected.")
  }
}

function scheduleCollection(requestId) {
  // In a real app, this would open a scheduling modal
  updateRequestStatus(requestId, "scheduled")
  alert("Collection scheduled! The customer will be notified.")
}

function startCollection(requestId) {
  updateRequestStatus(requestId, "in-progress")
  alert("Collection started! Update the status when completed.")
}

function completeCollection(requestId) {
  const actualWeight = prompt("Enter the actual weight collected (kg):")
  if (actualWeight && !isNaN(actualWeight)) {
    updateRequestStatus(requestId, "completed")

    // Update seller's collection stats
    if (!currentSeller.collectionStats) {
      currentSeller.collectionStats = {
        totalCollections: 0,
        totalWasteCollected: 0,
        totalEarnings: 0,
      }
    }

    currentSeller.collectionStats.totalCollections++
    currentSeller.collectionStats.totalWasteCollected += Number.parseFloat(actualWeight)
    currentSeller.collectionStats.totalEarnings += Number.parseFloat(actualWeight) * 5 // Mock rate

    updateSellerData()
    updateCollectionStats()

    alert(`Collection completed! ${actualWeight}kg collected.`)
  }
}

function viewRequestDetails(requestId) {
  const request = currentSeller.collectionRequests.find((r) => r.id === requestId)
  if (request) {
    alert(
      `Request Details:\n\nCustomer: ${request.customerName}\nPhone: ${request.customerPhone}\nAddress: ${request.customerAddress}\nWaste Types: ${request.wasteTypes.join(", ")}\nEstimated Quantity: ${request.estimatedQuantity}kg\nPreferred Date: ${formatDate(request.preferredDate)}\nTime Slot: ${request.preferredTimeSlot}\nStatus: ${formatStatus(request.status)}\nNotes: ${request.notes || "None"}`,
    )
  }
}

function updateRequestStatus(requestId, newStatus) {
  const requests = currentSeller.collectionRequests || []
  const requestIndex = requests.findIndex((r) => r.id === requestId)

  if (requestIndex !== -1) {
    requests[requestIndex].status = newStatus
    requests[requestIndex].lastUpdated = new Date().toISOString()
    updateSellerData()
    displayCollectionRequests(requests)
  }
}

function filterRequests() {
  const statusFilter = document.getElementById("statusFilter").value
  const dateFilter = document.getElementById("dateFilter").value

  let filteredRequests = currentSeller.collectionRequests || []

  // Filter by status
  if (statusFilter !== "all") {
    filteredRequests = filteredRequests.filter((r) => r.status === statusFilter)
  }

  // Filter by date
  if (dateFilter !== "all") {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    filteredRequests = filteredRequests.filter((r) => {
      const requestDate = new Date(r.preferredDate)

      switch (dateFilter) {
        case "today":
          return requestDate.toDateString() === today.toDateString()
        case "tomorrow":
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          return requestDate.toDateString() === tomorrow.toDateString()
        case "week":
          const weekFromNow = new Date(today)
          weekFromNow.setDate(weekFromNow.getDate() + 7)
          return requestDate >= today && requestDate <= weekFromNow
        case "month":
          const monthFromNow = new Date(today)
          monthFromNow.setMonth(monthFromNow.getMonth() + 1)
          return requestDate >= today && requestDate <= monthFromNow
        default:
          return true
      }
    })
  }

  displayCollectionRequests(filteredRequests)
}

function updateCollectionStats() {
  const stats = currentSeller.collectionStats || {
    totalCollections: 0,
    totalWasteCollected: 0,
    totalEarnings: 0,
  }

  document.getElementById("totalCollections").textContent = stats.totalCollections
  document.getElementById("totalWasteCollected").textContent = `${stats.totalWasteCollected}kg`
  document.getElementById("totalEarnings").textContent = `₹${stats.totalEarnings}`
  document.getElementById("avgRating").textContent = "4.8" // Mock rating
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
    pending: "Pending",
    accepted: "Accepted",
    scheduled: "Scheduled",
    "in-progress": "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  }
  return statusMap[status] || status
}

function formatWasteType(type) {
  const typeMap = {
    paper: "Paper",
    plastic: "Plastic",
    glass: "Glass",
    metal: "Metal",
    electronics: "Electronics",
    organic: "Organic",
  }
  return typeMap[type] || type
}

function getWasteIcon(type) {
  const iconMap = {
    paper: "📄",
    plastic: "🍶",
    glass: "🥃",
    metal: "🥫",
    electronics: "📱",
    organic: "🍎",
  }
  return iconMap[type] || "📦"
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow"
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }
}
