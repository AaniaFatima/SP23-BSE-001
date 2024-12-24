// JavaScript for Login/Signup Modal
const userIcon = document.getElementById('userIcon');
const loginModal = document.getElementById('loginModal');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Show Modal on User Icon Click
userIcon.addEventListener('click', () => {
    loginModal.style.display = 'block'; // Show the modal
});

// Switch to Login Tab
loginTab.addEventListener('click', () => {
    loginForm.style.display = 'block'; // Show login form
    signupForm.style.display = 'none'; // Hide signup form
    loginTab.classList.add('active'); // Highlight Login tab
    signupTab.classList.remove('active'); // Remove highlight from Signup tab
});

// Switch to Signup Tab
signupTab.addEventListener('click', () => {
    loginForm.style.display = 'none'; // Hide login form
    signupForm.style.display = 'block'; // Show signup form
    signupTab.classList.add('active'); // Highlight Signup tab
    loginTab.classList.remove('active'); // Remove highlight from Login tab
});

// Close Modal on Outside Click
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none'; // Hide the modal
    }
});


// JavaScript for Login Validation and Redirection

const loginEmail = document.getElementById('loginEmail');  // Email field
const loginPassword = document.getElementById('loginPassword');  // Password field

// Listen for the form submission
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();  // Prevent the form from submitting normally

    const email = loginEmail.value;
    const password = loginPassword.value;

    // Perform basic validation (this can be extended as needed)
    if (email === '' || password === '') {
        alert('Please enter both email and password.');
        return;
    }

    // Example of client-side validation (you can replace this with actual validation)
    if (email === 'admin@example.com' && password === '1234') {
        // If the credentials are correct, redirect to the admin panel page
        window.location.href = '/admin/dashboard';  // Redirect to the admin panel
    } else {
        alert('Invalid email or password. Please try again.');
    }
});



