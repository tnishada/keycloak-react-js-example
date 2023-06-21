import axios from 'axios';

const httpClient = axios.create({
    // baseURL: 'http://192.168.1.32:10001'
    // baseURL: 'http://localhost:10001'
});

export {httpClient}