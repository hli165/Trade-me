import React from "react";
import axios from "axios"
// @ts-ignore
import Cookies from 'js-cookie';

import {
    Link,
    Alert,
    Avatar,
    Box, Button,
    Container,
    FormControl,
    Grid, IconButton, InputAdornment,
    InputLabel, OutlinedInput,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import {login} from "../API/UserAccountService";
import {useNavigate} from "react-router-dom";
import Header from "../component/header";

const LoginScreen = () => {

    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);

    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")

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


    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };
    const updateEmail = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value)}
    const updatePassword = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(event.target.value)}

    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    const handleSignIn = async () => {
        // To remove error message
        setEmailError(false)
        setPasswordError(false)

        if (password === "") {
            setPasswordError(true)
        }
        if (email === "" ) {
            setEmailError(true)
        } else {
            const loginResponse = await login(email, password)
            if (loginResponse === 200) {
                navigater("/home")
            } else {
                setAlertContent(loginResponse)
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
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}/>
                    <Typography component="h1" variant="h4">
                        Sign In
                    </Typography>
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
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button
                            fullWidth
                            onClick={() => handleSignIn()}
                            variant="contained"
                            sx={{mt: 3, mb: 2}}>
                            Sign In
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Link href="/register" variant="body2">
                                Sign up here
                            </Link>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </div>
    )
}
export default LoginScreen;