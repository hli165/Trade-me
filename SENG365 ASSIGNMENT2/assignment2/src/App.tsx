import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginScreen from "./Page/LoginScreen";
import RegisterScreen from "./Page/RegisterScreen";
import GetAllAuctions from "./Page/GetAllAuctions";
import Profile from "./Page/EditProfileScreen";
import Header from "./component/header";
import ChangePassword from "./Page/ChangePassword";
import {isUserLoggedIn} from "./API/UserAccountService";
import {Navigate} from "react-router-dom";
import MyAuctions from "./Page/MyAuctions";
import AuctionDetail from "./Page/AuctionDetail";
import ListAuction from "./Page/ListAuction";
import MyBidAuctions from "./Page/MyBidAuctions";
import EditAuction from "./Page/EditAuction";

function App() {

    const logIn = isUserLoggedIn();
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<GetAllAuctions/>} ></Route>
                        <Route path="/login" element={!logIn ? <LoginScreen/> : <Navigate to='/home'/>}/>
                        <Route path="/register" element={!logIn ? <RegisterScreen/>: <Navigate to='/home'/>}/>
                        <Route path="/changePassword/:id" element={<ChangePassword/>}/>
                        <Route path="/profile/:id" element={logIn ? <Profile/> : <Navigate to='/login'/>}/>
                        <Route path="/myAuctions" element={logIn ? <MyAuctions/> : <Navigate to='/login'/>}/>
                        <Route path="/home" element={<GetAllAuctions/>}/>
                        <Route path="/listAuction" element={logIn ? <ListAuction/> : <Navigate to='/login'/>}/>
                        <Route path="/myBidAuctions" element={logIn ? <MyBidAuctions/> : <Navigate to='/login'/>}/>
                        <Route path="/auction/:sellerId/:categoryId/:id" element={<AuctionDetail/>}/>
                        <Route path="/editAuction/:sellerId/:categoryId/:categoryName/:id" element={logIn ? <EditAuction/> : <Navigate to='/login'/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}
export default App;