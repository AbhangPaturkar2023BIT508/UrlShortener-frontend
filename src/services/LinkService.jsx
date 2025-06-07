import axios from "axios";

// const baseUrl = "http://localhost:8080/link";

const baseUrl = "https://shortlink-backend-sej7.onrender.com/link";

export const checkCodeExists = async (code) => {
  return axios
    .get(`${baseUrl}/checkCodeExists/${code}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const createLink = async (link) => {
  return axios
    .post(`${baseUrl}/create`, link)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const getLinks = async (userId) => {
  return axios
    .get(`${baseUrl}/getAll`, {
      params: { userId }, // 👈 This puts userId in the query string
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const deleteLink = async (linkId) => {
  return axios
    .delete(`${baseUrl}/delete/${linkId}`) // Pass id in URL path
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const fetchRedirectInfo = async (code) => {
  return axios
    .get(`https://shortlink-backend-sej7.onrender.com/r/${code}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
