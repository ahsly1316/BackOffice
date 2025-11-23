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

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  const userInfo = document.getElementById('user-info');
  const u = localStorage.getItem('user');
  if (userInfo && u) {
    try {
      const user = JSON.parse(u);
      userInfo.textContent = user.name || user.email || '';
    } catch(e) {}
  }
});
