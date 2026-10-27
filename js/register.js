// ============================================
// CONFIGURACIÓN
// ============================================
const API_BASE_URL = 'http://172.27.30.205:8000';   // ← IP corregida

// ============================================
// REGISTRO DE USUARIO
// ============================================
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('newUsername').value;
    const passwordInput = document.getElementById('newPassword').value;

    // ⚠️ Añade esto si tienes un <select id="newRole"> en el HTML
    // Si no lo tienes, asigna un rol por defecto abajo
    const roleInput = document.getElementById('newRole')
        ? document.getElementById('newRole').value
        : 'dashboard';   // rol por defecto si no hay select

    const successDiv = document.getElementById('successMsg');
    const errorDiv = document.getElementById('errorMsg');

    successDiv.style.display = 'none';
    errorDiv.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput,
                password: passwordInput,
                role: roleInput          // ← ahora sí se envía
            })
        });

        if (response.ok) {
            successDiv.style.display = 'block';
            document.getElementById('registerForm').reset();
        } else {
            const errData = await response.json();
            errorDiv.innerText = errData.detail || 'Error al registrar el usuario';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        errorDiv.innerText = 'No se pudo conectar con la API de Python';
        errorDiv.style.display = 'block';
    }
});


// ============================================
// OBTENER ROLES CON ACCESO (NUEVO)
// ============================================
async function cargarRoles() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/roles`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const roles = await response.json();
        // 'roles' es un array de strings: ["dashboard", "gitlab"]

        // Si tienes un <select id="newRole">, rellénalo:
        const roleSelect = document.getElementById('newRole');
        if (roleSelect) {
            roleSelect.innerHTML = '';   // limpiar opciones previas
            roles.forEach(rol => {
                const option = document.createElement('option');
                option.value = rol;
                option.textContent = rol;
                roleSelect.appendChild(option);
            });
        }

        // Si tienes un contenedor <ul id="listaRoles">, muéstralos:
        const listaRoles = document.getElementById('listaRoles');
        if (listaRoles) {
            listaRoles.innerHTML = '';
            roles.forEach(rol => {
                const li = document.createElement('li');
                li.textContent = rol;
                listaRoles.appendChild(li);
            });
        }

        return roles;

    } catch (error) {
        console.error('Error al cargar los roles:', error);
        const errorDiv = document.getElementById('errorMsg');
        if (errorDiv) {
            errorDiv.innerText = 'No se pudieron cargar los roles';
            errorDiv.style.display = 'block';
        }
        return [];
    }
}

// Cargar los roles automáticamente al abrir la página
document.addEventListener('DOMContentLoaded', cargarRoles);