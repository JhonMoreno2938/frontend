// ============================================
// DASHBOARD - SERVICIO A
// ============================================

// ============================================
// CONFIGURACIÓN CENTRAL DE SERVICIOS
// ============================================
const SERVICIOS = {
    // ✅ Quitamos el '/index.html' para evitar barras diagonales duplicadas al concatenar
    servicio_informativo: 'http://192.168.0.103:8082',
    servicio_rastro_rural: 'http://192.168.0.103:8083',
    servicio_encargo: 'http://192.168.0.103:8084',
    servicio_si_hay_chamba: 'http://192.168.0.103:8085',
    servicio_security: 'http://192.168.0.103:8086',
    servicio_incidencias: 'http://192.168.0.103:8087',
    servicio_noticias: 'http://192.168.0.103:8088',
    servicio_pizarra_movilidad: 'http://192.168.0.103:8089',
    servicio_despensa_digital: 'http://192.168.0.103:8090',
};

// ============================================
// VERIFICAR SESIÓN DEL USUARIO
// ============================================
// ✅ Usamos las claves que guarda tu login.js: 'username' y 'access_token'
const loggedUser = localStorage.getItem('username');
const userToken = localStorage.getItem('access_token');

if (!loggedUser || !userToken) {
    console.warn('⚠️ No hay sesión activa. Redirigiendo al login...');
    localStorage.clear();
    window.location.href = 'index.html';
} else {
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        userDisplay.innerText = loggedUser;
    }
    console.log('✅ Usuario logueado:', loggedUser);
}

// ============================================
// FUNCIÓN DE REDIRECCIÓN A SERVICIOS
// ============================================
function irAServicio(nombreServicio) {
    // ✅ Leemos las claves correctas
    const usuario = localStorage.getItem('username');
    const token = localStorage.getItem('access_token');

    // Verificamos que haya sesión activa
    if (!usuario || !token) {
        console.error('❌ No hay sesión activa. Redirigiendo al login...');
        localStorage.clear();
        window.location.href = 'index.html';
        return;
    }

    const urlBase = SERVICIOS[nombreServicio];

    if (!urlBase) {
        console.error(`❌ El servicio "${nombreServicio}" no está configurado`);
        alert(`El servicio "${nombreServicio}" no está disponible.`);
        return;
    }

    // 🔑 Construimos la URL correctamente limpia (urlBase + /?usuario=...&token=...)
    const urlFinal = `${urlBase}/?usuario=${encodeURIComponent(usuario)}&token=${encodeURIComponent(token)}`;
    console.log(`🔗 Redirigiendo a ${nombreServicio}: ${urlFinal}`);

    window.location.href = urlFinal;
}

// ============================================
// FUNCIÓN DE LOGOUT
// ============================================
function logout() {
    console.log('👋 Cerrando sesión...');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'index.html';
}