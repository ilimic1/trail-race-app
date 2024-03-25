import axios from "axios";
import { getToken } from "../utils/token";

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default function request(method, path = "", payload = {}) {
  const token = getToken(null);
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    // withCredentials: true,
    url: path,
    data: payload,
    json: true,
  };

  return client(options);
}
