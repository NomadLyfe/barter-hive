import { useContext } from "react"
import { Context } from './Context';
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'

function Friends() {
    const { user, setUser, navigate } = useContext(Context)

    function handleHover(e) {
        const button = e.currentTarget.querySelector('button');
        if (button) {
            button.style.display = !button.style.display || button.style.display === 'none' ? 'block' : 'none';
        }
    }

    function handleDeleteFriend(e) {
        const result = window.confirm(`Are you sure you want to delete ${e.target.parentNode.children[1].innerHTML} from your friends list?`);
        if (result) {
            fetch(`/api/friend/${e.target.parentNode.id}/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((data) => {
                        console.log(data)
                        setUser(data)
                    })
                }
            })
        }
    }

    function handleFriendClick(e, u) {
        if (e.target.innerHTML != '\u2715') {
            navigate(`/${u}`)
        }
    }

    let renderedFriendList = null
    if (user) {
        const friends = [...user.friendships]
        const friend_ids = friends.map(u => u.id)
        friends.splice(friend_ids.indexOf(user.id), 1)
        renderedFriendList = friends.map((friend, i) => {
            return (
                <a id={`friend${friend.id}`} className="friend" key={i} onClick={(e) => {handleFriendClick(e, friend.username)}} onMouseOver={handleHover} onMouseOut={handleHover}>
                    <img src={friend.profile_pic ?`http://localhost:5555/${friend.profile_pic}` : no_pic} className="profile-pic" alt="profile pic" />
                    <div>{friend.username}</div>
                    <button onClick={handleDeleteFriend}>{'\u2715'}</button>
                </a>
            )
        })
    }

    return (
        <div className="friends_wrapper">
            {renderedFriendList}
        </div>
    )
}

export default Friends