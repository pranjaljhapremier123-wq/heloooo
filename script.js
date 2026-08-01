document.addEventListener('DOMContentLoaded', () => {
    // --- 1. File Upload Logic ---
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const uploadPrompt = document.getElementById('uploadPrompt');
    const removeImageBtn = document.getElementById('removeImage');

    // Make "browse files" text clickable
    browseBtn.addEventListener('click', () => fileInput.click());
    
    // Show preview when a file is selected
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                uploadPrompt.style.display = 'none';
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Remove the selected image
    removeImageBtn.addEventListener('click', () => {
        fileInput.value = '';
        imagePreview.src = '';
        previewContainer.style.display = 'none';
        uploadPrompt.style.display = 'block';
    });

    // --- 2. Navigation Logic ---
    const submitBtn = document.getElementById('submit-btn');
    const descriptionInput = document.getElementById('description');
    const categorySelect = document.getElementById('category');
    const locationInput = document.getElementById('location');

    submitBtn.addEventListener('click', () => {
        // Grab what the user typed and format it for a URL
        const desc = encodeURIComponent(descriptionInput.value.trim());
        const cat = encodeURIComponent(categorySelect.value);
        const loc = encodeURIComponent(locationInput.value.trim());
        
        // Go to the new results page!
        window.location.href = `results.html?category=${cat}&location=${loc}&description=${desc}`;
    });
});
