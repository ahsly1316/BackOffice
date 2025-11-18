const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";
const token = localStorage.getItem('token');

async function authFetch(url, opts={}) {
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';
  opts.headers['Authorization'] = `Bearer ${token}`;
  return fetch(url, opts);
}

async function loadProjects() {
  try {
    const res = await authFetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('No autorizado o error al obtener proyectos');
    const projects = await res.json();
    renderProjectTable(projects);
  } catch (err) {
    console.error(err);
    document.getElementById('projects-table-body').innerHTML = '<tr><td colspan="3" class="card-empty">No se pudieron cargar los proyectos.</td></tr>';
  }
}

function renderProjectTable(projects){
  const tbody = document.getElementById('projects-table-body');
  if (!projects || projects.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="card-empty">No hay proyectos aún. Crea uno desde la izquierda.</td></tr>';
    return;
  }
  tbody.innerHTML = '';
  projects.forEach(p => {
    const tr = document.createElement('tr');
    const nameTd = document.createElement('td');
    nameTd.textContent = p.name || p.title || '(sin nombre)';
    const descTd = document.createElement('td');
    descTd.textContent = p.description || p.desc || '';
    const actionsTd = document.createElement('td');
    actionsTd.className = 'actions-btn';
    actionsTd.innerHTML = `
      <button class="btn-primary" onclick="showEditForm('${p.id}', ${JSON.stringify(p.name||p.title||'').replace(/'/g, "\'")}, ${JSON.stringify(p.description||p.desc||'').replace(/'/g, "\'")})">Editar</button>
      <button style="background:#ff6b6b;border:none;padding:0.45rem 0.6rem;border-radius:8px;color:white;cursor:pointer" onclick="deleteProject('${p.id}')">Eliminar</button>
    `;
    tr.appendChild(nameTd);
    tr.appendChild(descTd);
    tr.appendChild(actionsTd);
    tbody.appendChild(tr);
  });
}

async function createProject(event) {
  event.preventDefault();
  const name = document.getElementById('p-name').value.trim();
  const description = document.getElementById('p-desc').value.trim();
  if (!name) return alert('El proyecto necesita un nombre');

  try {
    const res = await authFetch(`${API_BASE}/projects`, {
      method: 'POST',
      body: JSON.stringify({ name, description })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({message:res.statusText}));
      throw new Error(err.message || 'Error al crear proyecto');
    }
    document.getElementById('create-form').reset();
    await loadProjects();
  } catch (err) {
    alert('No se pudo crear el proyecto: ' + err.message);
  }
}

async function deleteProject(id){
  if (!confirm('¿Eliminar proyecto?')) return;
  try {
    const res = await authFetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar');
    await loadProjects();
  } catch (err) {
    alert('No se pudo eliminar: ' + err.message);
  }
}

function showEditForm(id, name, description) {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-name').value = name;
  document.getElementById('edit-desc').value = description;
  document.getElementById('edit-panel').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function updateProject(event) {
  event.preventDefault();
  const id = document.getElementById('edit-id').value;
  const name = document.getElementById('edit-name').value.trim();
  const description = document.getElementById('edit-desc').value.trim();
  if (!id) return alert('ID faltante');

  try {
    const res = await authFetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({message:res.statusText}));
      throw new Error(err.message || 'Error al actualizar');
    }
    document.getElementById('edit-panel').style.display = 'none';
    await loadProjects();
  } catch (err) {
    alert('No se pudo actualizar: ' + err.message);
  }
}

document.addEventListener('DOMContentLoaded', function(){
  if (window.location.pathname.includes('home')) {
    loadProjects();
    const createForm = document.getElementById('create-form');
    if (createForm) createForm.addEventListener('submit', createProject);
    const editForm = document.getElementById('edit-form');
    if (editForm) editForm.addEventListener('submit', updateProject);
  }
});
