import {
    Autocomplete,
    Avatar, Button,
    Card,
    CardContent,
    CardMedia,
    Chip, FormControl,
    Grid, IconButton,
    InputAdornment, InputLabel, NativeSelect, Pagination,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {
    categories,
    getAllAuctions, getAllBidAuctions,
    getAllBidderList,
    getAuctions, getBidAuctions, getCategories,
    getDayDiff,
    getHighestBid,
    isReserved, stateOption
} from "../API/AuctionService";
import React, {useState} from "react";
import MyAuctions from "./MyAuctions";
// @ts-ignore
import Cookies from 'js-cookie'
import {useNavigate} from "react-router-dom";
import Header from "../component/header";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import BorderColorIcon from "@mui/icons-material/BorderColor";


const MyBidAuctions =  () => {
    const [bidAuction, setBidAuction] = React.useState<Array<auction>>([])
    const [categoryList, setCategoryList] = React.useState<Array<category>>([])
    const [search, setSearch] = React.useState("")
    const [numberShow, setNumberShow] = React.useState(10)
    const [defaultCategory, setDefaultCategory] = useState([])
    const [sortBy, setSortBy] = useState("")
    const navigater = useNavigate();
    const [currentPage, setCurrentPage] = React.useState(1)
    const [selectCategoryId, setSelectedCategoryId] = useState(0);
    const [totalItem, setTotalItem] = React.useState(0)
    const [state, setState] = useState({ id: 2, title: "OPEN" })

    React.useEffect(() => {
        getMybidAuctions()
    }, [currentPage, selectCategoryId, search, numberShow, defaultCategory, sortBy,state])


    const getMybidAuctions = async () => {
        const bidAuctionRes = await getBidAuctions(search, numberShow, currentPage, defaultCategory, sortBy, Cookies.get('userId'),state)
        const allAuctionRes = await getAllBidAuctions(search, currentPage, defaultCategory, sortBy, Cookies.get('userId'),state)
        const categoryRes = await getCategories()
        setBidAuction(bidAuctionRes.data.auctions)
        setCategoryList(categoryRes)

        setTotalItem(Math.ceil(allAuctionRes.data.auctions.length / numberShow))
        console.log(allAuctionRes.data.auctions.length)

    }
    const handleClickAuction = (auction: auction) => {
        navigater('/auction/'+auction.sellerId + "/" + auction.categoryId + "/" + auction.auctionId)
    }

    const handleErrorImage = (ev: any) => {
        ev.target.src = "https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg"
    }

    const updateSearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearch(event.target.value)
        setCurrentPage(1)
    }

    const handleSearch = () => {
        setSearch(search)
        setCurrentPage(1)
    }

    const handleChangeSort = (
        ev:any
    ) => {
        setSortBy(ev.target.value)
        setCurrentPage(1)

    }


    const handleChangePage = (
        ev:any,
        value: any
    ) => {
        setCurrentPage(value)
    };


    const handleChangeNumShow = (
        ev:any
    ) => {
        setNumberShow(Number(ev.target.value))
        setCurrentPage(1)

    }

    const getCategory = (categoryId: number) => {
        let category = ""
        if (categoryList !== undefined) {
            const outcome = categoryList.find(e => e.categoryId === categoryId)
            if (outcome != undefined) {
                category = outcome.name
            }
        }
        return category;
    }

    const bid_auction = () => {
        if (bidAuction.length === 0) {
            return    <Card sx={{height: 550}}>
                <CardMedia
                    component="img"
                    height="300"
                    src={"https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg"}
                />
                <CardContent>
                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        alignItems="center"
                        spacing={0.5}
                    >
                        <Typography gutterBottom variant="h5" component="div">

                        </Typography>

                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        alignItems="center"
                        spacing={0.5}
                    >
                        <Typography>
                        </Typography>
                        <Typography variant="button" display="block" gutterBottom>
                        </Typography>
                        {/*<Chip label={getCategory(sellerAuction.categoryId)} color="success" variant="outlined" />*/}
                    </Stack>

                </CardContent>
                <CardContent>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Avatar sx={{width: 40, height: 40}}
                        />
                        <Typography variant="body2">
                            {/*Seller: {sellerAuction.sellerFirstName + " " + sellerAuction.sellerLastName}*/}
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        } else
            return bidAuction.map((bAuction) =>
                <Grid item md={3} key={bAuction.auctionId}>
                    <Card sx={{height: 550}} onClick={() => {handleClickAuction(bAuction)}}>
                        <CardMedia
                            component="img"
                            height="300"
                            src={'http://localhost:4941/api/v1/auctions/' + bAuction.auctionId + '/image'}
                            onError={handleErrorImage}
                        />
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-around"
                                alignItems="center"
                                spacing={0.5}
                            >
                                <Typography gutterBottom variant="h5" component="div">
                                    {bAuction.title}
                                </Typography>

                            </Stack>

                            <Stack
                                direction="row"
                                justifyContent="space-around"
                                alignItems="center"
                                spacing={0.5}
                            >
                                <Typography>
                                    Highest bid: {getHighestBid(bAuction)}
                                </Typography>
                                <Typography variant="button" display="block" gutterBottom>
                                    {isReserved(bAuction)}
                                </Typography>
                                <Chip label={getCategory(bAuction.categoryId)} color="success" variant="outlined" />
                            </Stack>
                        </CardContent>
                        <CardContent>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Avatar sx={{width: 40, height: 40}}
                                        src={'http://localhost:4941/api/v1/users/' + bAuction.sellerId + '/image'}/>
                                <Typography variant="body2">
                                    Seller: {bAuction.sellerFirstName + " " + bAuction.sellerLastName}
                                </Typography>
                                <Typography variant="body2" justifyContent="right">
                                    {getDayDiff(bAuction)}
                                </Typography>
                            </Stack>
                        </CardContent>

                    </Card>
                </Grid>
            )
    }




    return (
        <div>
            {<Header/>}
            <Stack marginTop={10} direction='row' justifyContent='center'  spacing={4}>
                <TextField
                    label="Search"
                    onChange={updateSearch}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton edge="end" color="primary">
                                    <SearchIcon
                                        onClick={() => {handleSearch()}}
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Number
                    </InputLabel>
                    <NativeSelect
                        defaultValue={10}
                        onChange={handleChangeNumShow}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                    </NativeSelect>
                </FormControl>
                <Autocomplete
                    multiple
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    id="combo-box-demo"
                    options={categories}
                    getOptionLabel={option => option.title}
                    style={{ width: 300 }}
                    renderInput={params => (
                        <TextField {...params} label="Category" variant="outlined" />
                    )}
                    onChange={(event, newValue) => { // @ts-ignore
                        setDefaultCategory(newValue )
                        setCurrentPage(1)

                    }}
                    onInputChange={(event, newValue, reason) => {
                        if (reason === 'reset') {
                            setSelectedCategoryId(0)
                            setDefaultCategory([])
                            return
                        }
                    }}
                />
                <FormControl>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Sort by
                    </InputLabel>
                    <NativeSelect
                        defaultValue="CLOSING_SOON"
                        inputProps={{
                            name: 'age',
                            id: 'uncontrolled-native',
                        }}
                        onChange={handleChangeSort}
                    >
                        <option value="CLOSING_SOON">CLOSING_SOON</option>
                        <option value={"CLOSING_LAST"}>CLOSING_LAST</option>
                        <option value={"ALPHABETICAL_ASC"}>ALPHABETICAL_ASC</option>
                        <option value={"ALPHABETICAL_DESC"}>ALPHABETICAL_DESC</option>
                        <option value={"BIDS_ASC"}>BIDS_ASC</option>
                        <option value={"BIDS_DESC"}>BIDS_DESC</option>
                        <option value={"RESERVE_ASC"}>RESERVE_ASC</option>
                        <option value={"RESERVE_DESC"}>RESERVE_DESC</option>
                    </NativeSelect>
                </FormControl>
                <Autocomplete
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    id="combo-box-demo"
                    options={stateOption}
                    getOptionLabel={option => option.title}
                    value={state}
                    style={{ width: 300 }}
                    renderInput={params => (
                        <TextField {...params} label="Status" variant="outlined" />
                    )}
                    onChange={(event, newValue) => { // @ts-ignore
                        setState(newValue)
                        setCurrentPage(1)

                    }}
                />
            </Stack>
            <Grid item xs={6} md={12}>

                <Typography variant="h4" component="div" gutterBottom>
                    You bid on
                </Typography>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                    padding={4}
                >
                    <Button variant="contained" href="/myAuctions" endIcon={<AddShoppingCartIcon/>}>
                        My Listings
                    </Button>
                </Stack>

                <Grid container padding={20} spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {bid_auction()}
                </Grid>
                <Stack direction='row' justifyContent="center">
                    <Pagination count={totalItem}
                                page={currentPage}
                                size="large"
                                onChange={handleChangePage}
                    />
                </Stack>
            </Grid>
        </div>
    )

}


export default MyBidAuctions;