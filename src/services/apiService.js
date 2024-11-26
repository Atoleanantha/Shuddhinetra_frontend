import axios from "axios";


const baseURL = "http://127.0.0.1:8000/api/v1";

export const postDataApi = async (endpoint, data, config = {}) => {
    // console.log("url:",baseURL+endpoint);
    try {
      const response = await axios.post(`${baseURL}${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const getDataApi = async (endpoint, data, config = {}) => {
    try {
      // If you have query parameters (e.g., `data`), they should be passed in the `params` field of the `config`
      const response = await axios.get(`${baseURL}${endpoint}`, {
        ...config,
        params: data, // Pass the `data` as query parameters if needed
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  


  
