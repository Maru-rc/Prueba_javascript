import { http } from "@/api/http";
export default function ReservationCard(reservation) {

  const { workspace, date, startHour, endHour, reason, status } = reservation;
  return `
    <article
      class="bg-white p-4 rounded-lg shadow border"
    >
      <h3 class="font-bold text-lg">
        ${workspace}
      </h3>

      <div class="mt-2 text-sm">

        <p>
          Fecha:
          ${date}
        </p>

        <p>
          Horario:
          ${startHour}
          -
          ${endHour}
        </p>

        <p>
          Motivo:
          ${reason}
        </p>

        <p>
          Estado:
          <span class="font-semibold">
            ${status}
          </span>
        </p>
      </div>
    </article>
  `;
}
