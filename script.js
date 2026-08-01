document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImage');
    const searchBtn = document.getElementById('searchBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsGrid = document.getElementById('resultsGrid');

    // Handle File Dropzone Interactions
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--border-color)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            showPreview(fileInput.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            showPreview(fileInput.files[0]);
        }
    });

    function showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            dropZone.style.display = 'none';
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    removeImageBtn.addEventListener('click', () => {
        fileInput.value = '';
        imagePreview.src = '';
        previewContainer.style.display = 'none';
        dropZone.style.display = 'block';
    });

    // Handle AI Search Execution Simulation
    searchBtn.addEventListener('click', () => {
        const description = document.getElementById('itemDescription').value;
        
        // Show loading state
        loadingSpinner.style.display = 'block';
        resultsGrid.style.opacity = '0.3';

        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            resultsGrid.style.opacity = '1';
            
            // Dynamic mock response rendering
            triggerMockSearchResults(description);
        }, 1500);
    });

    function triggerMockSearchResults(query) {
        // Sample dynamic results injector
        resultsGrid.innerHTML = `
            <div class="result-card">
                <img src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=80" alt="Dynamic Match">
                <div class="card-body">
                    <span class="badge match-high">94% Match</span>
                    <h4>Matched Garment Result</h4>
                    <p><i class="fa-solid fa-location-dot"></i> Central Hub Processing Facility</p>
                    <button class="btn-sm" onclick="alert('Claim request initiated!')">Claim Item</button>
                </div>
            </div>
            <div class="result-card">
                <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80" alt="Dynamic Match">
                <div class="card-body">
                    <span class="badge match-med">81% Match</span>
                    <h4>Similar Fabric Match</h4>
                    <p><i class="fa-solid fa-location-dot"></i> Terminal 2 Lost Property</p>
                    <button class="btn-sm" onclick="alert('Claim request initiated!')">Claim Item</button>
                </div>
            </div>
        `;
    }
});
