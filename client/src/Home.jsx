import { useContext } from "react"
import { Context } from './Context';
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'

function Home() {
    const { user, inactivityCount, setInactivityCount } = useContext(Context)

    function handlePostFormClick() {
        const overlay = document.querySelector('.overlay')
        const main = document.querySelector('main')
        const postForm = document.querySelector('.post-form')
        overlay.style.display = 'flex'
        postForm.style.display = 'block'
        main.style.filter = 'brightness(40%)'
    }

    return (
        <>
            <div className="mainPage">
                <div className="leftPanel">
                    <div className="buttons text">
                        1
                    </div>
                    <div className="shortcuts text">
                        2
                    </div>
                </div>
                <div className="center">
                    <div>something</div>
                    <div className="card createPostDiv">
                        <img src={user.profile_pic ? user.profile_pic : no_pic} className="profile-pic" alt="profile pic" />
                        <button onClick={handlePostFormClick} className="creatPostButton">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}, create a post!</button>
                    </div>
                    <div className="feed">
                        <div className="card">
                            <button onClick={() => setInactivityCount((inactivityCount) => inactivityCount + 1)}>
                                count is {inactivityCount}
                            </button>
                            <p className="text">
                                Edit <code>src/App.jsx</code> and save to test HMR
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rightPanel">
                    <div className="suggestion text">
                        1
                    </div>
                    <div className="bdays text">
                        2
                    </div>
                    <div className="friends text">
                        3
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home