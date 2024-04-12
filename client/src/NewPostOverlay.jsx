import { useContext } from 'react';
import { Context } from './Context';
import upload from './images/upload.svg'
import no_pic from './images/no-profile-pic.png'

function NewPostOverlay() {
    const { user, setInactivityCount } = useContext(Context)

    function resetTimer() {
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

    return (
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
    )
}

export default NewPostOverlay