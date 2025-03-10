import axios from 'axios';

const API_URL = 'https://africox.angoyewally.dev/contracts';

export const setRole = async (token, username, role) => {
  try {
    const response = await axios.post(`${API_URL}/setRole`, { username, role }, {
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

export const submitProject = async (token, name, description, location, cctAmount) => {
  try {
    const response = await axios.post(`${API_URL}/submitProject`, { name, description, location, cctAmount }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const submitProjectToBlockchain = async (token, projectId) => {
  try {
    const response = await axios.post(`${API_URL}/submitProjectToBlockchain`, { projectId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const voteForProject = async (token, projectId, voterAddress) => {
  try {
    const response = await axios.post(`${API_URL}/voteForProject`, { projectId, voterAddress }, {
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

export const getAllProjects = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getAllProjects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProjectsByOwner = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getProjectsByOwner`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getVerifiedProjects = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getVerifiedProjects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUnverifiedProjects = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getUnverifiedProjects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifyProject = async (token, projectId) => {
  try {
    const response = await axios.post(`${API_URL}/verifyProject`, { projectId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProjectCctAmount = async (token, projectId, cctAmount) => {
  try {
    const response = await axios.post(`${API_URL}/updateProjectCctAmount`, { projectId, cctAmount }, {
      headers: { Authorization: `Bearer ${token}` },
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

export const getUserAddress = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/getUserAddress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
