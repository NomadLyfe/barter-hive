import { useContext } from "react"
import { Context } from './Context';
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'

function UserProfile() {
    const { user, inactivityCount, posts } = useContext(Context)

    return (
        <>

        </>
    )
}

export default UserProfile