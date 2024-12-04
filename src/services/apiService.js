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


export const getApi = async (endpoint, config = {}) => {
  try {
    // If you have query parameters (e.g., `data`), they should be passed in the `params` field of the `config`
    const response = await axios.get(`${baseURL}${endpoint}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCleaningStaff = async (data) => {
  const token = localStorage.getItem('authToken')
  const config = {
    headers: {
      Authorization: `Token ${token}`, // Ensure token is valid
    },
  };


  try {
    const res = await axios.post("http://127.0.0.1:8000/api/v1/waste-management/cleaning-staff/",data, config);
    console.log("added succesfully Cleaning Staff:", res.data);
    return res
  } catch (error) {
    console.error("Error adding cleaning staff:", error.response || error.message);
    return error
  }
};

export const fetchCleaningStaff = async () => {
  const token = localStorage.getItem('authToken')
  const config = {
    headers: {
      Authorization: `Token ${token}`, // Ensure token is valid
    },
  };


  try {
    const res = await axios.get("http://127.0.0.1:8000/api/v1/waste-management/cleaning-staff/", config);
    console.log("Cleaning Staff:", res.data);
   
    return res
  } catch (error) {
    console.error("Error fetching cleaning staff:", error.response || error.message);
    return error
  }
};


export const deleteCleaningStaff = async (id) => {
  const token = localStorage.getItem('authToken')
  const config = {
    headers: {
      Authorization: `Token ${token}`, // Ensure token is valid
    },
  };

  try {
    const res = await axios.delete(`http://127.0.0.1:8000/api/v1/waste-management/cleaning-staff/${id}/`, config);
    console.log("deleted Staff:", res.data);
    // setPostOffice(res.data); // Update the state with fetched data
    return res
  } catch (error) {
    console.error("Error deleting cleaning staff:", error.response || error.message);
    return error
  }
};



export const addEventReport = async (data) => {

  const token = localStorage.getItem("authToken");
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Token ${token}`, // Pass the token for authentication
    },
  };

  try {
    const response = await axios.post(`http://127.0.0.1:8000/api/v1/waste-management/event-report/`, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};



export const addEvent = async (data) => {
  const token = localStorage.getItem("authToken");
  // const formData = new FormData();

  // // Append all fields from data to FormData
  

  for (const [key, value] of data.entries()) {
    console.log(`${key}: ${value}`);
  }

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Token ${token}`,
    },
  };

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/waste-management/events/",
      data,
      config
    );
    return response;
  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }
};


export const getEventReport = async (id) => {

  const token = localStorage.getItem("authToken");
  const config = {
    headers: {
      Authorization: `Token ${token}`, // Pass the token for authentication
    },
  };

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/waste-management/event-report/get-reports/?event_id=${id}`, config);
    return response;
  } catch (error) {
    throw error;
  }
};


export const getWaste = async (endpoint) => {
  const token = localStorage.getItem("authToken");
  const config = {
    headers: {
      Authorization: `Token ${token}`, // Pass the token for authentication
    },
  };

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/waste-management/${endpoint}`, config);
    return response;
  } catch (error) {
    throw error;
  }

}


export const addWasteData = async (endpoint, data) => {

  const token = localStorage.getItem("authToken");
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Token ${token}`, // Pass the token for authentication
    },
  };

  try {
    const response = await axios.post(`http://127.0.0.1:8000/api/v1/waste-management/${endpoint}`, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};