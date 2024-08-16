import Cookies from 'js-cookie';

export const getJwtToken = () => {
    return Cookies.get('jwtToken');
};
export const BASE_URL = 'https://aposanabackendnotes.onrender.com';
