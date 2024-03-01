import { useEffect, useContext } from 'react';
import { Routes, Route } from "react-router-dom";
import './css files/App.css';
import Login from './Login';
import Signup from './Signup'
import { Context } from './Context';
import NavBar from './NavBar';
import Home from './Home';

function App() {
    const { user, setUser, navigate, inactivityCount, setInactivityCount, setIsActive } = useContext(Context)

    useEffect(() => {
        const interval = setInterval(() => {
            setInactivityCount(inactivityCount + 1)
        }, 1000);
        if (inactivityCount < 300) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
        return () => clearInterval(interval)

    }, [inactivityCount])


    function resetTimer(e) {
        setInactivityCount(0)
    }

    if (!user) {
        return (
            <>
                <Routes>
                    <Route path='/login?' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                </Routes>
            </>
        )
    }

    return (
        <>
            <main onMouseMove={resetTimer}>
                <NavBar />
                <Routes>
                    <Route exact path='/:username' element={<Home />} />
                </Routes>
            </main>
        </>
    )
}

export default App
