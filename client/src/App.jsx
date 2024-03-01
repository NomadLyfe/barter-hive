import { useEffect, useContext } from 'react';
import { Routes, Route } from "react-router-dom";
import './css files/App.css';
import Login from './Login';
import Signup from './Signup'
import { Context } from './Context';
import NavBar from './NavBar';
import Home from './Home';
import upload from './images/upload.svg'

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

    function handleOverlayClick(e) {
        const overlay = document.querySelector('.overlay')
        if (e.target == overlay) {
            const main = document.querySelector('main')
            const postForm = document.querySelector('.post-form')
            postForm.style.display = ''
            overlay.style.display = ''
            main.style.filter = ''
        }
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
            <div className='overlay' onClick={handleOverlayClick}>
                <div className="post-form">
                    <div className='createPostTitle'>
                        <h2>Create Post</h2>
                        <div></div>
                    </div>
                    <form>
                        <input type='text' name="queryTerm" placeholder='Search Barter Hive' />
                        <div className='image-drop' type='image' name="queryTerm" placeholder='Search Barter Hive'>
                            <img src={upload} alt='add' />
                            <p><h2>Add Photos and/or Videos</h2></p>
                            <p>or drag and drop</p>
                        </div>
                        <textarea type='text' name="queryTerm" placeholder='Search Barter Hive' />

                    </form>
                </div>
            </div>
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
