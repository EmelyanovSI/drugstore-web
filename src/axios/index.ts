import axios from 'axios';

export default axios.create({
    baseURL: 'https://drugstore-api-express.herokuapp.com'
});
