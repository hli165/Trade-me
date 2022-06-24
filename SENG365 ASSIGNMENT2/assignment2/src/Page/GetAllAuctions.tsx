import Header from "../component/header";
import React, {useState} from "react";
import {
    categories,
    getAllAuctions,
    getAuctions,
    getCategories,
    getDayDiff,
    getHighestBid,
    isReserved, stateOption
} from "../API/AuctionService";
import CSS from 'csstype';
import SearchIcon from '@mui/icons-material/Search';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {
    Alert,InputBase,
    AlertTitle,
    Autocomplete,
    Pagination,
    Avatar,
    Select,
    TablePagination,
    Chip,
    Box,
    Button, Card, CardContent, CardMedia,
    Container,
    FormControl, FormHelperText,
    Grid, IconButton, InputAdornment,
    InputLabel,
    Link, OutlinedInput, Paper, Stack,
    TextField,
    Typography, styled, alpha,NativeSelect
} from "@mui/material";


import {useNavigate} from "react-router-dom";
import {match} from "assert";
const GetAllAuctions = () => {
    const navigater = useNavigate();
    const [categoryList, setCategoryList] = React.useState<Array<category>>([])
    const [auctions, setAuctions] = React.useState<Array<auctions>>([])
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalItem, setTotalItem] = React.useState(0)
    const [imageSrc, setImageSrc] = React.useState("")
    const [search, setSearch] = React.useState("")
    const [numberShow, setNumberShow] = React.useState(10)
    const [selectCategoryId, setSelectedCategoryId] = useState(0);
    const [defaultCategory, setDefaultCategory] = useState([])
    const [sortBy, setSortBy] = useState("")
    const [state, setState] = useState({ id: 2, title: "OPEN" })


    React.useEffect(() => {
        GetAuctions()
    }, [currentPage, selectCategoryId, search, numberShow, defaultCategory,sortBy, state])

    const GetAuctions = async () => {
        const response = await getAuctions(search, numberShow, currentPage, defaultCategory, sortBy, undefined, state)
        const allAuctionRes = await getAllAuctions(search, currentPage, defaultCategory, sortBy, undefined, state)
        const categoryRes = await getCategories()
        setAuctions(response.data.auctions)
        setCategoryList(categoryRes)

        setTotalItem(Math.ceil(allAuctionRes.data.auctions.length / numberShow))
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



    const handleClickAuction = (auction: auction) => {
        navigater('/auction/'+auction.sellerId + "/" + auction.categoryId + "/" + auction.auctionId)
    }

    const updateSearch = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearch(event.target.value)
        setCurrentPage(1)
    }


    const handleErrorImage = (ev: any) => {
        ev.target.src = "https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg"
    }

    const handleSearch = () => {
        setSearch(search)
    }



    const handleChangeNumShow = (
        ev:any
    ) => {
        setNumberShow(Number(ev.target.value))
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



    const auction_rows = () => {
        return auctions.map((auction) =>
            <Grid item md={3} key={auction.auctionId}>
                <Card sx={{height: 550}} onClick={() => {handleClickAuction(auction)}}>
                    <CardMedia
                        component="img"
                        height="300"
                        src={'http://localhost:4941/api/v1/auctions/' + auction.auctionId + '/image'}
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
                                {auction.title}
                            </Typography>

                        </Stack>

                        <Stack
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                            spacing={0.5}
                        >
                            <Typography>
                                Highest bid: {getHighestBid(auction)}
                            </Typography>
                            <Typography variant="button" display="block" gutterBottom>
                                {isReserved(auction)}
                            </Typography>
                            <Chip label={getCategory(auction.categoryId)} color="success" variant="outlined" />
                        </Stack>
                    </CardContent>
                    <CardContent>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Avatar sx={{width: 40, height: 40}}
                                    src={'http://localhost:4941/api/v1/users/' + auction.sellerId + '/image'}/>
                            <Typography variant="body2">
                                Seller: {auction.sellerFirstName + " " + auction.sellerLastName}
                            </Typography>
                            <Typography variant="body2" justifyContent="right">
                                {getDayDiff(auction)}
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
            <h1>Auctions</h1>
            <Grid item xs={8}>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                    padding={4}
                >
                    <Button variant="contained" href="/listAuction" endIcon={<BorderColorIcon/>}>
                        List item
                    </Button>
                </Stack>
            </Grid>
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
                    // value={defaultCategory}
                    renderInput={params => (
                        <TextField {...params} label="Category" variant="outlined" />
                    )}
                    onChange={(event, newValue) => { // @ts-ignore
                        // handleChange(event, newValue )
                        setDefaultCategory(newValue)
                        setCurrentPage(1)
                    }}
                    onInputChange={(event, newValue, reason) => {
                        if (reason === 'reset') {
                            setSelectedCategoryId(0)
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
                    onInputChange={(event, newValue, reason) => {
                        if (reason === 'reset') {
                            setState({ id: 2, title: "ANY" })
                        }
                    }}
                />
            </Stack>



            <Grid container padding={20} spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
                {auction_rows()}
            </Grid>
            <Stack direction='row' justifyContent="center">
                <Pagination count={totalItem}
                            page={currentPage}
                            size="large"
                            onChange={handleChangePage}
                />
            </Stack>

        </div>

    )
}
export default GetAllAuctions;