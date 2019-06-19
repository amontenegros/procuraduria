import axios from 'axios';

export function GetUser() {
    return axios.post('/api/home/userinfo').then(function (response) {
        return response.data.user;
    }).catch(err => {
        throw err;
    });
}