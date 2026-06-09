import Sidebar from "@/components/Sidebar";
import { getSession } from "@/utils";
import { homeController } from "@/controllers/home.controller";

export default function homeView() {
  const user = getSession();

  setTimeout(() => {
    homeController();
    if(user.role === "admin"){
      document
      .querySelector("#adminBtn")
      .addEventListener("click",() =>{
        
    }) 
    } else{
      document
      .querySelector("#userBtn")
      .addEventListener("click",() =>{
    })
    }
  });

  return `
    <div class="flex">

      ${Sidebar()}

      <main class="flex-1 p-6 bg-slate-100 min-h-screen">

        <div class="mb-6">

          <h1 class="text-3xl font-bold">
            Bienvenido ${user?.name}
          </h1>

          <p class="text-slate-500">
            Rol: ${user?.role}
          </p>

        </div>

        ${
          user?.role === "admin"
            ? `
              <section
                class="bg-white p-5 rounded-lg shadow mb-6"
              >
                <h2 class="font-bold text-xl mb-2">
                  Panel Administrador
                </h2>

                <p>
                  Puedes visualizar todas las reservas.
                </p>

                <button
                  id = "adminBtn"
                  class="mt-3 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Gestionar Reservas
                </button>

              </section>
            `
            : `
              <section
                class="bg-white p-5 rounded-lg shadow mb-6"
              >
                <h2 class="font-bold text-xl mb-2">
                  Panel Usuario
                </h2>

                <p>
                  Puedes visualizar únicamente tus reservas.
                </p>

                <button
                  id = "userBtn"
                  class="mt-3 bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                  Nueva Reserva
                </button>

              </section>
            `
        }

        <section
          class="bg-white p-5 rounded-lg shadow"
        >

          <div
            class="flex justify-between items-center mb-4"
          >
            <h2 class="font-bold text-xl">
              Reservas
            </h2>

            <span
              class="text-sm text-slate-500"
            >
              ${
                user?.role === "admin"
                  ? "Mostrando todas las reservas"
                  : "Mostrando únicamente tus reservas"
              }
            </span>
          </div>

          <div
            id="reservationsContainer"
            class="grid gap-4 md:grid-cols-2"
          >
            <div class="w-full text-center py-8 col-span-2">
              <p class="text-slate-500">
                Cargando reservas ...
              </p>
            </div>
          </div>

        </section>

      </main>

    </div>
  `;
}