import axios from "axios";
import Config from "../components/config/index";

export const addProduct = async (
    email="",
    name="",
    code="",
    company_name="",
    price="",
    cost="",
    alert="",
    picture="",
    description="",
    watt=""
  ) => {
    try {
      const url = `${Config.baseUrl}/product`;
      const result = await axios.post(url,{
        email,
        name,
        code,
        company_name,
        price,
        cost,
        alert,
        picture,
        description,
        watt

      });
      return result;
    } catch (err) {
      throw err;
    }
  };

  export const editProduct = async (
    _id="",
    email="",
    name="",
    code="",
    company_name="",
    price="",
    cost="",
    alert="",
    picture="",
    description="",
    watt=""
  ) => {
    try {
      const url = `${Config.baseUrl}/product/update`;
      const result = await axios.put(url,{
        email,
        name,
        code,
        company_name,
        price,
        cost,
        alert,
        picture,
        description,
        _id,
        watt
      });
      return result;
    } catch (err) {
      throw err;
    }
  };


  export const getAllProductPaginate = async (
    email="",
    page_size="",
    page_number="",
    
  ) => {
    try {
      const url = `${Config.baseUrl}/product/by-paginate?email=${email}&page_number=${page_number}&page_size=${page_size}`;
      const result = await axios.get(url);
      return result;
    } catch (err) {
      throw err;
    }
  };

  export const deleteProduct = async (
    email="",
    id="",
   
    
  ) => {
    try {
      const url = `${Config.baseUrl}/product/delete?email=${email}&id=${id}`;
      const result = await axios.delete(url);
      return result;
    } catch (err) {
      throw err;
    }
  };
  export const getAllProduct = async (
    email="",
   
  ) => {
    try {
      const url = `${Config.baseUrl}/product?email=${email}`;
      const result = await axios.get(url);
      return result;
    } catch (err) {
      throw err;
    }
  };

