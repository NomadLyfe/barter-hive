import { useContext } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'

function Friends() {
    const { user } = useContext(Context)

    let renderedFriendList = null
    if (user) {
        const friends = [...user.friendships]
        const friend_ids = friends.map(u => u.id)
        friends.splice(friend_ids.indexOf(user.id), 1)
        renderedFriendList = friends.map((friend, i) => {
            return (
                <NavLink className="friend" key={i} to={`/${friend.username}`}>
                    <img src={friend.profile_pic ?`http://localhost:5555/${friend.profile_pic}` : no_pic} className="profile-pic" alt="profile pic" />
                    <div>{friend.username}</div>
                </NavLink>
            )
        })
    }

    return (
        <>
            {renderedFriendList}
        </>
    )
}

export default Friends