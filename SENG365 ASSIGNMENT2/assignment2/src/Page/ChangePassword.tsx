import {
    Alert,
    Avatar,
    Box,
    Button,
    Container,
    FormControl, FormHelperText,
    Grid, IconButton, InputAdornment,
    InputLabel,
    Link, OutlinedInput,
    TextField,
    Typography
} from "@mui/material";
import React from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
// @ts-ignore
import Cookies from 'js-cookie'
import {editUserPassword, getCurrentUser} from "../API/UserAccountService";
import {getUserImage} from "../API/UserImageService";
import {useNavigate, useParams} from "react-router-dom";
import Header from "../component/header";


const ChangePassword = () => {
    const navigater = useNavigate();
    const {id} = useParams();

    const [oldPassword, setOldPassword] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")

    const [oldPasswordError, setOldPasswordError] = React.useState(false)
    const [newPasswordError, setNewPasswordError] = React.useState(false)

    const [successAlert, setSuccessAlert] = React.useState(false);
    const [successContent, setSuccessContent] = React.useState('');

    const [user, setUser] = React.useState<user>({
        authToken: "",
        email: "",
        firstName: "",
        imageFilename: "",
        lastName: "",
        password: "",
        id:0})

    const [alert, setAlert] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState('');
    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    React.useEffect(() => {
        const getUser = async () => {
            if (Cookies.get('userId') !== id) {
                navigater("/home")
                return;
            }
            const response = await getCurrentUser(Cookies.get('userId'))
            if (response.status !== 200) {
                navigater("/login")
            } else {
                setUser(response.data)
                setOldPassword(response.data.password);
            }
        }
        getUser()
    }, [])

    const updateOldPassword = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setOldPassword(event.target.value)}
    const updateNewPassword = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewPassword(event.target.value)}

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };



    const handleChangePassword = async () => {
        setSuccessAlert(false)
        setAlert(false)
        setNewPasswordError(false)
        setOldPasswordError(false)

        if (oldPassword === '' || oldPassword.length < 6) {
            setAlert(true)
            setAlertContent("Invalid Current password")
            setOldPasswordError(true)
            return
        }
        if (newPassword === '' || newPassword.length < 6) {
            setAlert(true)
            setAlertContent("Invalid New password")
            setNewPasswordError(true)
            return

        }
        const response = await editUserPassword(Cookies.get('userId'), oldPassword, newPassword)
        if (response === 400) {
            setAlert(true)
            setOldPasswordError(true)

            setAlertContent("Current Password is not correct")
            return
        }
        if (response === 200) {
            setSuccessAlert(true)
            setSuccessContent("Image delete successfully")
            navigater("/profile")
        }
    }

    return (

        <div>
            {<Header/>}
            <Container component="main">
                <Box
                    sx={{
                        height: '100vh',
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: 3
                    }}
                >

                    <Typography component="h1" variant="h4">
                        Change Your Password
                    </Typography>


                    {alert ? <Alert onClose={() => {
                        setAlert(false)
                    }} severity='error'>{alertContent}</Alert> : <></>}

                    {successAlert ? <Alert onClose={() => {
                        setSuccessAlert(false)
                    }} severity='success'>{successContent}</Alert> : <></>}

                    <Box component="form" sx={{mt: 3, marginTop: 10}}>
                        <Grid container spacing={5}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-password">Current Password</InputLabel>
                                    <OutlinedInput
                                        required
                                        fullWidth
                                        type={values.showPassword ? 'text' : 'password'}
                                        onChange={updateOldPassword}
                                        // error={passwordError}
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
                                        {oldPasswordError && "Invalid password, password should be 6 characters or more"}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                                    <OutlinedInput
                                        required
                                        fullWidth
                                        type={values.showPassword ? 'text' : 'password'}
                                        onChange={updateNewPassword}
                                        // error={passwordError}
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
                                        {newPasswordError && "Invalid password, password should be 6 characters or more"}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Button
                                fullWidth
                                onClick={() => handleChangePassword()}
                                variant="contained"
                                sx={{mt: 3, mb: 2}}>
                                Change Password
                            </Button>

                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Link href={'/profile/' + Cookies.get('userId')} variant="body2">
                                Change profile
                            </Link>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </div>




    );
}
export default ChangePassword;