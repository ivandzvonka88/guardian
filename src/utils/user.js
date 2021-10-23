import {getDataFromStore} from './storage';

export const getUser = async () => {
  const user = await getDataFromStore('user');

  return JSON.parse(user);
};

export const isLoggedIn = async () => {
  const token = await getDataFromStore('token');

  if (token) {
    return true;
  }
  return false;
};
