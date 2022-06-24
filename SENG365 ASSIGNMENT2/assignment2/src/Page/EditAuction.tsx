import axios from 'axios';
import Header from "../component/header";
import React, {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import auctions from "./GetAllAuctions";
import {categories, getAuctionBids, getCategories, updateAuction, uploadAuction} from "../API/AuctionService";
import moment from "moment";
import {
    Alert,
    Autocomplete,
    Box, Button,
    FormControl,
    Grid, InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack, styled,
    TextField,
    Typography
} from "@mui/material";
import {getAuctionImage, setAuctionImageGivenId} from "../API/AuctionImageService";
import {Simulate} from "react-dom/test-utils";


const EditAuction = () => {
    const navigater = useNavigate();
    const {id, categoryId, categoryName, sellerId} = useParams()
    const [categoryList, setCategoryList] = React.useState<Array<category>>([])
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [imageSrc, setImageSrc] = React.useState("")
    const [reserve, setReserve] = React.useState(1)
    const [date, setDate] = React.useState("2023-06-03T22:06")
    // @ts-ignore
    const [defaultCategory, setDefaultCategory] = React.useState({id: Number(categoryId), title: categoryName.toString() })
    const [bids, setBids] = React.useState<Array<bid>>([])

    const [auctionImage, setAuctionImage] = React.useState(null)

    const [alert, setAlert] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState('');

    const Input = styled('input')({
        display: 'none',
    });

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

    const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']


    const updateTitle = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(event.target.value)}
    const updateReserve = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setReserve(Number(event.target.value))}
    const updateDescription = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setDescription(event.target.value)}

    const handleChangeDate = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setDate(event.target.value)};

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

    React.useEffect(() => {
        getEditAuctionDetail()
    }, [])

    const getEditAuctionDetail = () => {
        axios.get('http://localhost:4941/api/v1/auctions/' + id)
            .then(async (response) => {
                const categoryRes = await getCategories()
                const bidsRes = await getAuctionBids(id)
                const trimDate = getDateFormat(response.data)
                const image = await getAuctionImage(response.data.auctionId)
                setCategoryList(categoryRes)
                setDate(trimDate)
                setAuction(response.data)
                setTitle(response.data.title)
                setBids(bidsRes)
                setDescription(response.data.description)
                setImageSrc(image)

            })
            .catch((error) => {
                navigater('/home')
        })
    }



    const uploadAuctionImage = async (e: any) => {
        setAuctionImage(e.target.files[0])
        if (e.target.files[0] === undefined) {
            setImageSrc("")
            return
        } if (!acceptedFileTypes.includes(e.target.files[0].type)) {
            setImageSrc("")
            return
        } else {
            setImageSrc(URL.createObjectURL(e.target.files[0]))
        }
    }

    const getDateFormat = (auction: auction) => {
        const trimDate = auction.endDate.slice(0, 16)
        return trimDate
    }

    const handleErrorImage = (ev: any) => {
        ev.target.src = "https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg"
    }

    const handleChange = (event: any, value: any) => {
        if (value === null) {
            setDefaultCategory({title: "", id: 0})
        }
        else {
            setDefaultCategory(value)
        }
    }


    const handleSave = async () => {
        setAlert(false)
        if (title === "") {
            setAlert(true)
            setAlertContent("Title must not be empty!")
            return
        }
        if (defaultCategory.id === 0 ) {
            setAlert(true)
            setAlertContent("Auction must have one category")
            return
        }
        // @ts-ignore
        if (date <= new Date()) {
            setAlert(true)
            setAlertContent("End date must be in the future")
            return
        }
        if (description === "") {
            setAlert(true)
            setAlertContent("Description must be not empty")
            return;
        }
        if (reserve <= 0) {
            setAlert(true)
            setAlertContent("Reserve price must be $1 or more")
            return
        }
        const response = await updateAuction(auction.auctionId, title, description, reserve, defaultCategory.id, date)
        if (response.status === 200) {
            if (auctionImage !== undefined && auctionImage !== null) {
                const uploadImageRes = await setAuctionImageGivenId(auctionImage, auction.auctionId)
                console.log(uploadImageRes)
                if (uploadImageRes === 201 || uploadImageRes === 200) {
                    navigater("/myAuctions")
                    return
                } else {
                    setAlertContent("Something wrong while uploading image, please try it again")
                    setAlert(true)
                    return
                }
            }
            navigater("/myAuctions")
        } else {
            setAlert(true)
            setAlertContent(response)
        }
    }


    return (
        <div>
            {<Header/>}
            <Grid container spacing={3}>
                <Grid item xs={5}>
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={4}
                        padding={20}
                    >
                        <Typography variant="h3" gutterBottom component="div">
                            Edit Auction
                        </Typography>
                        <Box
                            component="img"
                            sx={{
                                height: 400,
                                width: 500,
                                maxHeight: { xs: 400, md: 400 },
                                maxWidth: { xs: 500, md: 500 },
                            }}
                            alt="The house from the offer."
                            src={imageSrc}
                            onError={handleErrorImage}
                        />

                    </Stack>

                </Grid>
                <Grid item xs={7} padding={20}>
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={4}
                        padding={20}
                    >
                        <Typography variant="h4" gutterBottom component="div">
                            Item details
                        </Typography>
                        {alert ? <Alert onClose={() => {
                            setAlert(false)
                        }} severity='error'>{alertContent}</Alert> : <></>}
                        <TextField
                            required
                            fullWidth
                            label="Auction Title"
                            name="title"
                            onChange={updateTitle}
                            value={title}
                            // error={emailError}
                            // helperText={emailError && "Incorrect entry"}
                            // onChange={updateEmail}
                        />
                        <Autocomplete
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            id="combo-box-demo"
                            options={categories}
                            getOptionLabel={option => option.title}
                            style={{ width: 300 }}
                            value={defaultCategory}
                            renderInput={params => (
                                <TextField {...params} label="Category" variant="outlined" />
                            )}
                            onChange={(event, newValue) => { // @ts-ignore
                                handleChange(event, newValue )
                            }}
                        />
                        <FormControl>
                            <TextField
                                type="datetime-local"
                                value={date}
                                onChange={handleChangeDate}
                            />
                        </FormControl>

                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Reserve (optional)</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                value={reserve}
                                onChange={updateReserve}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Reserve (optional)"
                            />
                        </FormControl>
                        <TextField
                            fullWidth
                            placeholder="Auction Description"
                            value={description}
                            onChange={updateDescription}
                            multiline
                            rows={2}
                        />
                        <label htmlFor="contained-button-file">
                            <Input accept=".jpg,.jpeg,.png,.gif" id="contained-button-file" type="file" onChange={async (e) => await uploadAuctionImage(e)} />
                            <Button variant="contained" component="span" >
                                Upload Image
                            </Button>
                        </label>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file" />
                            <Button variant="contained" onClick={() => {handleSave()}} >
                                Save Changes
                            </Button>
                        </label>

                    </Stack>
                </Grid>
            </Grid>
        </div>

    )
}
export default EditAuction;