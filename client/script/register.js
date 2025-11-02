document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const mobile = document.getElementById('mobile').value.trim();

        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        let formIsValid = true;

        const validateFullName = (name) => name.length >= 2;
        const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
        const validateMobile = (mobile) => /^\d{10}$/.test(mobile);

        if (!validateFullName(fullName)) {
            document.getElementById('fullName-error').textContent = 'Please enter a valid full name (at least 2 characters).';
            formIsValid = false;
        }

        if (!validateEmail(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address.';
            formIsValid = false;
        }

        if (!validatePassword(password)) {
            document.getElementById('password-error').textContent =
                'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.';
            formIsValid = false;
        }

        if (!validateMobile(mobile)) {
            document.getElementById('mobile-error').textContent = 'Please enter a valid 10-digit mobile number.';
            formIsValid = false;
        }

        if (formIsValid) {
            try {
                const response = await fetch('http://localhost:3000/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: fullName,
                        email: email,
                        phone: mobile,
                        password: password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration successful!');
                    window.location.href = 'login.html';
                } else {
                    alert(`${data.message || 'Registration failed'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Unable to connect to server. Please try again later.');
            }
        }
    });
});