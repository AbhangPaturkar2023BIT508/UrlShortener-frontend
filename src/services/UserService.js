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

export const sendOtp = async (email) => {
  return axios
    .post(`${baseUrl}/sendOtp/${email}`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

export const verifyOtp = async (email, otp) => {
  return axios
    .get(`${baseUrl}/verifyOtp/${email}/${otp}`)
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};

export const changePass = async (email, password) => {
  return axios
    .post(`${baseUrl}/changePass`, { email, password })
    .then((result) => result.data)
    .catch((error) => {
      throw error;
    });
};
