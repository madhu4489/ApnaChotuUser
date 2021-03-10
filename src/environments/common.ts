// const BASE_URL = 'http://139.59.45.85/api/v1/';
const BASE_URL = 'http://159.89.171.183/api/v1/';


export const common = {
  urls: {
    IMG_URL: 'http://139.59.45.85/api/v1/',
    BASE_URL: `${BASE_URL}`,
    function: {
      getCatagories: () => `${BASE_URL}meta/categories`,
      getLocations: () => `${BASE_URL}meta/locations`,
      getLogin: () => `${BASE_URL}user/login`,
      signUp: () => `${BASE_URL}user/signup`,
      getOTP: () => `${BASE_URL}user/mobile/verify`,
      updateProfile: () => `${BASE_URL}user/profileUpdate`,
      getRestaurants: () => `${BASE_URL}vendors/getall`,
      getAllAddres: () => `${BASE_URL}user/address/get_all`,
      updateAddres: () => `${BASE_URL}user/address/update`,
      addAddres: () => `${BASE_URL}user/address/add`,
      deletetAddres: () => `${BASE_URL}user/address/delete`,
    },
  },
};
