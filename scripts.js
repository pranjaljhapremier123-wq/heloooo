// Supabase Client Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Initial Fallback Data matching Figma
const initialOrphans = [
  { id: '1', title: 'Nike Cotton Ankle — Single', time: 'Dropped 2 hours ago', condition: 'Gently Used', hub: 'Koramangala Hub', size: 'Size UK 8–10', status: 'Orphan', color: '#14B8A6' },
  { id: '2', title: 'Wool Blend Crew — Charcoal', time: 'Dropped yesterday', condition: 'Like New', hub: 'Indiranagar Hub', size: 'Size UK 6–8', status: 'Match Found', color: '#C084FC' },
  { id: '3', title: 'Striped Kids Sock — Size 4', time: 'Dropped 4 hours ago', condition: 'Gently Used', hub: 'HSR Layout Hub', size: 'Kids Size 4', status: 'Orphan', color: '#F43F5E' },
  { id: '4', title: 'Bamboo Fiber Ankle — Grey', time: 'Dropped 6 hours ago', condition: 'Well Loved', hub: 'Koramangala Hub', size: 'Size UK 9–11', status: 'Orphan', color: '#14B8A6' },
  { id: '5', title: 'Adidas Terry Crew — White', time: 'Dropped 1 day ago', condition: 'Gently Used', hub: 'Jayanagar Hub', size: 'Size UK 7–9', status: 'Match Found', color: '#C084FC' },
  { id: '6', title: 'Patterned Dress Sock — Navy', time: 'Dropped 1 day ago', condition: 'Like New', hub: 'Indiranagar Hub', size: 'Size UK 8–10', status: 'Orphan', color: '#F43F5E' }
];

document.addEventListener('DOMContentLoaded', () => {
  fetchOrphans();
  setupFilterChips();
  setupActionListeners();
});

// Fetch items from Supabase or fallback
async function fetchOrphans(searchTerm = '') {
  const feedContainer = document.getElementById('feed-grid');
  if (!feedContainer) return;

  let items = initialOrphans;

  if (supabaseClient) {
    try {
      let query = supabaseClient.from('orphans').select('*').order('created_at', { ascending: false });
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        items = data.map(item => ({
          id: item.id,
          title: item.title,
          time: formatTimeAgo(item.created_at),
          condition: item.condition,
          hub: item.hub_name,
          size: item.size,
          status: item.status,
          color: item.svg_color || '#14B8A6'
        }));
      }
    } catch (e) {
      console.warn('Using local fallback data.');
    }
  }

  renderFeed(items);
}

// Render feed grid
function renderFeed(items) {
  const feedContainer = document.getElementById('feed-grid');
  feedContainer.innerHTML = '';

  items.forEach(item => {
    const isMatched = item.status === 'Match Found';
    const tagClass = isMatched ? 'status-tag matched' : 'status-tag';
    const btnLabel = isMatched ? 'Claim Match' : 'Add to Batch';

    const cardHTML = `
      <div class="glass item-card" data-id="${item.id}">
        <div class="thumb">
          <span class="${tagClass}">${item.status}</span>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 2h6v7.5c0 1 .3 1.7 1 2.6l4.5 6c1.4 1.9.1 4.9-2.3 4.9H8c-1.7 0-3-1.3-3-3V6c0-2.2 0-4 2-4z" fill="${item.color}" opacity="0.9"/>
          </svg>
        </div>
        <div class="item-body">
          <div>
            <div class="item-title">${item.title}</div>
            <div class="item-meta">${item.time}</div>
          </div>
          <div class="tag-row">
            <span class="pill used">${item.condition}</span>
            <span class="pill hub">${item.hub}</span>
          </div>
          <div class="item-footer">
            <span class="price">${item.size}</span>
            <button class="btn btn-primary btn-sm action-btn">${btnLabel}</button>
          </div>
        </div>
      </div>
    `;
    feedContainer.insertAdjacentHTML('beforeend', cardHTML);
  });
}

// Search and filter handling
function setupFilterChips() {
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const text = chip.getAttribute('data-filter') || '';
      const query = text.includes(':') ? text.split(':')[1].trim() : text;
      fetchOrphans(query);
    });
  });

  const searchBtn = document.getElementById('btn-search');
  const searchInput = document.getElementById('search-input');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      fetchOrphans(searchInput.value.trim());
    });
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') fetchOrphans(searchInput.value.trim());
    });
  }
}

// Log sock action
function setupActionListeners() {
  const logBtn = document.getElementById('btn-log-sock');
  if (logBtn) {
    logBtn.addEventListener('click', async () => {
      const sockTitle = prompt('Enter Orphan Sock Title:', 'Puma Ribbed Crew — Red');
      if (!sockTitle) return;

      if (supabaseClient) {
        const { error } = await supabaseClient.from('orphans').insert([
          { title: sockTitle, condition: 'Gently Used', hub_name: 'Koramangala Hub', size: 'Size UK 8–10', status: 'Orphan', svg_color: '#F43F5E' }
        ]);
        if (!error) {
          fetchOrphans();
          alert('Orphan sock logged successfully!');
          return;
        }
      }
      alert(`Logged "${sockTitle}" locally.`);
    });
  }
}

// Utility: Time format helper
function formatTimeAgo(dateString) {
  if (!dateString) return 'Dropped recently';
  const date = new Date(dateString);
  const diffInHours = Math.floor((new Date() - date) / (1000 * 60 * 60));
  if (diffInHours < 1) return 'Dropped just now';
  if (diffInHours === 1) return 'Dropped 1 hour ago';
  if (diffInHours < 24) return `Dropped ${diffInHours} hours ago`;
  return `Dropped ${Math.floor(diffInHours / 24)} day ago`;
}
document.addEventListener('DOMContentLoaded', () => {
  // Ensure we grab the exact elements using the IDs we set in the HTML
  const logSockBtn = document.getElementById('log-sock-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const modal = document.getElementById('log-sock-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const newSockForm = document.getElementById('new-sock-form');

  // 1. Check if user is logged in using localStorage
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

  // 2. Update UI based on authentication status
  if (isLoggedIn && logoutBtn) {
    logoutBtn.style.display = 'inline-block'; // Show logout button in nav
  }

  // 3. Handle the "Log Orphan Sock" button click
  if (logSockBtn) {
    logSockBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      
      if (localStorage.getItem('userLoggedIn') === 'true') {
        // User is logged in: Show the modal pop-up
        if (modal) modal.classList.add('active');
      } else {
        // User is NOT logged in: Redirect to login.html
        window.location.href = 'login.html';
      }
    });
  }

  // 4. Handle Modal Closing
  if (closeModalBtn && modal) {
    // Close when clicking the 'X'
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    // Close when clicking the dark background outside the modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // 5. Handle Logout Click
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('userLoggedIn'); // Clear the session
      window.location.reload(); // Refresh the page to reflect logged-out state
    });
  }

  // 6. Handle the Modal Form Submission
  if (newSockForm) {
    newSockForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get the input values
      const inputs = newSockForm.querySelectorAll('input');
      const sockType = inputs[0].value;
      const sockColor = inputs[1].value;

      // Show success alert
      alert(`Success! Logged a ${sockColor} ${sockType} sock to the batch.`);
      
      // Close modal and reset form
      modal.classList.remove('active'); 
      newSockForm.reset(); 
    });
  }
});
