import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie';

export const getAuctions = async (search: string, numberShow: number, page: number, category: any, sortBy: string, sellerId=undefined, state: any) => {
    let query = "?"
    if (search !== "") {
        query += "q=" + search
    }
    if (numberShow !== 0) {
        query += "&count=" + numberShow
    }
    if (page !== 0) {
        query += "&startIndex=" + ((page-1) * numberShow)
    }
    if (category.length >= 1) {
        for (let i=0; i < category.length; i++) {
            query += "&categoryIds=" + category[i].id
        }
    }
    if (sortBy !== "") {
        query += "&sortBy=" + sortBy
    }
    if (sellerId !== undefined) {
        query += "&sellerId=" + sellerId
    }
    if (state !== "") {
        query += "&status=" + state.title
    }

    const response = await axios.get('http://localhost:4941/api/v1/auctions'+ query)
    return response
}

export const getBidAuctions = async (search: string, numberShow: number, page: number, category: any, sortBy: string, bidderId=undefined, state: any) => {
    let query = "?"
    if (search !== "") {
        query += "q=" + search
    }
    if (numberShow !== 0) {
        query += "&count=" + numberShow
    }
    if (page !== 0) {
        query += "&startIndex=" + ((page-1) * numberShow)
    }
    if (category.length >= 1) {
        for (let i=0; i < category.length; i++) {
            query += "&categoryIds=" + category[i].id
        }
    }
    if (sortBy !== "") {
        query += "&sortBy=" + sortBy
    }
    if (bidderId !== undefined) {
        query += "&bidderId=" + bidderId
    }
    if (state !== "") {
        query += "&status=" + state.title
    }

    const response = await axios.get('http://localhost:4941/api/v1/auctions'+ query)
    return response
}

export const getAllBidAuctions = async (search: string,  page: number, category: any, sortBy: string, bidderId=undefined, state: any) => {
    let query = "?"
    if (search !== "") {
        query += "q=" + search
    }
    if (category.length >= 1) {
        for (let i=0; i < category.length; i++) {
            query += "&categoryIds=" + category[i].id
        }
    }
    if (sortBy !== "") {
        query += "&sortBy=" + sortBy
    }
    if (bidderId !== undefined) {
        query += "&bidderId=" + bidderId
    }
    if (state !== "") {
        query += "&status=" + state.title
    }

    const response = await axios.get('http://localhost:4941/api/v1/auctions' + query)
    return response
}


export const placeBid = async (auctionId: number, bidPrice: number) => {
    const config = {
        headers: {
            "X-Authorization": Cookies.get('userToken') || ""
        }
    }
    return await axios.post('http://localhost:4941/api/v1/auctions/' + auctionId + "/bids", {"amount": bidPrice}, config)
        .then(response => {
            return response.status
        })
        .catch((error => {
            return error.response.statusText;
        }))
}

export const getAllAuctions = async (search: string,  page: number, category: any, sortBy: string, sellerId=undefined, status: any) => {
    let query = "?"
    if (search !== "") {
        query += "q=" + search
    }
    if (category.length >= 1) {
        for (let i=0; i < category.length; i++) {
            query += "&categoryIds=" + category[i].id
        }
    }
    if (sortBy !== "") {
        query += "&sortBy=" + sortBy
    }
    if (sellerId !== undefined) {
        query += "&sellerId=" + sellerId
    }
    if (status !== "") {
        query += "&status=" + status.title
    }

    const response = await axios.get('http://localhost:4941/api/v1/auctions'+ query)
    return response
}
export const getAuctionDetail = async (auctionId: number) => {
    const response = await axios.get('http://localhost:4941/api/v1/auctions/' + auctionId)
    return response
}

export const getCategories = async () => {
    const categories = await axios.get('http://localhost:4941/api/v1/auctions/categories')
    if (categories.status === 200) {
        return categories.data
    } else {
        return []
    }
}

export const getAuctionBids = async (auctionId: any) => {
    const bids = await axios.get('http://localhost:4941/api/v1/auctions/' + auctionId + "/bids")
    if (bids.status === 200) {
        return bids.data
    } else {
        return []
    }
}

export const getSimilarAuction = async (categoryId: any) => {
    const query = "?count=3&categoryIds=" + categoryId
    const response = await axios.get('http://localhost:4941/api/v1/auctions' + query)
    if (response.status === 200) {
        return response.data
    }
    return []
}

export const getUserList = async (sellerId: any) => {
    const query = "?count=3&sellerId=" + sellerId
    const response = await axios.get('http://localhost:4941/api/v1/auctions' + query)
    if (response.status === 200) {
        return response.data
    }
    return []
}

export const getAllUserList = async (sellerId: any) => {
    const query = "?&sellerId=" + sellerId
    const response = await axios.get('http://localhost:4941/api/v1/auctions' + query)
    if (response.status === 200) {
        return response.data
    }
    return []
}

export const getAllBidderList = async (bidderId: any) => {
    const query = "?&bidderId=" + bidderId
    const response = await axios.get('http://localhost:4941/api/v1/auctions' + query)
    if (response.status === 200) {
        return response.data
    }
    return []
}


export const uploadAuction = async (title: string, description: string, reserve: number, categoryId: number, endDate: string) => {
    const config = {
        headers: {
            "X-Authorization": Cookies.get('userToken') || ""
        }
    }
    return await axios.post('http://localhost:4941/api/v1/auctions',
        {"title": title, "description": description, "categoryId": categoryId, "endDate": endDate, "reserve": reserve}, config)
        .then((response) => {
            return response
        })
        .catch((error) => {
            return error.status
        })
}



export const updateAuction = async (auctionId: number, title: string, description: string, reserve: number, categoryId: number, endDate: string) => {
    const config = {
        headers: {
            "X-Authorization": Cookies.get('userToken') || ""
        }
    }
    return await axios.patch('http://localhost:4941/api/v1/auctions/'+auctionId,
        {"title": title, "description": description, "categoryId": categoryId, "endDate": endDate, "reserve": reserve}, config)
        .then((response) => {
            return response
        })
        .catch((error) => {
            console.log(error.status)
            return error.response.statusText
        })
}


export const getHighestBid = (auction: auction) => {
    if (auction.highestBid === null) {
        return "0"
    } else {
        return auction.highestBid
    }
}

export const isReserved = (auction: auction) => {
    if (auction.highestBid >= auction.reserve) {
        return "Reserve met"
    } else {
        return "Reserve not meet"
    }
}

export const getDayDiff = (auction: auction) => {
    const today = new Date();
    const auctionEndDay = new Date(auction.endDate)
    const diff = auctionEndDay.getTime() - today.getTime()
    const daydiff = Math.round(diff/(1000*60*60*24))
    if (daydiff < 0) {
        return "closed"
    } else {
        return "close in " + daydiff + " days";
    }
}

export const categories = [
    { id: 1, title: "Smartphones" },
    { id: 2, title: "Computers & Laptops" },
    { id: 3, title: "Books"},
    { id: 4, title: "CDs"},
    { id: 5, title: "DVDs"},
    { id: 6, title: "Motorbikes"},
    { id: 7, title: "Bicycles"},
    { id: 8, title: "Farm Equipment"},
    { id: 9, title: "Jewellery"},
    { id: 10, title: "Homeware"},
    { id: 11, title: "Furniture"},
    { id: 12, title: "Watches"},
    { id: 13, title: "Instruments"},
    { id: 14, title: "Electronics"},
    { id: 15, title: "Office Equipment"},
    { id: 16, title: "Tablets"},
    { id: 17, title: "Paintings & Sculptures"},
    { id: 18, title: "Bulk Items"},
    { id: 19, title: "Gaming Consoles"},
    { id: 20, title: "Hair Care"},
    { id: 21, title: "Perfume"},
    { id: 22, title: "Clothing"},
    { id: 23, title: "Lego"},
    { id: 24, title: "Figurines"},
    { id: 25, title: "Cars"},
];

export const stateOption = [
    { id: 1, title: "CLOSED" },
    { id: 2, title: "OPEN" },
    { id: 3, title: "ANY"}
]


const handleErrorImage = (ev: any) => {
    ev.target.src = "https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg"
}



