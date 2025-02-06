import axios from 'axios';

const API_URL = 'http://localhost:3000/contracts';

export const setRole = async (token, user, role) => {
  try {
    const response = await axios.post(`${API_URL}/setRole`, { user, role }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const mintTokens = async (token, account, amount) => {
  try {
    const response = await axios.post(`${API_URL}/mint`, { account, amount }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const burnTokens = async (token, amount) => {
  try {
    const response = await axios.post(`${API_URL}/burn`, { amount }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const setDepletionRate = async (token, buyer, rate) => {
  try {
    const response = await axios.post(`${API_URL}/setDepletionRate`, { buyer, rate }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const submitProject = async (token, name) => {
  try {
    const response = await axios.post(`${API_URL}/submitProject`, { name }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const voteForProject = async (token, projectId) => {
  try {
    const response = await axios.post(`${API_URL}/voteForProject`, { projectId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const finalizeProject = async (token, projectId) => {
  try {
    const response = await axios.post(`${API_URL}/finalizeProject`, { projectId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProjectDetails = async (token, projectId) => {
  try {
    const response = await axios.get(`${API_URL}/getProject`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { projectId },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTotalEligibleVotes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getTotalEligibleVotes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getEligibleVoterCount = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getEligibleVoterCount`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const isEligibleVoter = async (token, voter) => {
  try {
    const response = await axios.get(`${API_URL}/isEligibleVoter`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { voter },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const hasAddressVoted = async (token, projectId, voter) => {
  try {
    const response = await axios.get(`${API_URL}/hasAddressVoted`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { projectId, voter },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
