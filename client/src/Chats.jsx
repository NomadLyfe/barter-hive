import { useContext } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
import './css files/Chats.css'

function Chats() {
    const { user } = useContext(Context)

    let renderedchats = null
    if (user) {
        const chats = [...user.chats]
        const chat_ids = chats.map(u => u.id)
        chats.splice(chat_ids.indexOf(user.id), 1)
        renderedchats = chats.map((chatUser, i) => {
            return (
                <NavLink className="friend" key={i} to={`/${chatUser.username}`}>
                    <img src={chatUser.profile_pic ? chatUser.profile_pic : no_pic} className="profile-pic" alt="profile pic" />
                    <div>{chatUser.username}</div>
                </NavLink>
            )
        })
    }

    return(
        <>
            <div className="chatusers">{renderedchats}</div>
            <div className="chatboxwrapper">
                <h3>Chat Box</h3>
                <div className="chatbox">
                    <div className="messages">
                        {/* {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender}`}>
                            {message.text}
                        </div>
                        ))} */}
                    </div>
                    <div className="input">
                        <input
                        type="text"
                        placeholder="Type your message..."
                        // value={newMessage}
                        // onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button >Send</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chats