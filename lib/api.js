import axios from 'axios';

const baseURL = 'https://jsonplaceholder.typicode.com';

export const getArticles = async (page) => {
  const res = await axios.get(`${baseURL}/posts?_page=${page}&_limit=25`);
  return res.data;
}

export const getUsers = async () => {
  const res = await axios.get(`${baseURL}/users`);
  return res.data;
}

export const getArticlesByUserId = async (userId) => {
  const res = await axios.get(`${baseURL}/posts?userId=${userId}`);
  return res.data;
}

export const getUserById = async (userId) => {
  const res = await axios.get(`${baseURL}/users/${userId}`);
  return res.data;
}

export const searchArticles = async (keyword) => {
  const res = await axios.get(`${baseURL}/posts?q=${keyword}`);
  return res.data;
}

export const searchUsers = async (keyword) => {
  const res = await axios.get(`${baseURL}/users?q=${keyword}`);
  return res.data;
}
