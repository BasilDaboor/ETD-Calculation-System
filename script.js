// Utility function to round up to nearest even number
function roundUpToEven(num) {
    if (num <= 0) return 0;
    if (num <= 2) return 2;
    return Math.ceil(num / 2) * 2;
}

// Flange Calculations
function calculateFlange20() {
    const input = parseFloat(document.getElementById('flange20').value);
    const resultDiv = document.getElementById('cleats20');
    
    if (input && input > 0) {
        const result = roundUpToEven(input / 4);
        resultDiv.textContent = `Cleats 20mm: ${result}`;
    } else {
        resultDiv.textContent = '';
    }
    calculateFoamTape();
}

function calculateFlange30() {
    const input = parseFloat(document.getElementById('flange30').value);
    const resultDiv = document.getElementById('cleats30');
    
    if (input && input > 0) {
        const result = roundUpToEven(input / 4);
        resultDiv.textContent = `Cleats 30mm: ${result}`;
    } else {
        resultDiv.textContent = '';
    }
    calculateFoamTape();
}

function calculateFlange40() {
    const input = parseFloat(document.getElementById('flange40').value);
    const resultDiv = document.getElementById('clamp40');
    
    if (input && input > 0) {
        const result = roundUpToEven(input / 2 / 0.35);
        resultDiv.textContent = `Clamp 40mm: ${result}`;
    } else {
        resultDiv.textContent = '';
    }
    calculateFoamTape();
}

function calculateFoamTape() {
    const flange20 = parseFloat(document.getElementById('flange20').value) || 0;
    const flange30 = parseFloat(document.getElementById('flange30').value) || 0;
    const flange40 = parseFloat(document.getElementById('flange40').value) || 0;
    
    const sum = flange20 + flange30 + flange40;
    const resultDiv = document.getElementById('foamTape');
    
    if (sum > 0) {
        const result = Math.ceil(sum / 2 / 7);
        resultDiv.textContent = `Foam Tape: ${result}`;
    } else {
        resultDiv.textContent = '';
    }
}

// S&C Calculations
function calculateSCleats() {
    const input = parseFloat(document.getElementById('sLength').value);
    const resultDiv = document.getElementById('sCleats');
    
    if (input && input > 0) {
        const result = Math.ceil((input / 1.2) * 1.1);
        resultDiv.textContent = `S-Cleats: ${result}`;
    } else {
        resultDiv.textContent = '';
    }
}

function calculateCCleats() {
    const input = parseFloat(document.getElementById('cLength').value);
    const resultDiv = document.getElementById('cCleats');
    
    if (input && input > 0) {
        const result = Math.ceil((input / 1.2) * 1.1);
        resultDiv.textContent = `C-Cleats: ${result}`;
    } else {
        resultDiv.textContent = '';
    }
}

// Wire Mesh Calculations
let wireMeshRows = [];

function createWireMeshRow() {
    const container = document.getElementById('wireMeshContainer');
    const rowId = Date.now();
    
    const row = document.createElement('div');
    row.className = 'wire-mesh-row';
    row.dataset.rowId = rowId;
    
    row.innerHTML = `
        <input type="number" class="width-input" placeholder="Width (mm)" step="any">
        <span class="multiply-symbol">×</span>
        <input type="number" class="height-input" placeholder="Height (mm)" step="any">
        <span class="wire-mesh-result"></span>
        <button class="delete-btn" onclick="deleteWireMeshRow(${rowId})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
        </button>
    `;
    
    container.appendChild(row);
    
    const widthInput = row.querySelector('.width-input');
    const heightInput = row.querySelector('.height-input');
    
    widthInput.addEventListener('input', (e) => {
        calculateWireMeshRow(row);
        if (widthInput.value && heightInput.value) {
            const currentInput = e.target;
            ensureEmptyRow();
            // Return focus to the current input
            setTimeout(() => currentInput.focus(), 0);
        }
    });
    
    heightInput.addEventListener('input', (e) => {
        calculateWireMeshRow(row);
        if (widthInput.value && heightInput.value) {
            const currentInput = e.target;
            ensureEmptyRow();
            // Return focus to the current input
            setTimeout(() => currentInput.focus(), 0);
        }
    });
    
    wireMeshRows.push(rowId);
    
    // Focus on the width input of the new row
    widthInput.focus();
}

function calculateWireMeshRow(row) {
    const widthInput = row.querySelector('.width-input');
    const heightInput = row.querySelector('.height-input');
    const resultSpan = row.querySelector('.wire-mesh-result');
    
    const width = parseFloat(widthInput.value);
    const height = parseFloat(heightInput.value);
    
    if (width > 0 && height > 0) {
        const widthM = (width + 100) / 1000;
        const heightM = (height + 100) / 1000;
        const sqm = widthM * heightM;
        resultSpan.textContent = `= ${sqm.toFixed(4)} sqm`;
    } else {
        resultSpan.textContent = '';
    }
    
    calculateTotalWireMesh();
}

function calculateTotalWireMesh() {
    let total = 0;
    const rows = document.querySelectorAll('.wire-mesh-row');
    
    rows.forEach(row => {
        const widthInput = row.querySelector('.width-input');
        const heightInput = row.querySelector('.height-input');
        
        const width = parseFloat(widthInput.value);
        const height = parseFloat(heightInput.value);
        
        if (width > 0 && height > 0) {
            const widthM = (width + 100) / 1000;
            const heightM = (height + 100) / 1000;
            total += widthM * heightM;
        }
    });
    
    const totalDiv = document.getElementById('totalWireMesh');
    if (total > 0) {
        totalDiv.textContent = `Total Wire Mesh: ${total.toFixed(2)} sqm`;
    } else {
        totalDiv.textContent = '';
    }
}

function deleteWireMeshRow(rowId) {
    const row = document.querySelector(`[data-row-id="${rowId}"]`);
    if (row) {
        row.remove();
        wireMeshRows = wireMeshRows.filter(id => id !== rowId);
        calculateTotalWireMesh();
        ensureEmptyRow();
    }
}

function ensureEmptyRow() {
    const rows = document.querySelectorAll('.wire-mesh-row');
    let hasEmptyRow = false;
    
    rows.forEach(row => {
        const widthInput = row.querySelector('.width-input');
        const heightInput = row.querySelector('.height-input');
        
        if (!widthInput.value && !heightInput.value) {
            hasEmptyRow = true;
        }
    });
    
    if (!hasEmptyRow) {
        createWireMeshRow(true); // Pass true to indicate don't auto-focus
    }
}

// Reset Function
function resetAll() {
    // Reset flange inputs
    document.getElementById('flange20').value = '';
    document.getElementById('flange30').value = '';
    document.getElementById('flange40').value = '';
    document.getElementById('cleats20').textContent = '';
    document.getElementById('cleats30').textContent = '';
    document.getElementById('clamp40').textContent = '';
    document.getElementById('foamTape').textContent = '';
    
    // Reset S&C inputs
    document.getElementById('sLength').value = '';
    document.getElementById('cLength').value = '';
    document.getElementById('sCleats').textContent = '';
    document.getElementById('cCleats').textContent = '';
    
    // Reset wire mesh
    const container = document.getElementById('wireMeshContainer');
    container.innerHTML = '';
    wireMeshRows = [];
    document.getElementById('totalWireMesh').textContent = '';
    
    // Create initial empty row
    createWireMeshRow();
}

// Event Listeners
document.getElementById('flange20').addEventListener('input', calculateFlange20);
document.getElementById('flange30').addEventListener('input', calculateFlange30);
document.getElementById('flange40').addEventListener('input', calculateFlange40);
document.getElementById('sLength').addEventListener('input', calculateSCleats);
document.getElementById('cLength').addEventListener('input', calculateCCleats);
document.getElementById('resetBtn').addEventListener('click', resetAll);

// Initialize
createWireMeshRow();