// Import the Supabase client directly from the CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 1. Initialize Supabase with your project URL and Publishable Key
const supabaseUrl = 'https://ivvsmjyemskgcwgglqng.supabase.co';
const supabaseKey = 'sb_publishable_PWsANh8ITEsZ0YuGkY3Dzw_2KDwwiPA'; // <-- Paste your actual publishable key here inside the quotes
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    // Get form inputs
    const submitBtn = document.getElementById('submit-btn');
    const descriptionInput = document.getElementById('description');
    const categorySelect = document.getElementById('category');
    const locationInput = document.getElementById('location');
    
    // Get result containers
    const resultsContainer = document.getElementById('results-container');
    const resultsGrid = document.getElementById('resultsGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');

    submitBtn.addEventListener('click', async () => {
        // Read user inputs
        const description = descriptionInput.value.trim();
        const category = categorySelect.value;
        const location = locationInput.value.trim();

        // Reveal the results UI and start the loader
        resultsContainer.style.display = 'block';
        resultsGrid.innerHTML = '';
        loadingSpinner.style.display = 'block';

        try {
            // 2. Build the Supabase Query (Assumes your table is named 'lost_items')
            let query = supabase.from('lost_items').select('*');

            // Apply search filters if the user typed something in
            if (category !== 'All Categories') {
                query = query.eq('category', category);
            }
            if (location) {
                // ilike makes the search case-insensitive and allows partial matches
                query = query.ilike('location', `%${location}%`);
            }
            if (description) {
                query = query.ilike('description', `%${description}%`);
            }

            // Execute the query
            const { data, error } = await query;

            if (error) throw error;

            // 3. Render the Results onto the screen
            loadingSpinner.style.display = 'none';

            if (data.length === 0) {
                resultsGrid.innerHTML = '<p style="color: #cbd5e1; grid-column: 1 / -1; text-align: center;">No matching garments found in the database. Please try broadening your search.</p>';
                return;
            }

            // Loop through the data and create a card for each matched item
            data.forEach(item => {
                const card = document.createElement('div');
                card.style.cssText = `
                    background: #111827; 
                    border: 1px solid rgba(255, 255, 255, 0.1); 
                    border-radius: 12px; 
                    padding: 20px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    transition: transform 0.2s;
                `;
                
                // Add hover effect to the card
                card.onmouseover = () => card.style.transform = 'translateY(-5px)';
                card.onmouseout = () => card.style.transform = 'translateY(0)';

                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <h4 style="color: #818cf8; margin: 0; font-size: 1.2rem;">${item.category || 'Garment'}</h4>
                        <span style="background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid rgba(99, 102, 241, 0.3);">Match</span>
                    </div>
                    <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 8px;"><strong>📍 Location:</strong> ${item.location || 'N/A'}</p>
                    <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 20px;"><strong>📝 Details:</strong> ${item.description || 'No description provided'}</p>
                    <button style="width: 100%; padding: 12px; background: rgba(99, 102, 241, 0.1); color: #818cf8; border: 1px solid #6366f1; border-radius: 8px; font-weight: bold; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#6366f1'; this.style.color='#fff'" onmouseout="this.style.background='rgba(99, 102, 241, 0.1)'; this.style.color='#818cf8'">
                        Claim Item
                    </button>
                `;
                resultsGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Error fetching data from Supabase:', error);
            loadingSpinner.style.display = 'none';
            resultsGrid.innerHTML = `<p style="color: #ef4444; grid-column: 1 / -1; text-align: center;">An error occurred while connecting to the database. Make sure your publishable key is correct.</p>`;
        }
    });
});
