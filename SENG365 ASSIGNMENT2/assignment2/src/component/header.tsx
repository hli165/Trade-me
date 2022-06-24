
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {
    Link,
    Alert,
    Avatar,
    Box, Button,
    Badge, Menu, MenuItem,
    Container,
    FormControl,
    Grid, IconButton, InputAdornment,
    InputLabel, OutlinedInput,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
// @ts-ignore
import Cookies from 'js-cookie';
import {userLogOut} from "../API/UserAccountService";
import {useNavigate} from "react-router-dom";


const Header = () => {
    const navigater = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = async () => {
        await userLogOut()
        console.log(Cookies.get('userId'))
        console.log(Cookies.get('userToken'))

        navigater('/login')
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem component={Link} href={"/profile/" + Cookies.get('userId')}>Profile</MenuItem>
            <MenuItem onClick={() => handleLogOut()} href={"/login"}>Log out</MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Trade you
                    </Typography>

                    <Button
                        color="inherit"
                        href="/home"
                    >
                        Auctions
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button color="inherit" href="/myAuctions">My Auctions</Button>
                    <Button color="inherit" href="/login">Login</Button>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </Box>
    );
}

export default Header;