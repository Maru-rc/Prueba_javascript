import Sidebar from "@/components/Sidebar";
import { userController } from "@/controllers/user.controller";

export default function userPanelView() {
  setTimeout(() => userController());

  return `
    <div class="flex">
      ${Sidebar()}

      <main class="flex-1 p-6 bg-slate-100 min-h-screen">

        <section class="bg-white rounded-lg shadow p-5 mb-6">
          <h2 class="text-xl font-bold mb-4">Cartelera Disponible</h2>
          <div id="careleraContainer" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <p class="text-slate-500 col-span-3 text-center py-6">Cargando cartelera...</p>
          </div>
        </section>

        <section class="bg-white rounded-lg shadow p-5">
          <h2 class="text-xl font-bold mb-4">Mis Reservas</h2>
          <div id="myReservationsContainer">
            <p class="text-slate-500 text-center py-6">Cargando tus reservas...</p>
          </div>
        </section>

      </main>
    </div>

    <div id="reservationModal"
      class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h3 class="text-lg font-bold mb-1">Reservar Entradas</h3>
        <p id="reservationModalMovie" class="text-slate-500 text-sm mb-4"></p>
        <form id="reservationForm" class="space-y-3">
          <input type="hidden" id="reservationFunctionId" />
          <div>
            <label class="block text-sm font-medium mb-1">Cantidad de entradas</label>
            <input type="number" id="reservationTickets" min="1" required
              class="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-green-400 text-sm" />
            <p id="reservationMaxLabel" class="text-xs text-slate-400 mt-1"></p>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" id="cancelReservationBtn"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
              Cancelar
            </button>
            <button type="submit"
              class="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
              Reservar
            </button>
          </div>
        </form>
      </div>
    </div>

    <div id="editReservationModal"
      class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
        <h3 class="text-lg font-bold mb-4">Editar Reserva</h3>
        <form id="editReservationForm" class="space-y-3">
          <input type="hidden" id="editReservationId" />
          <input type="hidden" id="editReservationFunctionId" />
          <input type="hidden" id="editReservationOldTickets" />
          <div>
            <label class="block text-sm font-medium mb-1">Cantidad de entradas</label>
            <input type="number" id="editReservationTickets" min="1" required
              class="w-full border rounded p-2 outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
            <p id="editReservationMaxLabel" class="text-xs text-slate-400 mt-1"></p>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" id="cancelEditReservationBtn"
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
