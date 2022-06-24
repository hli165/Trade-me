import axios from 'axios';
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
import Header from "../component/header";
import React, {useState} from "react";
import moment from 'moment';


// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {categories, uploadAuction} from "../API/AuctionService";
import {useNavigate} from "react-router-dom";
import {setAuctionImageGivenId} from "../API/AuctionImageService";


const ListAuction = () => {
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [imageSrc, setImageSrc] = React.useState("")
    const [reserve, setReserve] = React.useState(1)
    const [date, setDate] = React.useState(""
    );
    const [selectCategoryId, setSelectedCategoryId] = useState(0);
    const [auctionImage, setAuctionImage] = React.useState(null)
    const navigater = useNavigate();

    const [alert, setAlert] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState('');
    const Input = styled('input')({
        display: 'none',
    });

    const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']


    const updateTitle = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(event.target.value)}
    const updateReserve = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setReserve(Number(event.target.value))}
    const updateDescription = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setDescription(event.target.value)}

    const handleChangeDate = (e: any) => {
        setDate(moment(e.target.value).format('YYYY-MM-DD HH:MM:ss'));
  };

    const handleChange = (event: any, value: any) => {
        if (value.id === null) {
            setSelectedCategoryId(0)
        }
        setSelectedCategoryId(value.id);
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

    const handleSave = async () => {
        setAlert(false)
        if (title.trim() === "") {
            setAlert(true)
            setAlertContent("Title must not be empty!")
            return
        }
        if (selectCategoryId === 0) {
            setAlert(true)
            setAlertContent("Auction must have one category")
            return
        }
        if (date <= (moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))) {
            setAlert(true)
            setAlertContent("End date must be in the future")
            return
        }
        if (description.trim() === "") {
            setAlert(true)
            setAlertContent("Description must be not empty")
            return;
        }
        if (reserve <= 0 || isNaN(reserve)) {
            setAlert(true)
            setAlertContent("Reserve price must be $1 or more")
            return
        }
        if (auctionImage === null) {
            setAlertContent("Please upload image for your item")
            setAlert(true)
            return
        }
        const response = await uploadAuction(title, description, reserve, selectCategoryId, date)
        if (response.status === 201) {
            if (auctionImage !== undefined && auctionImage !== null) {
                const uploadImageRes = await setAuctionImageGivenId(auctionImage, response.data.auctionId)
                if (uploadImageRes === 201) {
                    navigater("/myAuctions")
                    return
                } else {
                    setAlertContent("Something wrong while uploading image, please try it again")
                    setAlert(true)
                    return
                }
            } else {
            }
            navigater("/myAuctions")
        } else {
            setAlert(true)
            setAlertContent("Something is wrong, please try it again")
        }
    }




    const handleErrorImage = (ev: any) => {
        ev.target.src = "https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg"
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
                            What are you listing?
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
                                // value={date}
                                onChange={handleChangeDate}
                            />
                        </FormControl>

                        <FormControl fullWidth sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Reserve (optional)</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                // value={values.amount}
                                type='number'
                                onChange={updateReserve}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Reserve (optional)"
                            />
                        </FormControl>
                        <TextField
                            fullWidth
                            placeholder="Auction Description"
                            onChange={updateDescription}
                            multiline
                            rows={2}
                            maxRows={4}
                        />
                        <label htmlFor="contained-button-file">
                            <Input required accept=".jpg,.jpeg,.png,.gif" id="contained-button-file" type="file" onChange={async (e) => await uploadAuctionImage(e)} />
                            <Button variant="contained" component="span" >
                                Upload Image
                            </Button>
                            - ▪ Image (JPEG, PNG, or GIF) need to provide
                        </label>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file" />
                            <Button variant="contained" onClick={() => {handleSave()}} >
                                Save
                            </Button>
                        </label>

                    </Stack>
                </Grid>
            </Grid>
        </div>

    )
}
export default ListAuction;