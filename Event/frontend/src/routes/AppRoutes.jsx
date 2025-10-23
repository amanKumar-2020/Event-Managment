import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import EventPartnerRegister from '../pages/auth/EventPartnerRegister';
import EventPartnerLogin from '../pages/auth/EventPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import BottomNav from '../components/BottomNav';
import Createevent from '../pages/event-partner/Createevent';
import Profile from '../pages/event-partner/Profile';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<ChooseRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/event-partner/register" element={<EventPartnerRegister />} />
                <Route path="/event-partner/login" element={<EventPartnerLogin />} />
                <Route path="/" element={<><Home /><BottomNav /></>} />
                <Route path="/saved" element={<><Saved /><BottomNav /></>} />
                <Route path="/create-event" element={<Createevent />} />
                <Route path="/event-partner/:id" element={<Profile />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes;