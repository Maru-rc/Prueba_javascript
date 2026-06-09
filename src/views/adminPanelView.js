import Sidebar from "@/components/Sidebar";
import { adminController } from "@/controllers/admin.controller";

export default function adminPanelView() {
  setTimeout(() => adminController());

  return `
    <div class="flex">
      ${Sidebar()}

      <main class="flex-1 p-6 bg-slate-100 min-h-screen">

        <section class="bg-white rounded-lg shadow p-5 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">Funciones de Cine</h2>
            <button id="openCreateFunctionBtn"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer text-sm">
              + Nueva Función
            </button>
          </div>
          <div id="functionsContainer">
            <p class="text-slate-500 text-center py-6">Cargando funciones...</p>
          </div>
        </section>

        <section class="bg-white rounded-lg shadow p-5">
          <h2 class="text-xl font-bold mb-4">Todas las Reservas</h2>
          <div id="allReservationsContainer">
            <p class="text-slate-500 text-center py-6">Cargando reservas...</p>
          </div>
        </section>

      </main>
    </div>

    <div id="functionModal"
      class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 id="functionModalTitle" class="text-lg font-bold mb-4">Nueva Función</h3>
        <form id="functionForm" class="space-y-3">
          <input type="hidden" id="functionId" />

          <div>
            <label class="block text-sm font-medium mb-1">Película</label>
            <input type="text" id="functionMovie" required
              class="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Sala</label>
            <input type="text" id="functionRoom" required
              class="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1">Fecha</label>
              <input type="date" id="functionDate" required
                class="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Capacidad total</label>
              <input type="number" id="functionCapacity" min="1" required
                class="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-1">Hora inicio</label>
              <input type="time" id="functionStartHour" required
                class="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Hora fin</label>
              <input type="time" id="functionEndHour" required
                class="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" id="cancelFunctionBtn"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
              Cancelar
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
