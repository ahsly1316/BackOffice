function ensureLoggedIn() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

if (typeof window !== 'undefined' && window.location.pathname.includes('home')) {
  ensureLoggedIn();
}
