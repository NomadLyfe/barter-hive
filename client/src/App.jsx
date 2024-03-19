import { useEffect, useContext } from 'react';
import { Routes, Route } from "react-router-dom";
import './css files/App.css';
import Login from './Login';
import Signup from './Signup'
import { Context } from './Context';
import NavBar from './NavBar';
import Home from './Home';
import upload from './images/upload.svg'
import no_pic from './images/no-profile-pic.png'

function App() {
    const { user, setUser, navigate, inactivityCount, setInactivityCount, setIsActive, setPosts } = useContext(Context)

    useEffect(() => {
        fetch('/api/check_session').then((resp) => {
            if (resp.status === 200) {
                resp.json().then((user) => setUser(user));
            }
        });

        fetch('/api/posts').then((resp) => {
            if (resp.status === 200) {
                resp.json().then((postList) => setPosts(postList))
            }
        });

    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setInactivityCount(inactivityCount + 1)
        }, 1000);

        inactivityCount < 300 ? setIsActive(true) : setIsActive(false);

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
                    <Route path='/login?' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                </Routes>
            </>
        )
    }

    return (
        <>
            <div className='overlay' onClick={handleOverlayClick} onMouseMove={resetTimer}>
                <div className="post-form">
                    <div className='createPostTitle'>
                        <h2>Create Post</h2>
                        <div></div>
                    </div>
                    <form>
                        <img src={user.profile_pic ? user.profile_pic : no_pic} className="profile-pic" alt="profile pic" />
                        <input type='text' name="queryTerm" placeholder='Search Barter Hive' />
                        <div className='image-drop' type='image' name="queryTerm" placeholder='Search Barter Hive'>
                            <img src={upload} alt='add' />
                            <h2><p>Add Photos and/or Videos</p></h2>
                            <p>or drag and drop</p>
                        </div>
                        <textarea type='text' name="queryTerm" placeholder='Search Barter Hive' />

                    </form>
                </div>
            </div>
            <main onMouseMove={resetTimer} onClick={handleMainClick}>
                <NavBar />
                <Routes>
                    <Route exact path='/:username' element={<Home />} />
                </Routes>
            </main>
        </>
    )
}

export default App
