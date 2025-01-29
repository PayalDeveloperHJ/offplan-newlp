// src/utils/getBasePath.js
const getBasePath = () => {
  return import.meta.env.MODE === "production"
    ? import.meta.env.VITE_PROD_URL
    : import.meta.env.VITE_BASE_URL;
};

export default getBasePath;
