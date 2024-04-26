/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from "react"
import { Context } from './Context';
import { useParams, NavLink } from "react-router-dom";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
import Chats from "./Chats";
import Bdays from "./Bdays";
import Friends from "./Friends";
import PostCard from "./PostCard";

function UserProfile() {
    const { user, setUser, userpage, setUserpage, setUserposts, setChat, setMessages, navigate } = useContext(Context);
    let { username } = useParams();
    
    useEffect(() => {
        if (user.username === username) {
            setUserpage(user)
        } else {
            fetch(`/api/search_users/${username}`).then((resp) => {
                if (resp.status === 200) {
                    resp.json().then((userList) => {
                        setUserpage(userList[0])
                    })
                }
            })
        }
        fetch(`/api/search_posts/${username}`).then((resp) => {
            if (resp.status === 200) {
                resp.json().then((postList) => {
                    setUserposts(postList)
                })
            }
        })
    }, [username, navigate])

    function handlePostFormClick() {
        const overlay = document.querySelector('.overlay')
        const main = document.querySelector('main')
        const postForm = document.querySelector('.post-form')
        overlay.style.display = 'flex'
        postForm.style.display = 'block'
        main.style.filter = 'brightness(40%)'
    }

    function handleAddFriend() {
        fetch('/api/friends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user1_id: user.id, user2_id: userpage.id})
        }).then((resp) => {
            if (resp.status === 200) {
                resp.json().then((u) => {
                    setUser(u)
                })
            }
        })
    }

    function handleAddChat() {
        fetch('/api/chats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user1_id: user.id, user2_id: userpage.id})
        }).then((resp) => {
            if (resp.status === 200) {
                resp.json().then((obj) => {
                    setUser(obj['u'])
                    setChat(obj['new_chat'])
                    setMessages([...obj['new_chat'].messages])
                })
            }
        })
    }

    if (userpage) {
        return (
            <>
                <div className="banner text">
                    {userpage ? <img src={`/api${userpage.banner_pic}`} /> : null}
                </div>
                <div className="about text">
                    <div className="basic_info">
                        {userpage ? <img src={userpage.profile_pic ? `/api${userpage.profile_pic}` : no_pic} /> : null}
                        <div className="name_and_buttons">
                            {userpage ? <h1>{userpage.username}</h1> : null}
                            {user.friendships.map((u) => u.id).includes(userpage.id) ? null : <button onClick={handleAddFriend}>Add Friend</button>}
                            {user.chats.map((u) => u.id).includes(userpage.id) ? null : <button onClick={handleAddChat}>Start Chat</button>}
                        </div>
                    </div>
                    <div className="extra_info">
                        <p>Joined: {}</p>
                        <p>Friends: {userpage ? userpage.friendships.length - 1 : null}</p>
                        <p>Posts: {userpage ? userpage.posts.length : null}</p>
                        <p>Relationship: {}</p>
                    </div>
                    <div className="about_me">
                        {userpage ? <div><h2>About me:</h2><p>Hi, asjdkflsdkfjskdlfksdjfklsdkfjsdklfjksdjf  sdjfk sdfjsdklf jsdkfls dksdjkfsdjkf sdkfjks dfrsd fksdlfksdkfsl dsjkld sdj fsjdkfskd sjd fklsd fjskdf skdlf sdkfls dkfls dfj sdkfjksd fjskdlfsjdfk sdkf skdjf ksdjfksldf s dfk sdklf sdklfj skldj fkls dlkf skldfjskd flksd klfjsdklfj skldfjl</p></div> : null}
                    </div>
                </div>
                <div className="mainPage">
                    <div className="leftPanel">
                        <div className="bdays text">
                            <h3>Birthdays</h3>
                            <Bdays />
                        </div>
                        <div className="friends text">
                            <h3>Friends</h3>
                            <Friends />
                        </div>
                    </div>
                    <div className="center">
                        {userpage && user.username === userpage.username ? 
                        <div className="card createPostDiv">
                            <NavLink to={`/${user.username}`}><img src={user.profile_pic ? `/api${user.profile_pic}` : no_pic} className="profile-pic" alt="profile pic" /></NavLink>
                            <button onClick={handlePostFormClick} className="creatPostButton">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}, create a post!</button>
                        </div> : null}
                        <div className="feed">
                            <PostCard />
                        </div>
                    </div>
                    <div className="rightPanel">
                        <div className="chats text">
                            <h3>Chats</h3>
                            <Chats />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default UserProfile