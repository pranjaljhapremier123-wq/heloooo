import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// 1. Initialize Supabase FIRST
const supabaseUrl = 'https://ivvsmjyemskgcwgglqng.supabase.co';
const supabaseKey = 'sb_publishable_PWsANh8ITEsZ0YuGkY3Dzw_2KDwwiPA'; 
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. AUTHENTICATION CHECK (Now it knows what 'supabase' is)
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
    window.location.replace('login.html');
}

document.addEventListener('DOMContentLoaded', async () => {
    const resultsGrid = document.getElementById('resultsGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const location = urlParams.get('location');
    const description = urlParams.get('description');

    try {
        let query = supabase.from('lost_items').select('*');

        if (category && category !== 'All Categories') {
            query = query.eq('category', category);
        }
        if (location) {
            query = query.ilike('location', `%${location}%`);
        }
        if (description) {
            query = query.ilike('description', `%${description}%`);
        }

        const { data, error } = await query;

        loadingSpinner.style.display = 'none';

        if (error) {
            throw error;
        }

        if (data.length === 0) {
            resultsGrid.innerHTML = '<p style="color: #cbd5e1; grid-column: 1 / -1; text-align: center;">No matching garments found in the database. Please try a broader search.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: #111827; 
                border: 1px solid rgba(255, 255, 255, 0.1); 
                border-radius: 12px; 
                padding: 20px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            `;
            
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <h4 style="color: #818cf8; margin: 0; font-size: 1.2rem;">${item.category || 'Garment'}</h4>
                    <span style="background: rgba(99, 102, 241, 0.2); color: #818cf8; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: 1px solid rgba(99, 102, 241, 0.3);">Match</span>
                </div>
                <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 8px;"><strong>📍 Location:</strong> ${item.location || 'N/A'}</p>
                <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 20px;"><strong>📝 Details:</strong> ${item.description || 'No description provided'}</p>
                <button style="width: 100%; padding: 12px; background: rgba(99, 102, 241, 0.1); color: #818cf8; border: 1px solid #6366f1; border-radius: 8px; font-weight: bold; cursor: pointer;" onclick="alert('Claim process started!')">
                    Claim Item
                </button>
            `;
            resultsGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Database Error:', error);
        loadingSpinner.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `
            <strong>⚠️ Database Connection Error</strong><br><br>
            <strong>Reason:</strong> ${error.message}<br><br>
            <em style="color: #94a3b8; font-size: 0.9rem;">
            * If the reason says something about "Row Level Security" or "policy", you need to go to your Supabase Dashboard > Authentication > Policies, and make sure public 'SELECT' access is allowed for your table.<br>
            * If it says the table doesn't exist, ensure your table is named exactly 'lost_items'.
            </em>
        `;
    }
});
