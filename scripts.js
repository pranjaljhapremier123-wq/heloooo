// Initial Mock Scanned Database
const initialScans = [
    {
        id: "8841",
        time: "Just now",
        category: "Oversized Hoodie",
        fabric: "Heavy Cotton",
        color: "Sage Green",
        pattern: "Minimalist Graphic",
        brand: "Nike"
    },
    {
        id: "8840",
        time: "12m ago",
        category: "Cargo Pants",
        fabric: "Twill Nylon",
        color: "Charcoal Black",
        pattern: "Solid Utility",
        brand: "Zara"
    }
];

// Database of mock items for live hardware simulation
const mockItemsPool = [
    { category: "Puffer Jacket", fabric: "Polyester", color: "Cobalt Blue", pattern: "Quilted", brand: "North Face" },
    { category: "Graphic Tee", fabric: "Organic Cotton", color: "Off-White", pattern: "Vintage Print", brand: "Adidas" },
    { category: "Denim Jacket", fabric: "Raw Denim", color: "Indigo", pattern: "Washed", brand: "Levi's" },
    { category: "Track Sweatpants", fabric: "Fleece", color: "Heather Grey", pattern: "Striped", brand: "Puma" }
];

let totalScans = 142;
let totalPairs = 38;
let scanIdCounter = 8842;

// Render initial scans on load
document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('feedContainer');
    initialScans.forEach(item => {
        feedContainer.appendChild(createScanElement(item));
    });

    // Event Listeners
    document.getElementById('simScanBtn').addEventListener('click', triggerHardwareScan);
    document.getElementById('calibrateBtn').addEventListener('click', calibrateSensor);
});

// Helper: Create HTML Element for a Scanned Item
function createScanElement(item) {
    const scanCard = document.createElement('div');
    scanCard.className = 'scan-item';
    scanCard.innerHTML = `
        <div class="scan-thumb">IoT CAM</div>
        <div class="scan-details">
            <div class="scan-title">Scanned Item #${item.id}</div>
            <div class="scan-meta">Detected via IoT Edge Scanner · ${item.time}</div>
            <div class="tags">
                <span class="tag">Category: ${item.category}</span>
                <span class="tag">Fabric: ${item.fabric}</span>
                <span class="tag">Color: ${item.color}</span>
                <span class="tag">Pattern: ${item.pattern}</span>
                <span class="tag">Brand: ${item.brand}</span>
            </div>
        </div>
        <button class="action-btn" onclick="viewMatch('${item.id}', '${item.category}')">View Match</button>
    `;
    return scanCard;
}

// Interactive Feature: Trigger new hardware scan
function triggerHardwareScan() {
    const feedContainer = document.getElementById('feedContainer');
    const randomItem = mockItemsPool[Math.floor(Math.random() * mockItemsPool.length)];
    
    const newItem = {
        id: scanIdCounter.toString(),
        time: "Just now",
        ...randomItem
    };

    scanIdCounter++;
    totalScans++;
    
    // Update counter text
    document.getElementById('scansCount').innerText = totalScans;

    // Prepend new item to feed
    feedContainer.prepend(createScanElement(newItem));
}

// Interactive Feature: Calibrate sensor action
function calibrateSensor() {
    const statusBadge = document.getElementById('deviceStatus');
    statusBadge.innerText = "Calibrating...";
    statusBadge.style.color = "#f59e0b";

    setTimeout(() => {
        statusBadge.innerText = "Device Online";
        statusBadge.style.color = "var(--success)";
        alert("IoT Sensor successfully recalibrated!");
    }, 1200);
}

// Interactive Feature: View Match Modal/Alert
function viewMatch(itemId, category) {
    alert(`Searching ThreadMatch AI database...\n\nFound high-confidence fashion matches for Item #${itemId} (${category}).`);
}
