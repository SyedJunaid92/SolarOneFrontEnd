import axios from "axios";
import Config from "../components/config/index";

export const productOfAdd = async (
  email = "",
  name = "",
  cnic = "",
  profile_picture = "",
  contact_no = "",

) => {
  try {
    const url = `${Config.baseUrl}/productof`;

    const result = await axios.post(url, {
      email,
      name,
      cnic,
      profile_picture,
      contact_no

    });
    return result;
  } catch (err) {

    throw err;
  }
};


export const getAllproductOfPaginate = async (
  email = "",
  page_size = "",
  page_number = "",

) => {
  try {
    const url = `${Config.baseUrl}/productof/by-paginate?email=${email}&page_number=${page_number}&page_size=${page_size}`;
    const result = await axios.get(url);
    return result;
  } catch (err) {
    throw err;
  }
};

export const getAllproductOf = async (
  email = "",
) => {
  try {
    const url = `${Config.baseUrl}/productof?email=${email}`;
    const result = await axios.get(url);
    return result;
  } catch (err) {
    throw err;
  }
};


export const productOfUpdate = async (
  email = "",
  name = "",
  cnic = "",
  profile_picture = "",
  contact_no = "",
  _id=""

) => {
  try {
    const url = `${Config.baseUrl}/productof/update`;

    const result = await axios.put(url, {
      email,
      name,
      cnic,
      profile_picture,
      contact_no,
      _id

    });
    return result;
  } catch (err) {

    throw err;
  }
};

export const deleteproductOf = async (
  email="",
  _id="",
 
  
) => {
  try {
    const url = `${Config.baseUrl}/productof/delete?email=${email}&_id=${_id}`;
    const result = await axios.delete(url);
    return result;
  } catch (err) {
    throw err;
  }
};



