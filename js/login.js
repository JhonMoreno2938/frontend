// ============================================
// LOGIN - SERVICIO A (DASHBOARD / ADMIN)
// ============================================

const API_BASE_URL ='http://192.168.0.103:8000'

// ============================================
// VERIFICAR SI VIENE DE UN LOGOUT DE OTRO SERVICIO
// ============================================
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('logout') === 'true') {
    console.log('🔒 Logout solicitado desde otro servicio. Limpiando sesión...');
    localStorage.clear();
    sessionStorage.clear();
    
    // Limpiamos el parámetro de la URL para que quede limpia
    window.history.replaceState({}, document.title, window.location.pathname);
}

// ============================================
// MANEJO DEL FORMULARIO DE LOGIN
// ============================================
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMsg');
    
    errorDiv.style.display = 'none';

    // Construcción dinámica del endpoint de inicio de sesión
    const apiUrl = `${API_BASE_URL}/api/auth/login`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            const roles = data.roles || [];

            // ============================================
            // VALIDACIÓN Y REDIRECCIÓN SEGÚN EL ROL
            // ============================================
            if (roles.includes('admin')) {
                // Almacenamos los tokens y roles
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('username', usernameInput);
                localStorage.setItem('roles', JSON.stringify(roles));

                console.log('✅ Login exitoso (Admin):', usernameInput);
                console.log('➡️ Redirigiendo al Historial (admin)...');
                window.location.href = 'historial.html';

            } else if (roles.includes('comunidad')) {
                // Almacenamos los tokens y roles
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('username', usernameInput);
                localStorage.setItem('roles', JSON.stringify(roles));

                console.log('✅ Login exitoso (Usuario):', usernameInput);
                console.log('➡️ Redirigiendo al Dashboard...');
                window.location.href = 'dashboard.html';

            } else {
                // Si el usuario se autenticó pero no tiene ninguno de los roles permitidos
                console.warn('⚠️ Usuario sin rol autorizado');
                errorDiv.innerText = 'No tienes autorización para acceder a este sistema.';
                errorDiv.style.display = 'block';
            }

        } else {
            const errorData = await response.json();
            errorDiv.innerText = errorData.detail || 'Usuario o contraseña incorrectos';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error de conexión con la API:', error);
        errorDiv.innerText = 'Error al conectar con el servidor';
        errorDiv.style.display = 'block';
    }
});