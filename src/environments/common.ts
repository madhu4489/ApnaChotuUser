const BASE_URL = 'http://139.59.45.85/api/v1/';
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
    },
  },
};
