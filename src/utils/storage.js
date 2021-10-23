import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveDataToStore = async (key, value) => {
  if (value && key) {
    try {
      await AsyncStorage.setItem(key, value);

      return true;
    } catch (e) {
      console.log(e);

      return false;
    }
  }
};

export const getDataFromStore = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const deleteDataFromStore = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};
