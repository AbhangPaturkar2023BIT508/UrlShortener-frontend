import axios from "axios";

const baseUrl = "http://localhost:8080/users";

export const registerUser = async (user) => {
  return axios
    .post(`${baseUrl}/register`, user)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const loginUser = async (login) => {
  return axios
    .post(`${baseUrl}/login`, login)
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
