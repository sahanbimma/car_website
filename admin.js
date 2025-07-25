// Load current cars
let carData = [];

// Initialize tooltips
function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Show loading state
function showLoading() {
    const container = document.getElementById('currentCarsList');
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading car data...</p>
        </div>
    `;
}

// Fetch data with loading state
function fetchCarData() {
    showLoading();
    fetch('cars.json')
        .then(response => response.json())
        .then(data => {
            carData = data;
            displayCurrentCars();
        })
        .catch(error => {
            console.error('Error loading car data:', error);
            displayError();
        });
}

// Display error state
function displayError() {
    const container = document.getElementById('currentCarsList');
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
            <h4 class="text-danger">Error Loading Data</h4>
            <p>Please try again later.</p>
            <button class="btn btn-primary" onclick="fetchCarData()">Retry</button>
        </div>
    `;
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
    fetchCarData();
    initTooltips();
    
    // Form validation
    const form = document.getElementById('carForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        
        addNewCar();
    });
});

// Add new car function
function addNewCar() {
    const newCar = {
        make: document.getElementById('make').value.trim(),
        model: document.getElementById('model').value.trim(),
        year: parseInt(document.getElementById('year').value),
        engine: document.getElementById('engine').value.trim(),
        horsepower: parseInt(document.getElementById('horsepower').value),
        transmission: document.getElementById('transmission').value.trim(),
        driveType: document.getElementById('driveType').value,
        fuelEconomy: {
            city: parseInt(document.getElementById('cityMPG').value),
            highway: parseInt(document.getElementById('highwayMPG').value)
        },
        features: document.getElementById('features').value.split(',').map(item => item.trim())
    };
    
    carData.push(newCar);
    saveCarData();
    displayCurrentCars();
    
    // Reset form
    document.getElementById('carForm').reset();
    document.getElementById('carForm').classList.remove('was-validated');
    
    // Show success message
    showToast('Car added successfully!', 'success');
}

// Display current cars
function displayCurrentCars() {
    const container = document.getElementById('currentCarsList');
    
    if (carData.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5 empty-state">
                <i class="fas fa-car fa-4x text-muted mb-3"></i>
                <p class="text-muted">No cars in database</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    carData.forEach((car, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        
        col.innerHTML = `
            <div class="card car-card h-100">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <div>
                        <h3 class="h5 mb-0">${car.make} ${car.model}</h3>
                        <small class="text-muted">${car.year}</small>
                    </div>
                    <span class="badge bg-primary">#${index + 1}</span>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="badge bg-secondary">${car.engine}</span>
                        <span class="badge bg-success">${car.horsepower} HP</span>
                    </div>
                    
                    <ul class="list-group list-group-flush mb-3">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span>Transmission</span>
                            <span class="fw-bold">${car.transmission}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span>Drive Type</span>
                            <span class="fw-bold">${car.driveType}</span>
                        </li>
                    </ul>
                    
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteCar(${index})">
                            <i class="fas fa-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(col);
    });
}

// Delete car function
function deleteCar(index) {
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    
    // Set up modal content
    const car = carData[index];
    document.getElementById('modalCarName').textContent = `${car.make} ${car.model} (${car.year})`;
    
    // Set up confirm button
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.onclick = function() {
        carData.splice(index, 1);
        saveCarData();
        displayCurrentCars();
        modal.hide();
        showToast('Car deleted successfully', 'success');
    };
    
    modal.show();
}

// Save car data (simulated)
function saveCarData() {
    // In a real app, this would send to a server
    console.log('Saving car data:', carData);
    
    // For demo purposes, we'll just update the count
    const countElement = document.querySelector('.card-header .badge');
    if (countElement) {
        countElement.textContent = `${carData.length} cars`;
    }
}

// Show toast notifications
function showToast(message, type = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = `
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
            <div id="liveToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Notification</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body text-${type}">
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

// Add delete confirmation modal to DOM if not exists
if (!document.getElementById('deleteConfirmModal')) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title">Confirm Deletion</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete <strong id="modalCarName"></strong>?</p>
                        <p class="text-danger">This action cannot be undone.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}