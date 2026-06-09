import {
  getFunctions,
  createFunction,
  updateFunction,
  deleteFunction,
  getFunctionById,
} from "@services/function.service";
import {
  getReservations,
  updateReservation,
  deleteReservation,
} from "@services/reservation.service";
import { http } from "@/api/http";

const STATUS_LABEL = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  active: "Activa",
};

const badgeColor = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  active: "bg-blue-100 text-blue-800",
};

const badge = (status) =>
  `<span class="px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor[status] || "bg-slate-100 text-slate-700"}">${STATUS_LABEL[status] || status}</span>`;

const renderFunctions = (functions) => {
  if (!functions.length)
    return `<p class="text-slate-500 text-center py-6">No hay funciones registradas.</p>`;

  return `
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-left">
          <tr>
            <th class="p-3 font-medium">Película</th>
            <th class="p-3 font-medium">Sala</th>
            <th class="p-3 font-medium">Fecha</th>
            <th class="p-3 font-medium">Horario</th>
            <th class="p-3 font-medium">Cupos</th>
            <th class="p-3 font-medium">Estado</th>
            <th class="p-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          ${functions
            .map(
              (f) => `
            <tr>
              <td class="p-3 font-medium">${f.movie}</td>
              <td class="p-3">${f.room}</td>
              <td class="p-3">${f.date}</td>
              <td class="p-3">${f.startHour} - ${f.endHour}</td>
              <td class="p-3">${f.availableSeats}/${f.totalCapacity}</td>
              <td class="p-3">${badge(f.status)}</td>
              <td class="p-3">
                <div class="flex gap-3">
                  <button data-edit-fn="${f.id}"
                    class="text-blue-600 hover:underline cursor-pointer text-xs">Editar</button>
                  ${
                    f.status === "active"
                      ? `<button data-cancel-fn="${f.id}"
                          class="text-yellow-600 hover:underline cursor-pointer text-xs">Cancelar</button>`
                      : ""
                  }
                  <button data-delete-fn="${f.id}"
                    class="text-red-500 hover:underline cursor-pointer text-xs">Eliminar</button>
                </div>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
};

const renderReservations = async (reservations) => {
  if (!reservations.length)
    return `<p class="text-slate-500 text-center py-6">No hay reservas registradas.</p>`;

  const [users, functions] = await Promise.all([
    http.get("/users"),
    http.get("/functions"),
  ]);

  const userMap = Object.fromEntries(users.map((u) => [u.id, u.name]));
  const fnMap = Object.fromEntries(functions.map((f) => [f.id, f.movie]));

  return `
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-left">
          <tr>
            <th class="p-3 font-medium">Usuario</th>
            <th class="p-3 font-medium">Película</th>
            <th class="p-3 font-medium">Entradas</th>
            <th class="p-3 font-medium">Fecha reserva</th>
            <th class="p-3 font-medium">Estado</th>
            <th class="p-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          ${reservations
            .map(
              (r) => `
            <tr>
              <td class="p-3">${userMap[r.userId] || r.userId}</td>
              <td class="p-3">${fnMap[r.functionId] || r.functionId}</td>
              <td class="p-3">${r.tickets}</td>
              <td class="p-3">${r.reservationDate}</td>
              <td class="p-3">${badge(r.status)}</td>
              <td class="p-3">
                <div class="flex gap-3">
                  ${
                    r.status !== "cancelled"
                      ? `
                    ${
                      r.status === "pending"
                        ? `<button data-confirm-res="${r.id}"
                            class="text-green-600 hover:underline cursor-pointer text-xs">Confirmar</button>`
                        : ""
                    }
                    <button data-cancel-res="${r.id}"
                      data-res-fn="${r.functionId}"
                      data-res-tickets="${r.tickets}"
                      class="text-red-500 hover:underline cursor-pointer text-xs">Cancelar</button>
                  `
                      : ""
                  }
                  <button data-delete-res="${r.id}"
                    data-res-fn="${r.functionId}"
                    data-res-tickets="${r.tickets}"
                    data-res-status="${r.status}"
                    class="text-slate-400 hover:underline cursor-pointer text-xs">Eliminar</button>
                </div>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
};

const loadFunctions = async () => {
  const container = document.querySelector("#functionsContainer");
  const functions = await getFunctions();
  container.innerHTML = renderFunctions(functions);
  bindFunctionActions(functions);
};

const loadReservations = async () => {
  const container = document.querySelector("#allReservationsContainer");
  const reservations = await getReservations();
  container.innerHTML = await renderReservations(reservations);
  bindReservationActions();
};

const openModal = () =>
  document.querySelector("#functionModal").classList.remove("hidden");

const closeModal = () => {
  document.querySelector("#functionModal").classList.add("hidden");
  document.querySelector("#functionForm").reset();
  document.querySelector("#functionId").value = "";
  document.querySelector("#functionModalTitle").textContent = "Nueva Función";
};

const bindFunctionActions = (functions) => {
  document.querySelectorAll("[data-edit-fn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fn = functions.find((f) => String(f.id) === btn.dataset.editFn);
      if (!fn) return;
      document.querySelector("#functionModalTitle").textContent = "Editar Función";
      document.querySelector("#functionId").value = fn.id;
      document.querySelector("#functionMovie").value = fn.movie;
      document.querySelector("#functionRoom").value = fn.room;
      document.querySelector("#functionDate").value = fn.date;
      document.querySelector("#functionStartHour").value = fn.startHour;
      document.querySelector("#functionEndHour").value = fn.endHour;
      document.querySelector("#functionCapacity").value = fn.totalCapacity;
      openModal();
    });
  });

  document.querySelectorAll("[data-cancel-fn]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.cancelFn;
      if (!confirm("¿Cancelar esta función? No aceptará nuevas reservas.")) return;
      await updateFunction(id, { status: "cancelled" });
      await loadFunctions();
    });
  });

  document.querySelectorAll("[data-delete-fn]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.deleteFn;
      if (!confirm("¿Eliminar esta función? Esta acción no se puede deshacer.")) return;
      await deleteFunction(id);
      await loadFunctions();
      await loadReservations();
    });
  });
};

const bindReservationActions = () => {
  document.querySelectorAll("[data-confirm-res]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await updateReservation(btn.dataset.confirmRes, { status: "confirmed" });
      await loadReservations();
    });
  });

  document.querySelectorAll("[data-cancel-res]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.cancelRes;
      const functionId = btn.dataset.resFn;
      const tickets = parseInt(btn.dataset.resTickets);
      if (!confirm("¿Cancelar esta reserva?")) return;
      await updateReservation(id, { status: "cancelled" });
      const fn = await getFunctionById(functionId);
      await updateFunction(functionId, { availableSeats: fn.availableSeats + tickets });
      await loadReservations();
      await loadFunctions();
    });
  });

  document.querySelectorAll("[data-delete-res]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.deleteRes;
      const functionId = btn.dataset.resFn;
      const tickets = parseInt(btn.dataset.resTickets);
      const status = btn.dataset.resStatus;
      if (!confirm("¿Eliminar esta reserva?")) return;
      if (status !== "cancelled") {
        const fn = await getFunctionById(functionId);
        await updateFunction(functionId, { availableSeats: fn.availableSeats + tickets });
      }
      await deleteReservation(id);
      await loadReservations();
      await loadFunctions();
    });
  });
};

export const adminController = async () => {
  document.querySelector("#openCreateFunctionBtn").addEventListener("click", openModal);
  document.querySelector("#cancelFunctionBtn").addEventListener("click", closeModal);

  document.querySelector("#functionForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.querySelector("#functionId").value;
    const movie = document.querySelector("#functionMovie").value.trim();
    const room = document.querySelector("#functionRoom").value.trim();
    const date = document.querySelector("#functionDate").value;
    const startHour = document.querySelector("#functionStartHour").value;
    const endHour = document.querySelector("#functionEndHour").value;
    const totalCapacity = parseInt(document.querySelector("#functionCapacity").value);

    if (id) {
      const fn = await getFunctionById(id);
      const seatsDiff = totalCapacity - fn.totalCapacity;
      await updateFunction(id, {
        movie,
        room,
        date,
        startHour,
        endHour,
        totalCapacity,
        availableSeats: Math.max(0, fn.availableSeats + seatsDiff),
      });
    } else {
      await createFunction({
        movie,
        room,
        date,
        startHour,
        endHour,
        totalCapacity,
        availableSeats: totalCapacity,
        status: "active",
      });
    }

    closeModal();
    await loadFunctions();
  });

  await loadFunctions();
  await loadReservations();
};
