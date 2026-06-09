import { removeSession, getSession, isAdmin } from "@/utils";
import { navigateTo } from "@/router/router";

export default function Sidebar() {
  const user = getSession();

  setTimeout(() => {
    document.querySelector("#logoutBtn")?.addEventListener("click", () => {
      removeSession();
      navigateTo("/");
    });
  });

  const panelLink = isAdmin()
    ? `<a href="/admin" class="px-3 py-2 bg-blue-600 text-white rounded-xl text-sm" data-link>Panel Admin</a>`
    : `<a href="/user" class="px-3 py-2 bg-green-600 text-white rounded-xl text-sm" data-link>Mi Panel</a>`;

  return `
    <aside class="w-56 bg-slate-900 text-white min-h-screen p-5 flex flex-col">
      <h2 class="text-xl font-bold mb-2">CineApp</h2>
      <p class="text-xs text-slate-400 mb-8">${user?.name} &middot; ${user?.role}</p>

      <nav class="flex flex-col gap-3 flex-1">
        ${panelLink}
      </nav>

      <button
        id="logoutBtn"
        class="mt-4 text-left cursor-pointer text-red-400 hover:text-white hover:bg-red-500 px-3 py-2 rounded-xl text-sm transition"
      >
        Cerrar sesión
      </button>
    </aside>
  `;
}
