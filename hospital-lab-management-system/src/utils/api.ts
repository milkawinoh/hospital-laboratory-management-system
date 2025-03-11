import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Our API base path
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
