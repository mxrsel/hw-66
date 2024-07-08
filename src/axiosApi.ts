import axios from 'axios';

const axiosApi = axios.create({
  baseURL: 'https://marsel-js-25-default-rtdb.europe-west1.firebasedatabase.app/pages',
});

export default axiosApi;
