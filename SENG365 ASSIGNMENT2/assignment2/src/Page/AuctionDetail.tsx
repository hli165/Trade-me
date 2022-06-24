import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import React from "react";
import {Simulate} from "react-dom/test-utils";
import Header from "../component/header";
// @ts-ignore
import Cookies from 'js-cookie';
import {
    Grid,
    Box,
    Stack,
    AccordionSummary,
    Accordion,
    Typography,
    AccordionDetails,
    CardContent,
    TableBody,
    Card,
    CardHeader,
    Button,
    Avatar,
    TableContainer,
    Table,
    Paper,
    TableHead,
    TableRow,
    TableCell,
    CardMedia,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormControl,
    InputLabel,
    OutlinedInput, InputAdornment, Alert
} from "@mui/material";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';
import {getAuctionBids, getCategories, getSimilarAuction, getUserList, placeBid} from "../API/AuctionService";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import auctions from "./GetAllAuctions";


const AuctionDetail = () => {
    const {id, categoryId, sellerId} = useParams()
    const [bidPrice, setBidPrice] = React.useState(0)
    const [categoryList, setCategoryList] = React.useState<Array<category>>([])
    const [similarAuctions, setSimilarAuctions] = React.useState<Array<auction>>([])
    const [sellerAuctions, setSellerAuctions] = React.useState<Array<auction>>([])
    const [alert, setAlert] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState('');
    const navigater = useNavigate();
    const [imageSrc, setImageSrc] = React.useState("")
    const [bids, setBids] = React.useState<Array<bid>>([])
    const [dialogAuctionId, setDialogAuctionId] =
        React.useState(0)
    const [openBidAuctionDialog, setOpenBidAuctionDialog] =
        React.useState(false)

    const handleBidDialogOpen = (auction:auction) => {
        setDialogAuctionId(auction.auctionId)
        setOpenBidAuctionDialog(true);
    };

    const handleBidDialogClose = () => {
        setOpenBidAuctionDialog(false);
    };

    const updateBidPrice = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setBidPrice(Number(event.target.value))}

    const getHighestBid = (auction: auction) => {
        if (auction.highestBid === null) {
            return "0"
        } else {
            return auction.highestBid
        }
    }


    const [auction, setAuction] = React.useState<auctions>({
        categoryId: 0,
        description: "",
        endDate: "",
        highestBid: 0,
        numBids: 0,
        reserve: 0,
        sellerFirstName: "",
        sellerId: 0,
        sellerLastName: "",
        title: "",
        auctionId: 0})

    React.useEffect(() => {
        getAuctionDetail()
    }, [id])

    const getAuctionDetail = () => {
        axios.get('http://localhost:4941/api/v1/auctions/' + id)
            .then(async (response) => {
                const categoryRes = await getCategories()
                const bidsRes = await getAuctionBids(id)
                const similarAuctionRes = await getSimilarAuction(categoryId)
                const sellerAuctionRes = await getUserList(sellerId)
                setAuction(response.data)
                setCategoryList(categoryRes)
                setBids(bidsRes)
                setBidPrice(Number(getHighestBid(response.data)))
                setSimilarAuctions(similarAuctionRes.auctions)
                setSellerAuctions(sellerAuctionRes.auctions)
            }, (error) => {
                navigater('/home')
            })
    }


    const isReserved = (auction: auction) => {
        if (auction.highestBid >= auction.reserve) {
            return "Reserve met"
        } else {
            return "Reserve not meet"
        }
    }

    const getSimilar = () => {
        const temp = similarAuctions.filter(similar => similar.auctionId != auction.auctionId)
        return temp
    }

    const getSellerList = () => {
        const temp = sellerAuctions.filter(items => items.auctionId != auction.auctionId)
        return temp
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
    const handleErrorImage = (ev: any) => {
        ev.target.src = "https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg"
    }



    const handlePlaceBid = async (auctionId: number, bidPrice:number) => {
        const bidRes = await placeBid(auctionId, bidPrice)
        if (bidRes !== 201) {
            setAlert(true)
            setAlertContent(bidRes)
            handleBidDialogClose()
        } else {
            onClose()
        }
    }

    const seller_auction = () => {
        if (getSellerList().length === 0) {
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
        return getSellerList().map((sellerAuction) =>
            <Card sx={{height: 550}} key={sellerAuction.auctionId} onClick={() => {handleClickAuction(sellerAuction)}}>
                <CardMedia
                    component="img"
                    height="300"
                    src={'http://localhost:4941/api/v1/auctions/' + sellerAuction.auctionId + '/image'}
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
                            {sellerAuction.title}
                        </Typography>


                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        alignItems="center"
                        spacing={0.5}
                    >
                        <Typography>
                            Highest bid: {getHighestBid(sellerAuction)}
                        </Typography>
                        <Typography variant="button" display="block" gutterBottom>
                            {isReserved(sellerAuction)}
                        </Typography>
                        <Chip label={getCategory(sellerAuction.categoryId)} color="success" variant="outlined" />
                    </Stack>

                </CardContent>
                <CardContent>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Avatar sx={{width: 40, height: 40}}
                                src={'http://localhost:4941/api/v1/users/' + sellerAuction.sellerId + '/image'}/>
                        <Typography variant="body2">
                            Seller: {sellerAuction.sellerFirstName + " " + sellerAuction.sellerLastName}
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    const onClose = () => {
        handleBidDialogClose()
        window.location.reload();
    }


    const similar_auction = () => {
        if (getSimilar().length === 0) {
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
        }
        return getSimilar().map((similarAuction) =>
            <Card sx={{height: 550}} key={similarAuction.auctionId} onClick={() => {handleClickAuction(similarAuction)}}>
                <CardMedia
                    component="img"
                    height="300"
                    src={'http://localhost:4941/api/v1/auctions/' + similarAuction.auctionId + '/image'}
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
                            {similarAuction.title}
                        </Typography>

                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="space-around"
                        alignItems="center"
                        spacing={0.5}
                    >
                        <Typography>
                            Highest bid: {getHighestBid(similarAuction)}
                        </Typography>
                        <Typography variant="button" display="block" gutterBottom>
                            {isReserved(similarAuction)}
                        </Typography>
                        <Chip label={getCategory(similarAuction.categoryId)} color="success" variant="outlined" />
                    </Stack>

                </CardContent>
                <CardContent>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Avatar sx={{width: 40, height: 40}}
                                src={'http://localhost:4941/api/v1/users/' + similarAuction.sellerId + '/image'}/>
                        <Typography variant="body2">
                            Seller: {similarAuction.sellerFirstName + " " + similarAuction.sellerLastName}
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    return (
        <div>
            {<Header/>}
            <Grid container spacing={2} padding={10}>

                <Grid item xs={6} md={7}>
                    <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Box
                            component="img"
                            sx={{
                                height: 500,
                                width: 600,
                                maxHeight: { xs: 500, md: 600 },
                                maxWidth: { xs: 500, md: 600 },
                            }}
                            src={'http://localhost:4941/api/v1/auctions/' + auction.auctionId + '/image'}
                            onError={handleErrorImage}
                        />
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Bid List</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Card>
                                    <TableContainer component={Paper} sx={{
                                        width: 600,
                                        maxWidth: { xs: 500, md: 600 }
                                    }}>
                                        <Table sx={{ minWidth: 600 }} aria-label="caption table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="justify">
                                                        User
                                                    </TableCell>
                                                    <TableCell align="justify">Time</TableCell>
                                                    <TableCell align="justify">$</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {bids.map((bid) => (
                                                    <TableRow key={bid.bidderId}>
                                                        <TableCell align="justify" component="th" scope="row">
                                                            <CardHeader
                                                                avatar={
                                                                    <Avatar
                                                                        alt="Remy Sharp"
                                                                        src={'http://localhost:4941/api/v1/users/' + bid.bidderId + '/image'}
                                                                    />
                                                                }
                                                                title={bid.firstName + " " + bid.lastName}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="justify">{bid.timestamp}</TableCell>
                                                        <TableCell align="justify">{bid.amount}</TableCell>
                                                        {/*<TableCell align="right">{row.carbs}</TableCell>*/}
                                                        {/*<TableCell align="right">{row.protein}</TableCell>*/}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Card>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                </Grid>
                <Grid item xs={6} md={5}>
                    <Stack
                        direction="column"
                        justifyContent="left"
                        alignItems="flex-start"
                        spacing={2}
                        >
                        <Typography variant="h1" component="div" gutterBottom>
                            {auction.title}
                        </Typography>
                        {alert ? <Alert onClose={() => {
                            setAlert(false)
                        }} severity='error'>{alertContent}</Alert> : <></>}
                        <Typography variant="overline" display="block" gutterBottom>
                            {auction.description}
                        </Typography>
                        <Stack
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                            spacing={0.5}>
                            <AccessTimeFilledIcon/>
                            <Typography variant="overline" display="block" gutterBottom>
                                Close Time: {auction.endDate}
                            </Typography>
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                            spacing={0.5}>
                            <EventIcon/>
                            <Typography variant="overline" display="block" gutterBottom>
                                Number of bids: {auction.numBids}
                            </Typography>
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                            spacing={0.5}>
                            <CategoryIcon/>
                            <Typography variant="overline" display="block" gutterBottom>
                                Category: {getCategory(auction.categoryId)}
                            </Typography>
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                            spacing={0.5}>
                            <Avatar sx={{width: 40, height: 40}}
                                    src={'http://localhost:4941/api/v1/users/' + auction.sellerId + '/image'}
                                    />
                            <Typography variant="overline" display="block" gutterBottom>
                                Seller: {auction.sellerFirstName + " " + auction.sellerLastName}
                            </Typography>
                        </Stack>
                        <Card sx={{height: 250, width:700}}>
                            <CardContent>
                                <Stack
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Typography variant="overline" display="block" gutterBottom>
                                        Current bid
                                    </Typography>
                                    <Typography gutterBottom variant="h3" component="div">
                                        $ {getHighestBid(auction)}
                                    </Typography>
                                    <Button variant="contained" fullWidth onClick={() => {handleBidDialogOpen(auction)}}>
                                        Place bid
                                    </Button>
                                    <Typography gutterBottom variant="body2" component="div">
                                        {isReserved(auction)}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>

                    </Stack>
                </Grid>
                <Grid item xs={6} md={12}>

                        <Typography variant="h4" component="div" gutterBottom>
                            Other listings you might like
                        </Typography>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        {similar_auction()}
                    </Stack>
                </Grid>
                <Grid item xs={6} md={12}>

                    <Typography variant="h4" component="div" gutterBottom>
                        Seller's other listings
                    </Typography>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        {seller_auction()}
                    </Stack>
                </Grid>
            </Grid>

            <Dialog
                open={openBidAuctionDialog}
                onClose={handleBidDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Place Bid"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        How much you want bid?
                    </DialogContentText>
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel htmlFor="outlined-adornment-amount">Place your bid</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            value={bidPrice}
                            onChange={updateBidPrice}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Place your bid"
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {handleBidDialogClose()}}>Cancel</Button>
                    <Button variant="outlined" color="success" onClick={() =>
                    {handlePlaceBid(dialogAuctionId, bidPrice)}} autoFocus>
                        Bid
                    </Button>
                </DialogActions>
            </Dialog>

        </div>

    )
}
export default AuctionDetail;