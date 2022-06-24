import axios from 'axios';
import Header from "../component/header";
import React, {useState} from "react";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {
    categories, getAllAuctions,
    getAllBidderList,
    getAllUserList, getAuctions,
    getCategories, getDayDiff,
    getHighestBid,
    getUserList,
    isReserved, stateOption
} from "../API/AuctionService";
// @ts-ignore
import Cookies from 'js-cookie'
import {
    Alert,Dialog,DialogTitle,
    Autocomplete,
    Avatar, Button,Snackbar,
    Card,DialogActions,
    CardContent,
    CardMedia,
    Chip, DialogContentText, FormControl,
    Grid, IconButton,
    InputAdornment, InputLabel, NativeSelect, Pagination,
    Stack,DialogContent,
    TextField,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import BorderColorIcon from "@mui/icons-material/BorderColor";

const MyAuctions = () => {
    const [sellerAuction, setSellerAuction] = React.useState<Array<auction>>([])
    const [openDeleteDialog, setOpenDeleteDialog] =
        React.useState(false)

    const [search, setSearch] = React.useState("")
    const [numberShow, setNumberShow] = React.useState(10)
    const [sortBy, setSortBy] = useState("")
    const navigater = useNavigate();
    const [currentPage, setCurrentPage] = React.useState(1)
    const [categoryList, setCategoryList] = React.useState<Array<category>>([])
    const [defaultCategory, setDefaultCategory] = useState([])
    const [totalItem, setTotalItem] = React.useState(0)
    const [alert, setAlert] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState('');
    const [dialogAuctionId, setDialogAuctionId] =
        React.useState(0)
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const [state, setState] = useState({ id: 2, title: "OPEN" })

    const handleDeleteDialogOpen = (auction:auction) => {
        if (auction.numBids > 0) {
            setAlert(true)
            setAlertContent("Once a bid has been placed on an auction, the auction cannot be\n" +
                "deleted.")
            return
        }
        setDialogAuctionId(auction.auctionId)
        setOpenDeleteDialog(true);
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };


    React.useEffect(() => {
        getMyAuctions()
    }, [currentPage, search, numberShow, defaultCategory,sortBy, state])

    const getMyAuctions = async () => {
        const sellerAuctionRes = await getAuctions(search, numberShow, currentPage, defaultCategory, sortBy, Cookies.get('userId'), state)
        const allAuctionRes = await getAllAuctions(search, currentPage, defaultCategory, sortBy, Cookies.get('userId'),  state)
        const categoryRes = await getCategories()
        console.log("test")
        setSellerAuction(sellerAuctionRes.data.auctions)
        setCategoryList(categoryRes)
        setTotalItem(Math.ceil(allAuctionRes.data.auctions.length / numberShow))

    }


    const handleEditAuction = (auction: auction) => {
        if (auction.numBids > 0) {
            setAlert(true)
            setAlertContent("Once a bid has been placed on an auction, the auction cannot be\n" +
                "edited")
            return
        }
        navigater('/editAuction/'+auction.sellerId + "/" + auction.categoryId + "/" + getCategory(auction.categoryId) + "/" + auction.auctionId)
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


    const deleteAuction = async (auctionId: number) => {
        const config = {
            headers: {
                "X-Authorization": Cookies.get('userToken') || ""
            }
        }
        return await axios.delete('http://localhost:4941/api/v1/auctions/' + auctionId, config)
            .then((response) => {
                getMyAuctions()
                return response
            })
            .catch((error => {
                return error.status
            }))

    }


    const handleClickAuction = (auction: auction) => {
        navigater('/auction/'+auction.sellerId + "/" + auction.categoryId + "/" + auction.auctionId)
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

    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    const onClose = () => {
        handleDeleteDialogClose()
    }

    const seller_auction = () => {
        if (sellerAuction.length === 0) {
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
            return sellerAuction.map((Sauction) =>
                <Grid item md={3} key={Sauction.auctionId}>
                    <Card sx={{height: 550}} >
                        <CardMedia
                            component="img"
                            height="300"
                            src={'http://localhost:4941/api/v1/auctions/' + Sauction.auctionId + '/image'}
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
                                    {Sauction.title}
                                </Typography>

                            </Stack>

                            <Stack
                                direction="row"
                                justifyContent="space-around"
                                alignItems="center"
                                spacing={0.5}
                            >
                                <Typography>
                                    Highest bid: {getHighestBid(Sauction)}
                                </Typography>
                                <Typography variant="button" display="block" gutterBottom>
                                    {isReserved(Sauction)}
                                </Typography>
                                <Chip label={getCategory(Sauction.categoryId)} color="success" variant="outlined" />
                            </Stack>
                        </CardContent>
                        <CardContent>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Avatar sx={{width: 40, height: 40}}
                                        src={'http://localhost:4941/api/v1/users/' + Sauction.sellerId + '/image'}/>
                                <Typography variant="body2">
                                    Seller: {Sauction.sellerFirstName + " " + Sauction.sellerLastName}
                                </Typography>
                                <Typography variant="body2" justifyContent="right">
                                    {getDayDiff(Sauction)}
                                </Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                            >
                                <Button onClick={() => {handleClickAuction(Sauction)}}>View</Button>

                                <Button onClick={()=> {handleEditAuction(Sauction)}}>Edit</Button>
                                <Button onClick={() => {handleDeleteDialogOpen(Sauction)}}>Delete</Button>
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
                        setDefaultCategory(newValue)
                        setCurrentPage(1)

                    }}
                    onInputChange={(event, newValue, reason) => {
                        if (reason === 'reset') {
                            setDefaultCategory([])
                            setCurrentPage(1)

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
                    Your Listings
                </Typography>
                {alert ? <Alert onClose={() => {
                    setAlert(false)
                }} severity='error'>{alertContent}</Alert> : <></>}
                <Grid item xs={8}>
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        spacing={2}
                        padding={4}
                    >
                        <Button variant="contained" href="/myBidAuctions" endIcon={<AddShoppingCartIcon/>}>
                            My bids
                        </Button>
                        <Button variant="contained" href="/listAuction" endIcon={<BorderColorIcon/>}>
                            List item
                        </Button>
                    </Stack>
                </Grid>
                <Grid container padding={20} spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {seller_auction()}
                </Grid>
                <Stack direction='row' justifyContent="center">
                    <Pagination count={totalItem}
                                page={currentPage}
                                size="large"
                                onChange={handleChangePage}
                    />
                </Stack>
            </Grid>
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Delete User?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this auction?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {handleDeleteDialogClose()}}>Cancel</Button>
                    <Button variant="outlined" color="error" onClick={() =>
                    {deleteAuction(dialogAuctionId);onClose()}} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                autoHideDuration={6000}
                open={snackOpen}
                onClose={handleSnackClose}
                key={snackMessage}>
                <Alert onClose={handleSnackClose} severity="success" sx={{
                    width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}
export default MyAuctions;