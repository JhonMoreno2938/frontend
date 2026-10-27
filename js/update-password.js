document.getElementById('updateForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('newPassword').value;
    const successDiv = document.getElementById('successMsg');
    const errorDiv = document.getElementById('errorMsg');

    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';

    try {
        // 👇 IP ACTUALIZADA + ENDPOINT CORRECTO (/update-user) 👇
        const response = await fetch('http://192.168.0.103:8000/api/auth/update-user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput,
                new_password: passwordInput
            })
        });

        if (response.ok) {
            successDiv.style.display = 'block';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            const errData = await response.json();
            errorDiv.innerText = errData.detail || 'Error al actualizar la contraseña';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        errorDiv.innerText = 'No se pudo conectar con la API de Python';
        errorDiv.style.display = 'block';
    }
});