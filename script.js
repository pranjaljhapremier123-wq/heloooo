import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Initialize Supabase
const supabaseUrl = 'https://ivvsmjyemskgcwgglqng.supabase.co';
const supabaseKey = 'sb_publishable_PWsANh8ITEsZ0YuGkY3Dzw_2KDwwiPA'; 
const supabase = createClient(supabaseUrl, supabaseKey);

// AUTHENTICATION CHECK: Kick unverified users to the login screen
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
    window.location.replace('login.html');
}

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. File Upload Logic ---
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const uploadPrompt = document.getElementById('uploadPrompt');
    const removeImageBtn = document.getElementById('removeImage');

    if(browseBtn) {
        browseBtn.addEventListener('click', () => fileInput.click());
    }
    
    if(fileInput) {
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
    }

    if(removeImageBtn) {
        removeImageBtn.addEventListener('click', () => {
            fileInput.value = '';
            imagePreview.src = '';
            previewContainer.style.display = 'none';
            uploadPrompt.style.display = 'block';
        });
    }

    // --- 2. Navigation Logic ---
    const submitBtn = document.getElementById('submit-btn');
    const descriptionInput = document.getElementById('description');
    const categorySelect = document.getElementById('category');
    const locationInput = document.getElementById('location');

    if(submitBtn) {
        submitBtn.addEventListener('click', () => {
            const desc = encodeURIComponent(descriptionInput.value.trim());
            const cat = encodeURIComponent(categorySelect.value);
            const loc = encodeURIComponent(locationInput.value.trim());
            
            window.location.href = `results.html?category=${cat}&location=${loc}&description=${desc}`;
        });
    }
});
