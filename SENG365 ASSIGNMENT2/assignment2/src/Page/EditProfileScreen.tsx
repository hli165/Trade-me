import {
    Box,
    Container,
    Card,
    Avatar,
    Grid,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput, InputAdornment, IconButton, FormHelperText, Button, Link, styled, Alert
} from "@mui/material";
import React from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import {useNavigate, useParams} from "react-router-dom";
// @ts-ignore
import Cookies from 'js-cookie';
import axios from "axios";
import {editUser, getCurrentUser} from "../API/UserAccountService";
import {deleteUserImage, getUserImage, uploadUserImage} from "../API/UserImageService";
import Header from "../component/header";

const Profile = () => {
    const navigater = useNavigate();
    const {id} = useParams();
    const [user, setUser] = React.useState<user>({
        authToken: "",
        email: "",
        firstName: "",
        imageFilename: "",
        lastName: "",
        password: "",
        id:0})

    const loggedUserId = Cookies.get("userId");


    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [email, setEmail] = React.useState("")

    const [firstNameError, setFirstNameError] = React.useState(false);
    const [lastNameError, setLastNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);

    const [firstNameInput, disableFirstNameInput] = React.useState(true)
    const [lastNameInput, disableLastNameInput] = React.useState(true)
    const [emailInput, disableEmailInput] = React.useState(true)
    const [imageInput, disableImageInput] = React.useState(true)


    const [hiddenEditButton, setHiddenEditButton] = React.useState(false)
    const [hiddenSaveButton, setHiddenSaveButton] = React.useState(true)
    const [hiddenImageButton, setHiddenImageButton] = React.useState(true)
    const [hiddenDeleteImage, setHiddenDeleteImage] = React.useState(true)

    const [profileImage, setProfileImage] = React.useState(null)
    const [imageSrc, setImageSrc] = React.useState("")

    const [alert, setAlert] = React.useState(false);
    const [alertContent, setAlertContent] = React.useState('');
    const [successAlert, setSuccessAlert] = React.useState(false);
    const [successContent, setSuccessContent] = React.useState('');

    const acceptedFileTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']


    React.useEffect(() => {
        const getUser = async () => {
            if (Cookies.get('userId') !== id) {
                navigater("/home")
                return;
            }
            const response = await getCurrentUser(Cookies.get('userId'))
            const image = await getUserImage(Cookies.get('userId'))
            if (response.status !== 200) {
                navigater("/login")
            } else {
                setUser(response.data)
                setFirstName(response.data.firstName)
                setLastName(response.data.lastName)
                setEmail(response.data.email)
                setImageSrc(image)
            }
        }
        getUser()
    }, [])



    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    const updateFirstName = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setFirstName(event.target.value)}
    const updateLastName = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setLastName(event.target.value)}
    const updateEmail = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value)}

    const updateProfileImage = async (e: any) => {
        setProfileImage(e.target.files[0])
        console.log(e.target.files[0])
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


    const handleEdit = () => {
        disableEmailInput(false);
        disableFirstNameInput(false)
        disableLastNameInput(false)
        disableImageInput(false)

        setHiddenEditButton(true)
        setHiddenSaveButton(false)
        setHiddenImageButton(false)
        setHiddenDeleteImage(false)

        setSuccessAlert(false)
        console.log(Cookies.get('userToken'))

    }


    const handleDeleteImage = async () => {
        const deleteResponse = await deleteUserImage(Cookies.get('userId'))
        if (deleteResponse === 403) {
            setAlert(true)
            setAlertContent("You cannot edit other user")
            return;
        }
        if (deleteResponse === 404) {
            setAlert(true)
            setAlertContent("You cannot delete your default image")
            return;
        }
        if (deleteResponse === 200) {
            setSuccessAlert(true)
            setSuccessContent("Image delete successfully")
            setImageSrc("")
        }
    }

    const handleSave = async () => {
        setAlert(false)
        setSuccessAlert(false)
        setFirstNameError(false)
        setLastNameError(false)
        setEmailError(false)

        if (firstName === "" || firstName.length > 64) {
            setFirstNameError(true)
            setAlert(true)
            setAlertContent("Invalid first name input")
            return;
        }
        if (lastName === "" || lastName.length > 64) {
            setLastNameError(true)
            setAlert(true)
            setAlertContent("Invalid last name input")
            return;
        }
        const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regexEmail.test(email)) {
            setEmailError(true)
            setAlert(true)
            setAlertContent("Email must be like 'example@email.com'")
            return;
        }
        if (email.length > 128) {
            setEmailError(true)
            setAlert(true)
            setAlertContent("Invalid Email")
            return
        }
        const response = await editUser(Cookies.get('userId'), firstName, lastName, email)
        if (response === 404) {
            setAlert(true)
            setAlertContent('User Not Found, please try it again')
            return;
        }
        if (response === 403) {
            setAlert(true)
            setAlertContent("You are not able to edit this user")
            return;
        }
        if (response === 400) {
            setAlert(true)
            setAlertContent("Invalid input")
            return
        }
        if (response === 500) {
            setAlert(true)
            setAlertContent("Internal Server Error, please try it again")
            return
        }
        if (response === 200) {
            if (profileImage !== undefined && profileImage !== null) {
                const uploadImageResponse = await uploadUserImage(profileImage, Cookies.get("userId"))
                if (uploadImageResponse !== 201) {
                    setAlert(true)
                    setAlertContent("Unable to upload image, please try it again")
                    return
                }
            }
        disableEmailInput(true);
        disableFirstNameInput(true)
        disableLastNameInput(true)
        disableImageInput(true)

        setHiddenEditButton(false)
        setHiddenSaveButton(true)
        setHiddenImageButton(true)
        setHiddenDeleteImage(true)

        setSuccessAlert(true)
        setSuccessContent("Update successfully!")

        }
    }

    const Input = styled('input')({
        display: 'none',
    });

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
                    <Avatar sx={{width: 140, height: 140}} src={imageSrc}/>

                    <Typography component="h1" variant="h4">
                        Edit Profile
                    </Typography>

                    {!hiddenImageButton &&
                        <label htmlFor="contained-button-file">
                            <Input accept=".jpg,.jpeg,.png,.gif" id="contained-button-file" type="file" onChange={async (e) => await updateProfileImage(e)} />
                            <Button variant="contained"
                                    component="span"
                            >
                                Upload Image
                            </Button>
                            - ▪ Image (JPEG, PNG, or GIF) need to provide
                        </label>
                    }
                    {
                    !hiddenDeleteImage &&
                    <Button onClick={() => handleDeleteImage()}
                            variant="contained"
                            component="span"
                            color="error" >
                        Delete Image
                    </Button>
                    }

                    {alert ? <Alert onClose={() => {
                        setAlert(false)
                    }} severity='error'>{alertContent}</Alert> : <></>}

                    {successAlert ? <Alert onClose={() => {
                        setSuccessAlert(false)
                    }} severity='success'>{successContent}</Alert> : <></>}

                    <Box component="form" sx={{mt: 3, marginTop: 10}}>
                        <Grid container spacing={5}>
                            <Grid item xs={12}>
                                <TextField
                                    name="firstName"
                                    value={firstName}
                                    required
                                    fullWidth
                                    label="First Name"
                                    autoFocus
                                    onChange={updateFirstName}
                                    error={firstNameError}
                                    helperText={firstNameError && "Incorrect entry"}
                                    disabled={firstNameInput}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    value={lastName}
                                    label="Last Name"
                                    name="lastName"
                                    onChange={updateLastName}
                                    error={lastNameError}
                                    helperText={lastNameError && "Incorrect entry"}
                                    disabled={lastNameInput}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    value={email}
                                    label="Email Address"
                                    name="email"
                                    error={emailError}
                                    helperText={emailError && "Incorrect entry"}
                                    onChange={updateEmail}
                                    disabled={emailInput}
                                />
                            </Grid>
                        </Grid>
                        {!hiddenEditButton &&
                        <Button
                            fullWidth
                            onClick={() => handleEdit()}
                            variant="contained"
                            sx={{mt: 3, mb: 2}}>
                            Edit Profile
                        </Button>
                        }
                        {!hiddenSaveButton &&
                            <Button
                                fullWidth
                                onClick={() => handleSave()}
                                variant="contained"
                                sx={{mt: 3, mb: 2}}>
                                Save
                            </Button>
                            }
                        <Grid container justifyContent="flex-end">
                            <Link href={'/changePassword/' + Cookies.get('userId')} variant="body2">
                                Change password
                            </Link>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </div>




    );
}
export default Profile;