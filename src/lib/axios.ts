import axios from "axios";
import { baseHost } from "../utils/baseHost";

export const client = axios.create({
  baseURL: `https://${baseHost}`,
});
