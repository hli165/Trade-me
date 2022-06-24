import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie';

export const uploadUserImage = async (image: any, userId: number) => {
    let imageType = image.type
    const config = {
        headers: {"content-type": imageType,
            "X-Authorization": Cookies.get('userToken') || ""
        }
    }
    return await axios.put('http://localhost:4941/api/v1/users/' + userId + "/image", image, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
        return error.response.statusText;
    })

}

export const deleteUserImage = async (userId: number) => {
    const config = {
        headers: {
            "X-Authorization": Cookies.get('userToken') || ""
        }
    }
    return await axios.delete('http://localhost:4941/api/v1/users/' + userId + '/image', config)
        .then((response) => {
            return response.status
        })
        .catch((error) => {
            return error.response.status
        })
}

export const getUserImage = async (userId: number) => {
    return 'http://localhost:4941/api/v1/users/' + userId + '/image'
}