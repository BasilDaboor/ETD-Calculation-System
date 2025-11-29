// Utility function to round up to next even number
function roundUpToEven(value) {
    if (value === 0) return 0;
    if (value <= 2) return 2;
    return Math.ceil(value / 2) * 2;
}

// FLANGE SECTION CALCULATIONS
function calculateCleats20() {
    const flange20 = parseFloat(document.getElementById('flange20').value) || 0;
    const cleats = flange20 > 0 ? roundUpToEven(flange20 / 4) : 0;
    document.getElementById('cleats20Result').textContent = `Cleats 20mm: ${cleats}`;
    calculateFoamTape();
}
 

function calculateCleats30() {
    const flange30 = parseFloat(document.getElementById('flange30').value) || 0;
    const cleats = flange30 > 0 ? roundUpToEven(flange30 / 4) : 0;
    document.getElementById('cleats30Result').textContent = `Cleats 30mm: ${cleats}`;
    calculateFoamTape();
}

function calculateClamp40() {
    const flange40 = parseFloat(document.getElementById('flange40').value) || 0;
    const clamp = flange40 > 0 ? roundUpToEven(flange40 / 2 / 0.35) : 0;
    document.getElementById('clamp40Result').textContent = `Clamp 40mm: ${clamp}`;
    calculateFoamTape();
}

function calculateFoamTape() {
    const flange20 = parseFloat(document.getElementById('flange20').value) || 0;
    const flange30 = parseFloat(document.getElementById('flange30').value) || 0;
    const flange40 = parseFloat(document.getElementById('flange40').value) || 0;
    
    const sum = flange20 + flange30 + flange40;
    const foamTape = sum > 0 ? Math.ceil(sum / 2 / 7) : 0;
    document.getElementById('foamTapeResult').textContent = foamTape;
}

// S&C SECTION CALCULATIONS
function calculateSCleats() {
    const sLength = parseFloat(document.getElementById('sLength').value) || 0;
    const sCleats = sLength > 0 ? Math.ceil((sLength / 1.2) * 1.1) : 0;
    document.getElementById('sCleatsResult').textContent = `S-Cleats: ${sCleats}`;
}

function calculateCCleats() {
    const cLength = parseFloat(document.getElementById('cLength').value) || 0;
    const cCleats = cLength > 0 ? Math.ceil((cLength / 1.2) * 1.1) : 0;
    document.getElementById('cCleatsResult').textContent = `C-Cleats: ${cCleats}`;
}

// WIRE MESH SECTION
let wireMeshRows = [];

function createWireMeshRow() {
    const rowId = Date.now();
    const row = {
        id: rowId,
        width: 0,
        height: 0,
        sqm: 0
    };
    wireMeshRows.push(row);
    renderWireMeshRows();
}

function deleteWireMeshRow(rowId) {
    wireMeshRows = wireMeshRows.filter(row => row.id !== rowId);
    renderWireMeshRows();
    calculateTotalWireMesh();
}

function updateWireMeshRow(rowId, field, value, inputElement) {
    const row = wireMeshRows.find(r => r.id === rowId);
    if (row) {
        row[field] = parseFloat(value) || 0;
        
        // Calculate sqm for this row
        if (row.width > 0 && row.height > 0) {
            const widthMeters = (row.width + 100) / 1000;
            const heightMeters = (row.height + 100) / 1000;
            row.sqm = widthMeters * heightMeters;
        } else {
            row.sqm = 0;
        }
        
        // Update the display for this row
        const resultElement = document.getElementById(`result-${rowId}`);
        if (resultElement) {
            resultElement.textContent = row.sqm > 0 ? `${row.sqm.toFixed(4)} sqm` : '0 sqm';
        }
        
        calculateTotalWireMesh();
        
        // Check if we need to add a new row
        checkAndAddNewRow(inputElement);
    }
}

function checkAndAddNewRow(currentInput) {
    const lastRow = wireMeshRows[wireMeshRows.length - 1];
    if (lastRow && lastRow.width > 0 && lastRow.height > 0) {
        // Store the current active element before creating new row
        const activeElement = currentInput || document.activeElement;
        createWireMeshRow();
        
        // Restore focus to the element that was being edited
        if (activeElement && activeElement.tagName === 'INPUT') {
            // Use setTimeout to ensure the DOM has updated
            setTimeout(() => {
                activeElement.focus();
                // Restore cursor position to the end
                activeElement.setSelectionRange(activeElement.value.length, activeElement.value.length);
            }, 0);
        }
    }
}

function calculateTotalWireMesh() {
    const total = wireMeshRows.reduce((sum, row) => sum + row.sqm, 0);
    document.getElementById('totalWireMesh').textContent = total.toFixed(2);
}

function renderWireMeshRows() {
    const container = document.getElementById('wireMeshContainer');
    container.innerHTML = '';
    
    wireMeshRows.forEach((row, index) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'wire-mesh-row';
        
        const widthInput = document.createElement('input');
        widthInput.type = 'number';
        widthInput.placeholder = 'Width (mm)';
        widthInput.step = '0.01';
        widthInput.min = '0';
        widthInput.value = row.width > 0 ? row.width : '';
        widthInput.addEventListener('input', (e) => {
            updateWireMeshRow(row.id, 'width', e.target.value, e.target);
        });
        
        const multiplySymbol = document.createElement('span');
        multiplySymbol.className = 'multiply-symbol';
        multiplySymbol.textContent = '×';
        
        const heightInput = document.createElement('input');
        heightInput.type = 'number';
        heightInput.placeholder = 'Height (mm)';
        heightInput.step = '0.01';
        heightInput.min = '0';
        heightInput.value = row.height > 0 ? row.height : '';
        heightInput.addEventListener('input', (e) => {
            updateWireMeshRow(row.id, 'height', e.target.value, e.target);
        });
        
        const equalsSymbol = document.createElement('span');
        equalsSymbol.className = 'equals-symbol';
        equalsSymbol.textContent = '=';
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'wire-mesh-result';
        resultDiv.id = `result-${row.id}`;
        resultDiv.textContent = row.sqm > 0 ? `${row.sqm.toFixed(4)} sqm` : '0 sqm';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
        `;
        
        // Only show delete button if there's more than one row or if the row has values
        if (wireMeshRows.length > 1 || row.width > 0 || row.height > 0) {
            deleteBtn.addEventListener('click', () => deleteWireMeshRow(row.id));
        } else {
            deleteBtn.style.visibility = 'hidden';
        }
        
        rowDiv.appendChild(widthInput);
        rowDiv.appendChild(multiplySymbol);
        rowDiv.appendChild(heightInput);
        rowDiv.appendChild(equalsSymbol);
        rowDiv.appendChild(resultDiv);
        rowDiv.appendChild(deleteBtn);
        
        container.appendChild(rowDiv);
    });
}

// RESET FUNCTION
function resetAll() {
    // Reset flange inputs
    document.getElementById('flange20').value = '';
    document.getElementById('flange30').value = '';
    document.getElementById('flange40').value = '';
    document.getElementById('cleats20Result').textContent = 'Cleats 20mm: 0';
    document.getElementById('cleats30Result').textContent = 'Cleats 30mm: 0';
    document.getElementById('clamp40Result').textContent = 'Clamp 40mm: 0';
    document.getElementById('foamTapeResult').textContent = '0';
    
    // Reset S&C inputs
    document.getElementById('sLength').value = '';
    document.getElementById('cLength').value = '';
    document.getElementById('sCleatsResult').textContent = 'S-Cleats: 0';
    document.getElementById('cCleatsResult').textContent = 'C-Cleats: 0';
    
    // Reset wire mesh
    wireMeshRows = [];
    createWireMeshRow();
    calculateTotalWireMesh();
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    // Flange section
    document.getElementById('flange20').addEventListener('input', calculateCleats20);
    document.getElementById('flange30').addEventListener('input', calculateCleats30);
    document.getElementById('flange40').addEventListener('input', calculateClamp40);
    
    // S&C section
    document.getElementById('sLength').addEventListener('input', calculateSCleats);
    document.getElementById('cLength').addEventListener('input', calculateCCleats);
    
    // Reset button
    document.getElementById('resetBtn').addEventListener('click', resetAll);
    
    // Initialize wire mesh with one empty row
    createWireMeshRow();
});