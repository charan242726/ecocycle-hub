// Recycling information data
const recyclingData = {
  plastic: {
    title: "Plastic Recycling",
    icon: "🥤",
    description: "Learn how to properly recycle different types of plastic materials",
    steps: [
      "Check the recycling number (1-7) on the bottom of plastic items",
      "Clean containers thoroughly to remove food residue",
      "Remove caps and lids (recycle separately if accepted)",
      "Sort by plastic type if required by your local facility",
    ],
    tips: [
      "Plastic bags should go to special collection points, not regular recycling",
      "Styrofoam is generally not recyclable in curbside programs",
      "Look for the recycling symbol with numbers 1, 2, and 5 - these are most commonly accepted",
    ],
    accepted: ["Water bottles", "Food containers", "Detergent bottles", "Yogurt cups"],
    notAccepted: ["Plastic bags", "Styrofoam", "Broken plastic toys", "Mixed material items"],
  },
  paper: {
    title: "Paper Recycling",
    icon: "📄",
    description: "Recycle paper products to save trees and reduce landfill waste",
    steps: [
      "Remove any non-paper materials (staples, plastic windows, etc.)",
      "Keep paper dry and clean",
      "Separate different types if required",
      "Flatten cardboard boxes to save space",
    ],
    tips: [
      "Wet or food-soiled paper cannot be recycled",
      "Shredded paper should be contained in a paper bag",
      "Wax-coated paper (like some cups) is not recyclable",
    ],
    accepted: ["Newspapers", "Magazines", "Office paper", "Cardboard boxes"],
    notAccepted: ["Wax-coated paper", "Paper towels", "Tissues", "Carbon paper"],
  },
  glass: {
    title: "Glass Recycling",
    icon: "🍾",
    description: "Glass can be recycled indefinitely without losing quality",
    steps: [
      "Rinse containers to remove food residue",
      "Remove caps and lids",
      "Sort by color if required (clear, brown, green)",
      "Handle carefully to avoid breakage",
    ],
    tips: [
      "Broken glass should be wrapped safely before disposal",
      "Window glass and mirrors have different compositions and need special handling",
      "Glass can be recycled endlessly without quality loss",
    ],
    accepted: ["Bottles", "Jars", "Food containers"],
    notAccepted: ["Window glass", "Mirrors", "Light bulbs", "Ceramics"],
  },
  metal: {
    title: "Metal Recycling",
    icon: "🥫",
    description: "Metal recycling saves energy and natural resources",
    steps: [
      "Clean containers to remove food residue",
      "Remove labels if possible",
      "Separate ferrous (magnetic) from non-ferrous metals",
      "Crush cans to save space",
    ],
    tips: [
      "Use a magnet to test - if it sticks, it's ferrous metal",
      "Aluminum cans are highly valuable for recycling",
      "Large metal items may need special pickup arrangements",
    ],
    accepted: ["Aluminum cans", "Steel cans", "Copper wire", "Brass items"],
    notAccepted: ["Paint cans with residue", "Aerosol cans", "Metal with hazardous materials"],
  },
  electronic: {
    title: "Electronic Waste",
    icon: "📱",
    description: "Proper e-waste disposal prevents toxic materials from harming the environment",
    steps: [
      "Remove all personal data from devices",
      "Remove batteries if possible",
      "Find certified e-waste recycling centers",
      "Never put e-waste in regular trash",
    ],
    tips: [
      "Many retailers offer take-back programs for electronics",
      "Data destruction services are available for sensitive information",
      "Some components contain valuable materials that can be recovered",
    ],
    accepted: ["Phones", "Computers", "Tablets", "Small appliances"],
    notAccepted: ["CRT monitors (need special handling)", "Items with hazardous materials"],
  },
  organic: {
    title: "Organic Waste",
    icon: "🍎",
    description: "Composting organic waste creates valuable soil amendment",
    steps: [
      "Separate food scraps from packaging",
      "Include fruit and vegetable peels, coffee grounds",
      "Add yard waste like leaves and grass clippings",
      "Maintain proper moisture and air circulation",
    ],
    tips: [
      "Avoid meat, dairy, and oily foods in home composting",
      "Turn compost regularly for faster decomposition",
      "Finished compost improves soil health",
    ],
    accepted: ["Fruit peels", "Vegetable scraps", "Coffee grounds", "Yard waste"],
    notAccepted: ["Meat", "Dairy products", "Diseased plants", "Pet waste"],
  },
}

// Show recycling information modal
function showRecyclingInfo(category) {
  const modal = document.getElementById("recyclingModal")
  const info = recyclingData[category]

  if (!info) return

  const infoContainer = document.getElementById("recyclingInfo")
  infoContainer.innerHTML = `
        <div class="recycling-info">
            <div class="info-header">
                <div class="info-icon">${info.icon}</div>
                <h2>${info.title}</h2>
            </div>
            <p class="info-description">${info.description}</p>
            
            <div class="info-section">
                <h3>How to Recycle:</h3>
                <ol class="steps-list">
                    ${info.steps.map((step) => `<li>${step}</li>`).join("")}
                </ol>
            </div>
            
            <div class="info-section">
                <h3>Tips:</h3>
                <ul class="tips-list">
                    ${info.tips.map((tip) => `<li>${tip}</li>`).join("")}
                </ul>
            </div>
            
            <div class="info-grid">
                <div class="info-column">
                    <h3>✅ Accepted Items:</h3>
                    <ul>
                        ${info.accepted.map((item) => `<li>${item}</li>`).join("")}
                    </ul>
                </div>
                <div class="info-column">
                    <h3>❌ Not Accepted:</h3>
                    <ul>
                        ${info.notAccepted.map((item) => `<li>${item}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </div>
    `

  modal.style.display = "block"
}

// Close modal functionality
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("recyclingModal")
  const closeBtn = document.querySelector(".close")

  closeBtn.onclick = () => {
    modal.style.display = "none"
  }

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  }
})
