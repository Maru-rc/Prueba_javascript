import { getFunctions, getFunctionById, updateFunction } from "@services/function.service";
import {
  getReservations,
  createReservation,
  updateReservation,
} from "@services/reservation.service";
import { getSession } from "@/utils";

const STATUS_LABEL = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

const badgeColor = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const badge = (status) =>
  `<span class="px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor[status] || "bg-slate-100 text-slate-700"}">${STATUS_LABEL[status] || status}</span>`;

const renderCartelera = (functions) => {
  const active = functions.filter((f) => f.status === "active");
  if (!active.length)
    return `<p class="text-slate-500 col-span-3 text-center py-6">No hay funciones disponibles actualmente.</p>`;

  return active
    .map(
      (f) => `
    <div class="border rounded-lg p-4 bg-slate-50 flex flex-col">
      <h3 class="font-bold text-base">${f.movie}</h3>
      <p class="text-sm text-slate-600 mt-1">${f.room}</p>
      <p class="text-sm text-slate-600">${f.date} | ${f.startHour} - ${f.endHour}</p>
      <p class="text-sm mt-2">
        Cupos disponibles:
        <span class="font-semibold ${f.availableSeats === 0 ? "text-red-500" : "text-green-600"}">
          ${f.availableSeats}
        </span>
      </p>
      <div class="mt-auto pt-3">
        ${
          f.availableSeats > 0
            ? `<button
                data-reserve-fn="${f.id}"
                data-fn-movie="${f.movie}"
                data-fn-seats="${f.availableSeats}"
                class="w-full bg-green-600 text-white py-1.5 rounded hover:bg-green-700 cursor-pointer text-sm transition">
                Reservar
              </button>`
            : `<button disabled
                class="w-full bg-slate-300 text-slate-500 py-1.5 rounded text-sm cursor-not-allowed">
                Sin cupos
              </button>`
        }
      </div>
    </div>
  `
    )
    .join("");
};

const renderMyReservations = (reservations, functionMap) => {
  if (!reservations.length)
    return `<p class="text-slate-500 text-center py-6">No tienes reservas aún.</p>`;

  return `
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-left">
          <tr>
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
              <td class="p-3">${functionMap[r.functionId] || r.functionId}</td>
              <td class="p-3">${r.tickets}</td>
              <td class="p-3">${r.reservationDate}</td>
              <td class="p-3">${badge(r.status)}</td>
              <td class="p-3">
                ${
                  r.status !== "cancelled"
                    ? `<div class="flex gap-3">
                        <button data-edit-res="${r.id}"
                          data-edit-fn-id="${r.functionId}"
                          data-edit-tickets="${r.tickets}"
                          class="text-blue-600 hover:underline cursor-pointer text-xs">Editar</button>
                        <button data-cancel-my-res="${r.id}"
                          data-cancel-fn-id="${r.functionId}"
                          data-cancel-tickets="${r.tickets}"
                          class="text-red-500 hover:underline cursor-pointer text-xs">Cancelar</button>
                      </div>`
                    : `<span class="text-xs text-slate-400">—</span>`
                }
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

const loadCartelera = async () => {
  const container = document.querySelector("#careleraContainer");
  const functions = await getFunctions();
  container.innerHTML = renderCartelera(functions);
  bindCareleraActions();
};

const loadMyReservations = async () => {
  const container = document.querySelector("#myReservationsContainer");
  const user = getSession();
  const [reservations, functions] = await Promise.all([
    getReservations(),
    getFunctions(),
  ]);
  const myReservations = reservations.filter(
    (r) => String(r.userId) === String(user.id)
  );
  const functionMap = Object.fromEntries(functions.map((f) => [String(f.id), f.movie]));
  container.innerHTML = renderMyReservations(myReservations, functionMap);
  bindMyReservationsActions();
};

const openReservationModal = (functionId, movie, availableSeats) => {
  document.querySelector("#reservationFunctionId").value = functionId;
  document.querySelector("#reservationModalMovie").textContent = movie;
  document.querySelector("#reservationTickets").max = availableSeats;
  document.querySelector("#reservationMaxLabel").textContent =
    `Máximo disponible: ${availableSeats}`;
  document.querySelector("#reservationModal").classList.remove("hidden");
};

const closeReservationModal = () => {
  document.querySelector("#reservationModal").classList.add("hidden");
  document.querySelector("#reservationForm").reset();
};

const openEditModal = async (reservationId, functionId, oldTickets) => {
  const fn = await getFunctionById(functionId);
  const maxSeats = fn.availableSeats + oldTickets;
  document.querySelector("#editReservationId").value = reservationId;
  document.querySelector("#editReservationFunctionId").value = functionId;
  document.querySelector("#editReservationOldTickets").value = oldTickets;
  document.querySelector("#editReservationTickets").value = oldTickets;
  document.querySelector("#editReservationTickets").max = maxSeats;
  document.querySelector("#editReservationMaxLabel").textContent =
    `Máximo disponible: ${maxSeats}`;
  document.querySelector("#editReservationModal").classList.remove("hidden");
};

const closeEditModal = () => {
  document.querySelector("#editReservationModal").classList.add("hidden");
  document.querySelector("#editReservationForm").reset();
};

const bindCareleraActions = () => {
  document.querySelectorAll("[data-reserve-fn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openReservationModal(
        btn.dataset.reserveFn,
        btn.dataset.fnMovie,
        parseInt(btn.dataset.fnSeats)
      );
    });
  });
};

const bindMyReservationsActions = () => {
  document.querySelectorAll("[data-edit-res]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openEditModal(
        btn.dataset.editRes,
        btn.dataset.editFnId,
        parseInt(btn.dataset.editTickets)
      );
    });
  });

  document.querySelectorAll("[data-cancel-my-res]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.cancelMyRes;
      const functionId = btn.dataset.cancelFnId;
      const tickets = parseInt(btn.dataset.cancelTickets);
      if (!confirm("¿Cancelar esta reserva?")) return;
      await updateReservation(id, { status: "cancelled" });
      const fn = await getFunctionById(functionId);
      await updateFunction(functionId, { availableSeats: fn.availableSeats + tickets });
      await loadCartelera();
      await loadMyReservations();
    });
  });
};

export const userController = async () => {
  const user = getSession();

  document.querySelector("#cancelReservationBtn").addEventListener("click", closeReservationModal);

  document.querySelector("#reservationForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const functionId = document.querySelector("#reservationFunctionId").value;
    const tickets = parseInt(document.querySelector("#reservationTickets").value);

    const fn = await getFunctionById(functionId);

    if (fn.status === "cancelled") {
      alert("Esta función ha sido cancelada y no admite reservas.");
      closeReservationModal();
      return;
    }
    if (tickets > fn.availableSeats) {
      alert(`Solo quedan ${fn.availableSeats} cupos disponibles.`);
      return;
    }

    await createReservation({
      userId: user.id,
      functionId,
      tickets,
      reservationDate: new Date().toISOString().split("T")[0],
      status: "pending",
    });
    await updateFunction(functionId, { availableSeats: fn.availableSeats - tickets });

    closeReservationModal();
    await loadCartelera();
    await loadMyReservations();
  });

  document.querySelector("#cancelEditReservationBtn").addEventListener("click", closeEditModal);

  document.querySelector("#editReservationForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const reservationId = document.querySelector("#editReservationId").value;
    const functionId = document.querySelector("#editReservationFunctionId").value;
    const oldTickets = parseInt(document.querySelector("#editReservationOldTickets").value);
    const newTickets = parseInt(document.querySelector("#editReservationTickets").value);

    const fn = await getFunctionById(functionId);
    const maxAvailable = fn.availableSeats + oldTickets;

    if (newTickets > maxAvailable) {
      alert(`Solo hay ${maxAvailable} cupos disponibles.`);
      return;
    }

    await updateReservation(reservationId, { tickets: newTickets });
    await updateFunction(functionId, {
      availableSeats: fn.availableSeats + oldTickets - newTickets,
    });

    closeEditModal();
    await loadCartelera();
    await loadMyReservations();
  });

  await loadCartelera();
  await loadMyReservations();
};
