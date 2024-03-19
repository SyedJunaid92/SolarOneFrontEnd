import axios from "axios";
import Config from "../components/config/index";

export const signInUser = async (
    email,
    password
  ) => {
    try {
      const url = `${Config.baseUrl}/user?email=${email}&password=${password}`;
      const result = await axios.get(url);
      return result;
    } catch (err) {
      throw err;
    }
  };
  