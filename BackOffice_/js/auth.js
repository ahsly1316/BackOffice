const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

async function registerUser(event) {
  event.preventDefault();
  const name = document.getElementById('r-name').value.trim();
  const email = document.getElementById('r-email').value.trim();
  const itsonId = document.getElementById('r-itson').value.trim();
  const password = document.getElementById('r-password').value;

  const payload = { name, email, itsonId, password };

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(()=>({message:res.statusText}));
      throw new Error(err.message || 'Error al registrar');
    }

    alert('Registro exitoso. Inicia sesión');
    window.location.href = 'index.html';
  } catch (err) {
    alert('No se pudo registrar: ' + err.message);
  }
}

async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('l-email').value.trim();
  const password = document.getElementById('l-password').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json().catch(()=>({}));

    if (!res.ok) {
      throw new Error(data.message || 'Credenciales incorrectas');
    }

    localStorage.setItem('token', data.token);
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

    window.location.href = 'home.html';
    window.location.href = 'home.html';
  } catch (err) {
    alert('Error al iniciar sesión: ' + err.message);
  }
}
