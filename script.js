// Fetch car data from JSON file
let carData = [];

// Show loading state
function showLoading() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-white">Loading car data...</p>
        </div>
    `;
}

// Fetch data with loading state
function fetchCarData() {
    showLoading();
    fetch('cars.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            carData = data;
            // Show initial empty state after load
            const resultsContainer = document.getElementById('resultsContainer');
            resultsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-car fa-4x text-light mb-3"></i>
                    <p class="text-light">Enter a vehicle make or model to explore our luxury vehicle database</p>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error loading car data:', error);
            displayError();
        });
}

// Display error state
function displayError() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h4 class="text-warning">Error Loading Data</h4>
            <p class="text-white">Please try again later.</p>
            <button class="btn btn-primary" onclick="fetchCarData()">Retry</button>
        </div>
    `;
}

// Search by make and/or model function
function searchByMakeModel() {
    const searchTerm = document.getElementById('carMakeModel').value.toLowerCase().trim();
    
    if (!searchTerm) {
        showToast('Please enter a make or model to search', 'warning');
        return;
    }
    
    showLoading();
    
    // Simulate network delay for demo
    setTimeout(() => {
        const results = carData.filter(car => 
            car.make.toLowerCase().includes(searchTerm) || 
            car.model.toLowerCase().includes(searchTerm)
        );
        
        displayResults(results);
    }, 500);
}

// Display results function
function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-car fa-4x text-light mb-3"></i>
                <h4 class="text-light">No matching vehicles found</h4>
                <p class="text-light">Try a different search term</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = '';
    
    results.forEach(car => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        
        col.innerHTML = `
            <div class="card car-card h-100 bg-dark bg-opacity-75 text-white">
                <div class="card-header bg-dark bg-opacity-50">
                    <h3 class="h5 mb-0">${car.make} ${car.model}</h3>
                    <small class="text-light">${car.year}</small>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="badge bg-primary">${car.engine}</span>
                        <span class="badge bg-success">${car.horsepower} HP</span>
                    </div>
                    
                    <ul class="list-group list-group-flush mb-3 bg-transparent">
                        <li class="list-group-item bg-dark bg-opacity-25 text-white d-flex justify-content-between align-items-center border-secondary">
                            <span>Transmission</span>
                            <span class="fw-bold">${car.transmission}</span>
                        </li>
                        <li class="list-group-item bg-dark bg-opacity-25 text-white d-flex justify-content-between align-items-center border-secondary">
                            <span>Drive Type</span>
                            <span class="fw-bold">${car.driveType}</span>
                        </li>
                        <li class="list-group-item bg-dark bg-opacity-25 text-white d-flex justify-content-between align-items-center border-secondary">
                            <span>Fuel Economy</span>
                            <span class="fw-bold">${car.fuelEconomy.city} city / ${car.fuelEconomy.highway} highway</span>
                        </li>
                    </ul>
                    
                    <h6 class="mt-3 mb-2 text-light">Features:</h6>
                    <div class="d-flex flex-wrap">
                        ${car.features.map(feature => `
                            <span class="badge bg-light text-dark feature-badge me-1 mb-1">${feature}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        resultsContainer.appendChild(col);
    });
}

// Show toast notifications
function showToast(message, type = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = `
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
            <div id="liveToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-${type} text-white">
                    <strong class="me-auto">Notification</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body bg-light">
                    ${message}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toastContainer.remove();
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchCarData();
    
    // Add event listener for Enter key
    document.getElementById('carMakeModel').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchByMakeModel();
    });
});