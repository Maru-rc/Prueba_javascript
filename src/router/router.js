import loginView from "@/views/loginView";
import homeView from "@/views/homeView";
import adminPanelView from "@/views/adminPanelView";
import userPanelView from "@/views/userPanelView";
import NotFoundView from "@/views/notFound";
import { isAuthenticated, isAdmin } from "@/utils";

const routes = {
  "/": loginView,
  "/home": homeView,
  "/admin": adminPanelView,
  "/user": userPanelView,
};

export const navigateTo = (path) => {
  history.pushState({}, "", path);
  router();
};

export const router = () => {
  const app = document.querySelector("#app");
  let path = window.location.pathname;

  if (path !== "/" && !isAuthenticated()) {
    path = "/";
    history.replaceState({}, "", "/");
  }

  if (path === "/" && isAuthenticated()) {
    path = isAdmin() ? "/admin" : "/user";
    history.replaceState({}, "", path);
  }

  if (path === "/home" && isAuthenticated()) {
    path = isAdmin() ? "/admin" : "/user";
    history.replaceState({}, "", path);
  }

  if (path === "/admin" && isAuthenticated() && !isAdmin()) {
    path = "/user";
    history.replaceState({}, "", "/user");
  }

  if (path === "/user" && isAuthenticated() && isAdmin()) {
    path = "/admin";
    history.replaceState({}, "", "/admin");
  }

  const view = routes[path] || NotFoundView;
  app.innerHTML = view();
};

window.addEventListener("popstate", router);
