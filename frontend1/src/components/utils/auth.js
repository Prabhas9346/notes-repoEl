import Cookies from 'js-cookie';

export const getJwtToken = () => {
    return Cookies.get('jwtToken');
};
