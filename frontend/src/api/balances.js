import axios from 'axios';

const API_URL = 'https://africox.angoyewally.dev/contracts';

export const getEthBalance = async (token, userAddress) => {
  try {
    const response = await axios.get(`${API_URL}/getEthBalance`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { userAddress },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCctBalance = async (token, userAddress) => {
  try {
    const response = await axios.get(`${API_URL}/getCctBalance`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { userAddress },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserBalances = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getUserBalances`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
