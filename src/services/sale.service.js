import axios from "axios";
import Config from "../components/config/index";

export const saleAdd = async (
  email = "",
  sale_details = [],
  customer_name = "",
  customer_id = "",
  discount = 0,
  sub_total= 0,
  total=0,
  customer_type="",
  vehicle_number="",
  details="",
  payment_method=""

) => {
  try {
    const url = `${Config.baseUrl}/sale`;

    const result = await axios.post(url, {
      email,
      sale_details,
      customer_name,
      customer_id,
      customer_type,
      discount,
      sub_total,
      total,
      vehicle_number,
      details,
      payment_method

    });
    return result;
  } catch (err) {

    throw err;
  }
};

export const getAllSalePaginate = async (
  email = "",
  page_size = "",
  page_number = "",

) => {
  try {
    const url = `${Config.baseUrl}/sale/by-paginate?email=${email}&page_number=${page_number}&page_size=${page_size}`;
    const result = await axios.get(url);
    return result;
  } catch (err) {
    throw err;
  }
};

