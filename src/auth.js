document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const authSubmit = document.getElementById('auth-submit');
    const authToggle = document.getElementById('auth-toggle');
    const nameGroup = document.getElementById('name-group');

    let isLoginMode = true;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'register') {
        isLoginMode = false;
        updateFormMode();
    }

    authToggle.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        updateFormMode();
    });

    function updateFormMode() {
        authTitle.textContent = isLoginMode ? 'Welcome Back' : 'Create Account';
        authSubtitle.textContent = isLoginMode 
            ? 'Sign in to continue learning' 
            : 'Start your learning journey';
        authSubmit.textContent = isLoginMode ? 'Sign In' : 'Sign Up';
        nameGroup.style.display = isLoginMode ? 'none' : 'block';
        document.getElementById('auth-switch').innerHTML = isLoginMode 
            ? 'Don\'t have an account? <a href="#" id="auth-toggle">Sign Up</a>'
            : 'Already have an account? <a href="#" id="auth-toggle">Sign In</a>';
        
        document.getElementById('auth-toggle').addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            updateFormMode();
        });
    }

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name')?.value;

        try {
            const endpoint = isLoginMode 
                ? 'http://localhost:8080/api/v1/auth/authenticate'
                : 'http://localhost:8080/api/v1/auth/register';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(isLoginMode 
                    ? { email, password }
                    : { email, password, name }
                )
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';

        } catch (error) {
            showError(error.message);
        }
    });


    // Error handling
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        authForm.insertBefore(errorDiv, authSubmit);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    const inputs = authForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const errorMessage = input.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
            input.parentElement.classList.remove('error');
        });
    });
}); 