import React from "react";
import axios from "axios"
import {Link} from "@mui/material"
import {Button, Grid, Box, IconButton, FormHelperText,Dialog, OutlinedInput, Avatar, Container, Typography, InputAdornment, FormControl,InputLabel,DialogActions, DialogContent,
    styled,DialogContentText, DialogTitle, TextField, Paper, Table, TableBody,Stack,
    TableContainer, TableRow, TableCell, TableHead, Snackbar, Alert, AlertTitle} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {login, register} from "../API/UserAccountService";
import {useNavigate} from "react-router-dom";
import {Input, PhotoCamera} from "@mui/icons-material";
// @ts-ignore
import Cookies from 'js-cookie';
import {uploadUserImage} from "../API/UserImageService";
import Header from "../component/header";

const RegisterScreen = () => {

    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    const [firstNameError, setFirstNameError] = React.useState(false);
    const [lastNameError, setLastNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);

    const [profileImage, setProfileImage] = React.useState(null)
    const [imageSrc, setImageSrc] = React.useState("")

    const [alert, setAlert] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState('');
    const navigater = useNavigate();
    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")

    const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };
    const updateFirstName = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setFirstName(event.target.value)}
    const updateLastName = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setLastName(event.target.value)}
    const updateEmail = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value)}
    const updatePassword = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(event.target.value)}

    const updateProfileImage = async (e: any) => {
        setProfileImage(e.target.files[0])
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

    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    const Input = styled('input')({
        display: 'none',
    });

    const handleSignUp = async () => {
        // To remove error message
        setFirstNameError(false)
        setLastNameError(false)
        setEmailError(false)
        setPasswordError(false)
        setAlert(false)
        if (firstName.trim() === "") {
            setFirstNameError(true)
            return
        }
        if (lastName === "") {
            setLastNameError(true)
            return
        }
        // const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!((/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test((email.toString().toLowerCase())))){
            setEmailError(true)
            setAlert(true)
            setAlertContent("Email must be like 'example@email.com'")
            return
        }
        if (password.length < 6) {
            setPasswordError(true)
            return
        } else {
            const registerResponse = await register(firstName, lastName, email, password);
            if (registerResponse === 201) {
                const loginResponse = await login(email, password);
                if (loginResponse === 200) {
                    if (profileImage !== undefined && profileImage !== null) {
                        const uploadImageResponse = await uploadUserImage(profileImage, Cookies.get("userId"))
                        if (uploadImageResponse === 201) {
                            navigater("/home")
                            return
                        } else {
                            setAlertContent(uploadImageResponse)
                            setAlert(true)
                            return
                        }
                    }

                    navigater("/home")
                } else {
                    setAlertContent("Please login again")
                    setAlert(true)
                }
            }
            if (registerResponse === 500) {
                setAlertContent("Something went wrong, please try again")
                setAlert(true)
            } else {
                setAlertContent(registerResponse)
                setAlert(true)
            }
        }

    }

    return (
        <div>
            {<Header/>}
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{width: 140, height: 140}} src={imageSrc}/>

                    <Typography component="h1" variant="h4">
                        Sign up
                    </Typography>

                    <label htmlFor="contained-button-file">
                        <Input accept=".jpg,.jpeg,.png,.gif" id="contained-button-file" type="file" onChange={async (e) => await updateProfileImage(e)} />
                        <Button variant="contained" component="span">
                            Upload Image
                        </Button>
                    </label>

                    {alert ? <Alert onClose={() => {
                        setAlert(false)
                    }} severity='error'>{alertContent}</Alert> : <></>}

                    <Snackbar
                        autoHideDuration={6000}
                        open={snackOpen}
                        onClose={handleSnackClose}
                        key={snackMessage}>
                        <Alert onClose={handleSnackClose} severity="success" sx={{
                            width: '100%'
                        }}>
                            {snackMessage}
                        </Alert>
                    </Snackbar>
                    <Box component="form" sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="firstName"
                                    required
                                    fullWidth
                                    label="First Name"
                                    autoFocus
                                    onChange={updateFirstName}
                                    error={firstNameError}
                                    helperText={firstNameError && "Incorrect entry"}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    onChange={updateLastName}
                                    error={lastNameError}
                                    helperText={lastNameError && "Incorrect entry"}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    error={emailError}
                                    helperText={emailError && "Incorrect entry"}
                                    onChange={updateEmail}/>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        required
                                        fullWidth
                                        label="Email Address"
                                        type={values.showPassword ? 'text' : 'password'}
                                        onChange={updatePassword}
                                        error={passwordError}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText error id="accountId-error">
                                        {passwordError && "Incorrect entry"}
                                    </FormHelperText>
                                </FormControl>

                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            onClick={() => handleSignUp()}
                            variant="contained"
                            sx={{mt: 3, mb: 2}}>
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Link href="/login" variant="body2">
                                Already sign up? Log in here
                            </Link>
                        </Grid>
                    </Box>
                </Box>
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
            </Container>
        </div>




    );

}
export default RegisterScreen;