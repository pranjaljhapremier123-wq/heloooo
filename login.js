import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Initialize Supabase
const supabaseUrl = 'https://ivvsmjyemskgcwgglqng.supabase.co';
const supabaseKey = 'sb_publishable_PWsANh8ITEsZ0YuGkY3Dzw_2KDwwiPA'; // Use your actual key
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    // If the user is already logged in, send them straight to the main app!
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.replace('index.html');
        return;
    }

    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const loginBtn = document.getElementById('loginBtn');
    const googleBtn = document.getElementById('googleBtn');
    const authError = document.getElementById('authError');

    const showError = (msg) => {
        authError.style.display = 'block';
        authError.textContent = msg;
    };

    // 1. Email / Password Login
    loginBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if(!email || !password) {
            showError("Please enter both an email and password.");
            return;
        }

        loginBtn.textContent = 'Processing...';
        authError.style.display = 'none';

        // Try to Sign In
        let { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        // If the user doesn't exist yet, automatically Sign them Up instead!
        if (error && error.message.includes('Invalid login credentials')) {
            const signupResponse = await supabase.auth.signUp({ email, password });
            data = signupResponse.data;
            error = signupResponse.error;
            
            if(!error && data.user && !data.session) {
                 showError("Account created! Check your email to verify your account.");
                 loginBtn.textContent = 'Sign In / Create Account';
                 return;
            }
        }

        if (error) {
            showError(error.message);
            loginBtn.textContent = 'Sign In / Create Account';
        } else if (data.session) {
            // Success! Send them to the home page
            window.location.replace('index.html');
        }
    });

    // 2. Google OAuth Login
    googleBtn.addEventListener('click', async () => {
        // Tells Google to send them back to index.html after they approve
        const redirectUrl = window.location.origin + window.location.pathname.replace('login.html', 'index.html');
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: redirectUrl }
        });
        
        if (error) showError(error.message);
    });
});
