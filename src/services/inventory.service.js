import axios from "axios";
import Config from "../components/config/index";

export const addInventory = async (
    email="",
    product_name="",
    product_code="",
    product_picture="",
    product_of_name="",
    product_of_id="",
    quantity=0
   
  ) => {
    try {
      const url = `${Config.baseUrl}/inventory`;
      const result = await axios.post(url,{
        email,
        product_name,
        product_code,
        product_picture,
        product_of_id,
        product_of_name,
        quantity

      });
      return result;
    } catch (err) {
      throw err;
    }
  };


  export const getAllInventoryPaginate = async (
    email = "",
    page_size = "",
    page_number = "",
  
  ) => {
    try {
      const url = `${Config.baseUrl}/inventory/by-paginate?email=${email}&page_number=${page_number}&page_size=${page_size}`;
      const result = await axios.get(url);
      return result;
    } catch (err) {
      throw err;
    }
  };
  
  export const getAllInventory = async (
    email = "",
  ) => {
    try {
      const url = `${Config.baseUrl}/inventory?email=${email}`;
      const result = await axios.get(url);
      return result;
    } catch (err) {
      throw err;
    }
  };

  export const updateInventoryQuantity = async (
    email = "",
    _id="",
    quantity=0
  ) => {
    try {
      const url = `${Config.baseUrl}/inventory/update-quantity`;
      const result = await axios.put(url,{
        email,
        _id,
        quantity
      });
      return result;
    } catch (err) {
      throw err;
    }
  };