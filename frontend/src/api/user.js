import axios from 'axios';

const API_URL = 'http://localhost/contracts';

export const getUserRole = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getUserRole`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const setUserRole = async (token, username, role) => {
  try {
    const response = await axios.post(`${API_URL}/setUserRole`, { username, role }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
