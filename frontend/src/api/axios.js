import axios from "axios";

const API = axios.create({
  baseURL: "https://hospital-appointment-system-jxwi.onrender.com",
  withCredentials: true,
});
export default API;
