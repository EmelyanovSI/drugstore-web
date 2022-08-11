import axios from 'axios';

const { REACT_APP_BASE_URI } = process.env;

export default axios.create({
    baseURL: REACT_APP_BASE_URI
});
