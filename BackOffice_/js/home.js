const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}


function openCreateModal() {
    document.getElementById("modal-create").classList.remove("hidden");
}
function closeCreateModal() {
    document.getElementById("modal-create").classList.add("hidden");
}
function openEditModal() {
    document.getElementById("modal-edit").classList.remove("hidden");
}
function closeEditModal() {
    document.getElementById("modal-edit").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("token")) return (window.location.href = "index.html");

    loadProjects();

    document.getElementById("create-form").addEventListener("submit", createProject);
    document.getElementById("edit-form")?.addEventListener("submit", updateProject);
});


async function loadProjects() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/projects`, {
        headers: { "auth-token": token }
    });

    const data = await res.json();
    renderProjects(data);
}


function renderProjects(projects) {
    const tbody = document.getElementById("projects-table-body");
    tbody.innerHTML = "";

    if (!projects.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="card-empty">No hay proyectos aún</td></tr>`;
        return;
    }

    projects.forEach(p => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${p.title}</td>
            <td>${p.description}</td>
            <td>${(p.technologies || []).join(", ")}</td>
            <td><a href="${p.repository}" target="_blank">${p.repository || ""}</a></td>
            <td>${p.images?.[0] ? `<img src="${p.images[0]}" width="60">` : "Sin imagen"}</td>
            <td>
                <button onclick="fillEdit('${p._id}',
                    '${p.title}',
                    \`${p.description}\`,
                    '${(p.technologies || []).join(",")}',
                    '${p.repository}',
                    '${p.images?.[0] || ""}'
                )">Editar</button>

                <button onclick="deleteProject('${p._id}')">Eliminar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}


async function createProject(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const project = {
        title: document.getElementById("p-name").value.trim(),
        description: document.getElementById("p-desc").value.trim(),
        technologies: document.getElementById("p-tech").value.split(",").map(t => t.trim()).filter(t => t),
        repository: document.getElementById("p-repo").value.trim(),
        images: [document.getElementById("p-img").value.trim()].filter(i => i)
    };

    const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        },
        body: JSON.stringify(project)
    });

    const data = await res.json();

    if (!res.ok) {
        alert("Error: " + data.message);
        return;
    }

    closeCreateModal();
    loadProjects();
}


function fillEdit(id, title, desc, tech, repo, img) {
    document.getElementById("edit-id").value = id;
    document.getElementById("edit-name").value = title;
    document.getElementById("edit-desc").value = desc;
    document.getElementById("edit-tech").value = tech;
    document.getElementById("edit-repo").value = repo;
    document.getElementById("edit-img").value = img;

    openEditModal();
}

async function updateProject(e) {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;
    const token = localStorage.getItem("token");

    const project = {
        title: document.getElementById("edit-name").value.trim(),
        description: document.getElementById("edit-desc").value.trim(),
        technologies: document.getElementById("edit-tech").value.split(",").map(t => t.trim()).filter(t => t),
        repository: document.getElementById("edit-repo").value.trim(),
        images: [document.getElementById("edit-img").value.trim()].filter(i => i)
    };

    const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        },
        body: JSON.stringify(project)
    });

    const data = await res.json();

    if (!res.ok) {
        alert("Error al editar: " + data.message);
        return;
    }

    closeEditModal();
    loadProjects();
}


async function deleteProject(id) {
    const token = localStorage.getItem("token");

    if (!confirm("¿Seguro que quieres eliminarlo?")) return;

    const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
        headers: { "auth-token": token }
    });

    if (!res.ok) {
        const data = await res.json();
        alert("Error al eliminar: " + data.message);
        return;
    }

    loadProjects();
}





