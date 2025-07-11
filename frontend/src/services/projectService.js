import axios from "axios";

const API = "http://localhost:5000/api/projects";

export const getAllProjects = async (token) => {
  return await axios.get("http://localhost:5000/api/projects", {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const createProject = async (data, token) => {
  return await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
