import { http } from "@/api/http";

export const getFunctions = () => http.get("/functions");
export const getFunctionById = (id) => http.get(`/functions/${id}`);
export const createFunction = (data) => http.post("/functions", data);
export const updateFunction = (id, data) => http.patch(`/functions/${id}`, data);
export const deleteFunction = (id) => http.delete(`/functions/${id}`);
