/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from 'react';
import { Routes, Route } from "react-router-dom";
import './css files/App.css';
import Login from './Login';
import Signup from './Signup'
import { Context } from './Context';
import NavBar from './NavBar';
import Home from './Home';
import UserProfile from './UserProfile';
import Settings from './Settings';
import NewPostOverlay from './NewPostOverlay';

function App() {
    const { 
        user,
        inactivityCount,
        setInactivityCount,
        setCurrdate,
        setIsActive,
        navigate,
        setUser
    } = useContext(Context)

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch('/api/check_session').then((resp) => {
            if (resp.status === 200) {
                resp.json().then((user) => {
                    setUser(user)
                });
            } else {
                navigate(`/login`)
            }
        });
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setInactivityCount(inactivityCount + 1)
        }, 1000);

        inactivityCount < 300 ? setIsActive(true) : setIsActive(false);

        setCurrdate(new Date())

        return () => clearInterval(interval)

    }, [inactivityCount])

    function resetTimer() {
        setInactivityCount(0)
    }

    function handleMainClick(e) {
        const userPic = document.querySelector('#user_pic')
        const dropdown = document.querySelector('.user_dropdown')
        if (e.target != dropdown && e.target != userPic) {
            dropdown.style.display = ''
        } else if (e.target == userPic) {
            dropdown.style.display == '' ? dropdown.style.display = 'block' : dropdown.style.display = ''
        }   
    }

    if (!user) {
        return (
            <>
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route exact path='/signup' element={<Signup />} />
                </Routes>
            </>
        )
    }

    return (
        <>
            <NewPostOverlay />
            <main onMouseMove={resetTimer} onClick={handleMainClick}>
                <NavBar />
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route exact path='/settings' element={<Settings />} />
                    <Route path='/:username' element={<UserProfile />} />
                </Routes>
            </main>
        </>
    )
}

export default App
