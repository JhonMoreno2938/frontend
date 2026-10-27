// ============================================
// HISTORIAL / AUDITORÍA - PANEL DE ADMIN
// ============================================

// --- VERIFICACIÓN DE SEGURIDAD ---
const accessToken = localStorage.getItem('access_token');
const rolesStr = localStorage.getItem('roles');
let userRoles = [];

try {
    userRoles = rolesStr ? JSON.parse(rolesStr) : [];
} catch (e) {
    userRoles = [];
}

// Si no hay token o no tiene el rol de admin, expulsamos al usuario al index
if (!accessToken || !userRoles.includes('admin')) {
    localStorage.clear();
    window.location.href = 'index.html';
}
// ---------------------------------

let allEvents = [];

// Al cargar la página, consultamos el endpoint GET de FastAPI
document.addEventListener("DOMContentLoaded", async function() {
    const apiUrl = 'http://192.168.0.103:8000/api/auth/events';
    
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` // Añadido por si tu API requiere token de autorización
            }
        });

        if (response.ok) {
            const data = await response.json();
            allEvents = data.events || data; // Se adapta por si la respuesta viene directo en array o en objeto con propiedad events
            renderTable(allEvents);
        } else {
            document.getElementById('eventsTableBody').innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">Error al cargar los eventos del servidor.</td></tr>`;
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        document.getElementById('eventsTableBody').innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">No se pudo conectar con la API.</td></tr>`;
    }
});

// Función para pintar la tabla en el HTML
function renderTable(events) {
    const tbody = document.getElementById('eventsTableBody');
    tbody.innerHTML = '';

    if (!events || events.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No se encontraron registros.</td></tr>`;
        return;
    }

    events.forEach(ev => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${ev.user || ev.username || 'N/A'}</strong></td>
            <td>${ev.started || 'N/A'}</td>
            <td>${ev.last_access || 'N/A'}</td>
            <td>${ev.ip_address || 'N/A'}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para filtrar en tiempo real por usuario, año e intervalo de horas
function filterTable() {
    const userFilter = document.getElementById('filterUser').value.toLowerCase();
    const yearFilter = document.getElementById('filterYear').value.trim();
    const startHour = document.getElementById('filterStartHour').value;
    const endHour = document.getElementById('filterEndHour').value;

    const filtered = allEvents.filter(ev => {
        const startedStr = ev.started || '';
        const [datePart, timePart] = startedStr.split(' ');
        const yearPart = datePart ? datePart.split('-')[0] : '';

        const username = ev.user || ev.username || '';
        const matchesUser = username.toLowerCase().includes(userFilter);
        const matchesYear = yearFilter === "" || yearPart === yearFilter;

        let matchesTime = true;
        if ((startHour || endHour) && timePart) {
            const eventHourMinutes = timePart.substring(0, 5);
            if (startHour && eventHourMinutes < startHour) matchesTime = false;
            if (endHour && eventHourMinutes > endHour) matchesTime = false;
        }

        return matchesUser && matchesYear && matchesTime;
    });

    renderTable(filtered);
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}