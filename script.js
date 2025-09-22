// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 80, // Adjust for fixed navbar height
            behavior: 'smooth'
        });
    });
});

// Share button functionality
document.querySelectorAll('#shareBtn, #shareBtn2').forEach(button => {
    button.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'Real World - Eco-Friendly Living',
                text: 'Join the movement towards sustainable living!',
                url: window.location.href
            }).catch(console.error);
        } else {
            alert('Web Share API not supported in your browser. Copy the URL to share.');
        }
    });
});

// Recycling tips modal
const tipButtons = document.querySelectorAll('.btn-card');
const modal = document.getElementById('recyclingModal');
const closeModalBtn = document.querySelector('.close-modal');
const gotItBtn = document.getElementById('gotItBtn');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');

tipButtons.forEach(button => {
    button.addEventListener('click', function() {
        const type = this.getAttribute('data-tip');
        openModal(type);
    });
});

function openModal(type) {
    const tips = {
        paper: {
            title: '📄 Paper & Cardboard Recycling Guide',
            content: `
                <div class="tip-section">
                    <h4 style="color: #059669;">✅ What CAN be recycled:</h4>
                    <ul>
                        <li>Newspapers, magazines, catalogs</li>
                        <li>Office paper, notebooks, envelopes</li>
                        <li>Cardboard boxes (flattened)</li>
                        <li>Paper bags, wrapping paper (non-metallic)</li>
                        <li>Cereal boxes, shoe boxes</li>
                        <li>Phone books, paperback books</li>
                    </ul>
                </div>
                <div class="tip-section">
                    <h4 style="color: #dc2626;">❌ What CANNOT be recycled:</h4>
                    <ul>
                        <li>Wax-coated paper (milk cartons)</li>
                        <li>Paper towels, napkins, tissues</li>
                        <li>Pizza boxes with grease stains</li>
                        <li>Metallic or plastic-coated paper</li>
                        <li>Carbon paper, photographs</li>
                    </ul>
                </div>
                <div class="tip-section">
                    <h4 style="color: #2563eb;">📋 Step-by-step process:</h4>
                    <ol>
                        <li>Remove all non-paper materials (staples, tape, plastic)</li>
                        <li>Flatten cardboard boxes completely</li>
                        <li>Keep paper clean and dry</li>
                        <li>Sort by type if required by your local facility</li>
                        <li>Place in designated recycling bin</li>
                    </ol>
                </div>
                <div class="tip-fact">
                    <p><strong>Environmental Impact:</strong> Recycling one ton of paper saves 17 trees, 7,000 gallons of water, and reduces landfill waste by 3.3 cubic yards!</p>
                </div>
            `
        },
        plastic: {
            title: '🍶 Plastic & Glass Recycling Guide',
            content: `
                <div class="tip-section">
                    <h4 style="color: #059669;">🔢 Plastic recycling numbers:</h4>
                    <ul>
                        <li>#1 PET: Water bottles, soda bottles ✅</li>
                        <li>#2 HDPE: Milk jugs, detergent bottles ✅</li>
                        <li>#3 PVC: Pipes, packaging (check locally) ⚠</li>
                        <li>#4 LDPE: Plastic bags (special collection) ⚠</li>
                        <li>#5 PP: Yogurt containers, bottle caps ✅</li>
                        <li>#6 PS: Styrofoam (usually not accepted) ❌</li>
                        <li>#7 Other: Mixed plastics (check locally) ⚠</li>
                    </ul>
                </div>
                <div class="tip-section">
                    <h4 style="color: #2563eb;">🧽 Cleaning instructions:</h4>
                    <ol>
                        <li>Empty all contents completely</li>
                        <li>Rinse with water to remove food residue</li>
                        <li>Remove labels if they peel off easily</li>
                        <li>Separate caps and lids (recycle separately)</li>
                        <li>Let dry before placing in recycling bin</li>
                    </ol>
                </div>
                <div class="tip-section">
                    <h4 style="color: #7e22ce;">🥃 Glass recycling:</h4>
                    <ul>
                        <li>Clear glass: bottles, jars</li>
                        <li>Brown glass: beer bottles, medicine bottles</li>
                        <li>Green glass: wine bottles, some jars</li>
                        <li>Remove metal lids and corks</li>
                        <li>No need to remove labels</li>
                    </ul>
                </div>
                <div class="tip-fact">
                    <p><strong>Amazing Fact:</strong> Glass can be recycled infinitely without losing quality, and recycling plastic bottles saves enough energy to power a computer for 25 minutes!</p>
                </div>
            `
        },
        electronics: {
            title: '🔋 Electronics & Metal Recycling Guide',
            content: `
                <div class="tip-section">
                    <h4 style="color: #059669;">📱 Electronics (E-waste):</h4>
                    <ul>
                        <li>Smartphones, tablets, laptops</li>
                        <li>TVs, monitors, printers</li>
                        <li>Small appliances, gaming consoles</li>
                        <li>Cables, chargers, keyboards</li>
                        <li>LED bulbs, fluorescent tubes</li>
                    </ul>
                </div>
                <div class="tip-section">
                    <h4 style="color: #dc2626;">🔒 Before recycling electronics:</h4>
                    <ol>
                        <li>Back up important data</li>
                        <li>Perform factory reset or data wipe</li>
                        <li>Remove batteries if possible</li>
                        <li>Remove SIM cards and memory cards</li>
                        <li>Find certified e-waste recycling center</li>
                    </ol>
                </div>
                <div class="tip-section">
                    <h4 style="color: #ea580c;">🔋 Battery recycling:</h4>
                    <ul>
                        <li>Alkaline batteries: check local programs</li>
                        <li>Rechargeable batteries: electronics stores</li>
                        <li>Car batteries: auto parts stores</li>
                        <li>Never throw in regular trash</li>
                        <li>Tape terminals to prevent fires</li>
                    </ul>
                </div>
                <div class="tip-section">
                    <h4 style="color: #4b5563;">🥫 Metal recycling:</h4>
                    <ul>
                        <li>Aluminum cans: rinse and crush</li>
                        <li>Steel/tin cans: remove labels, rinse</li>
                        <li>Scrap metal: separate by type</li>
                        <li>No need to remove paper labels</li>
                    </ul>
                </div>
                <div class="tip-fact">
                    <p><strong>Valuable Recovery:</strong> One ton of recycled electronics can recover 35,000 lbs of copper, 772 lbs of silver, 75 lbs of gold, and 33 lbs of palladium!</p>
                </div>
            `
        }
    };
    
    modalTitle.textContent = tips[type].title;
    modalContent.innerHTML = tips[type].content;
    modal.style.display = 'flex';
}

closeModalBtn.addEventListener('click', closeModal);
gotItBtn.addEventListener('click', closeModal);

function closeModal() {
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Form submissions
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Registration submitted successfully! Our team will contact you soon.');
    this.reset();
});

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Message sent successfully! We will get back to you soon.');
    this.reset();
});

// Counter animation for Impact Section
function animateCounter(elementId, targetValue, suffix = '') {
    const element = document.getElementById(elementId);
    let currentValue = 0;
    const increment = targetValue / 100; // Divide by 100 for 100 steps
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
    }, 20); // Update every 20ms
}

// Start counters when impact section is visible
let countersStarted = false;
function checkCounters() {
    const impactSection = document.getElementById('impact');
    if (impactSection) { // Ensure the element exists
        const rect = impactSection.getBoundingClientRect();
        
        // Check if the section is in the viewport and counters haven't started yet
        if (rect.top < window.innerHeight && rect.bottom > 0 && !countersStarted) {
            countersStarted = true;
            animateCounter('wasteCounter', 2847);
            animateCounter('co2Counter', 15420);
            animateCounter('treesCounter', 8934);
            animateCounter('membersCounter', 12567);
        }
    }
}

// Initialize counters on scroll and page load
window.addEventListener('scroll', checkCounters);
window.addEventListener('load', checkCounters);

// Add to cart functionality (simplified)
document.querySelectorAll('.btn-product').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        alert(`${productName} added to cart!`);
    });
});
