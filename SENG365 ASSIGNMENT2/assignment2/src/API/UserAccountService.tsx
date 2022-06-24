import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";

export const login = async (email:string , password: string) => {
    return await axios.post(`http://localhost:4941/api/v1/users/login`, {email: email, password: password
    })
        .then((response) => {
            Cookies.set('userId', response.data.userId)
            Cookies.set('userToken', response.data.token)
            return response.status;
        })
        .catch((error) => {
            return error.response.statusText;
        })
}

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
    return await axios.post('http://localhost:4941/api/v1/users/register',
        {"firstName": firstName, "lastName":lastName, "email":email, "password":password})
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.statusText;
    })
}

export const getCurrentUser = async (id: number) => {
    const config = {
        headers: {
            "X-Authorization": Cookies.get('userToken') || ""
        }
    }
    return await axios.get('http://localhost:4941/api/v1/users/'+id, config)
        .then((response) => {
            return response
        })
        .catch((error) => {
            return error.response.statusText;
        })
}


export const isUserLoggedIn = () => {
    return Cookies.get('userToken') !== undefined;
}

export const editUser = async (id: number, firstName: string, lastName: string, email: string) => {
    const config = {
        headers: {
            "X-Authorization": Cookies.get('userToken') || ""
        }
    }
    return await axios.patch('http://localhost:4941/api/v1/users/' + id, {'firstName': firstName, "lastName": lastName, "email": email}, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.status
        })
}

export const editUserPassword = async (id: number, oldPassword: string, newPassword: string) => {
    const config = {
        headers: {
            "X-Authorization": Cookies.get('userToken') || ""
        }
    }
    return await axios.patch('http://localhost:4941/api/v1/users/' + id, {"password": newPassword, "currentPassword": oldPassword}, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.status
        })
}

export const userLogOut = async () => {
    const config = {
        headers: {
            "X-Authorization": Cookies.get('userToken') || ""
        }
    }
    return await axios.post('http://localhost:4941/api/v1/users/logout', {}, config)
        .then((response) => {
            Cookies.remove('userId')
            Cookies.remove('userToken')
        })
        .catch((error) => {
          return error.response.status
        })
}