import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie';

export const getAuctionImage = async (auctionId: number) => {
    return 'http://localhost:4941/api/v1/auctions/' + auctionId + '/image'
}

export const setAuctionImageGivenId = async (image: any, auctionId: number) => {
    let imageType = image.type
    const config = {
        headers: {"content-type": imageType,
            "X-Authorization": Cookies.get('userToken') || ""
        }
    }
    return await axios.put('http://localhost:4941/api/v1/auctions/' + auctionId + "/image", image, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.statusText;
        })
}