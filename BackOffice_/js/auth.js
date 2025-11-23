const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";
async function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById('newName').value.trim();
  const email = document.getElementById('newEmail').value.trim();
  const itsonId = document.getElementById('newItsonId').value.trim();
  const password = document.getElementById('newPass').value;

  if (!name || !email || !itsonId || !password) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, itsonId, password })
    });

    const data = await res.json().catch(()=>({}));

    if (!res.ok) {
      alert(data.message || 'Error al registrar');
      return;
    }

    alert('Registro exitoso. Inicia sesión');
    window.location.href = 'index.html';
  } catch (err) {
    console.error("Register error:", err);
    alert('No se pudo registrar: error de red o servidor.');
  }
}

async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPass').value;

  if (!email || !password) {
    alert("Correo y contraseña son obligatorios.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(()=>({}));

    if (!res.ok) {
      alert(data.message || 'Credenciales incorrectas');
      return;
    }

      const token = data.token || data.accessToken || data?.data?.token || data?.result?.token;
    if (!token) {
      alert("La API no devolvió token.");
      return;
    }

    localStorage.setItem('token', token);

    const user = data.user || data.userPublicData || data.data?.user || data.result?.user;
    if (user) localStorage.setItem('user', JSON.stringify(user));

    window.location.href = 'home.html';
  } catch (err) {
    console.error("Login error:", err);
    alert('Error al iniciar sesión: error de red o servidor.');
  }
}


