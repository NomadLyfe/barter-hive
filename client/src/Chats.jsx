import { useContext } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'

function Chats() {
    const { user } = useContext(Context)

    let renderedchats = null
    if (user) {
        const chats = [...user.chats]
        renderedchats = chats.map((chat, i) => {
            return (
                <div key={i}>
                    Chat between {chat.user1_id} and {chat.user2_id} in {chat.id}
                </div>
            )
        })
    }

    return(
        <>
            {renderedchats}
        </>
    )
}

export default Chats