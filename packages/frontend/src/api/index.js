import request from "./request";
import qs from "qs";

export const login = async ({ email, password }) => {
  const response = await request("post", "/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await request("post", "/api/auth/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await request("get", "/api/auth/me");
  return response.data;
};

export const getRaces = async ({ page }) => {
  const response = await request("get", `/api/races?${qs.stringify({ page })}`);
  return response.data;
};

export const getRace = async ({ id }) => {
  const response = await request("get", `/api/races/${id}`);
  return response.data;
};

export const createRace = async (data) => {
  const response = await request("post", `/api/races`, data);
  return response.data;
};

export const updateRace = async ({ id, ...data }) => {
  const response = await request("put", `/api/races/${id}`, data);
  return response.data;
};

export const deleteRace = async ({ id }) => {
  const response = await request("delete", `/api/races/${id}`);
  return response.data;
};

export const restoreRace = async ({ id }) => {
  const response = await request("put", `/api/races/${id}/restore`);
  return response.data;
};

export const deletePermanentlyRace = async ({ id }) => {
  const response = await request("delete", `/api/races/${id}/force-delete`);
  return response.data;
};

export const listApplications = async (data) => {
  const response = await request(
    "get",
    `/api/applications?${qs.stringify(data)}`,
  );
  return response.data;
};

export const createApplication = async (data) => {
  const response = await request("post", `/api/applications`, data);
  return response.data;
};

export const deleteApplication = async ({ id }) => {
  const response = await request("delete", `/api/applications/${id}`);
  return response.data;
};
