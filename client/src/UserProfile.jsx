/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from "react"
import { Context } from './Context';
import { useParams, NavLink } from "react-router-dom";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
import Chats from "./Chats";
import Bdays from "./Bdays";
import Friends from "./Friends";

function UserProfile() {
    const { user, setUser, userpage, setUserpage, userposts, setUserposts, setChat, setMessages } = useContext(Context);
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
    }, [username])

    function handlePostFormClick() {
        const overlay = document.querySelector('.overlay')
        const main = document.querySelector('main')
        const postForm = document.querySelector('.post-form')
        overlay.style.display = 'flex'
        postForm.style.display = 'block'
        main.style.filter = 'brightness(40%)'
    }

    function handleWantClick(e) {
        const post_id = e.target.parentNode.parentNode.id
        const wants = e.target.parentNode.parentNode.children[3].children[0].firstChild.textContent
        console.log(post_id, wants)
        fetch('/api/wants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_id: user.id, post_id: post_id})
        }).then((resp) => {
            if (resp.status === 200) {
                resp.json().then(() => {
                    e.target.parentNode.parentNode.children[3].children[0].firstChild.textContent = `${parseInt(wants) + 1}`
                })
            }
        })
    }

    function handlePassClick(e) {
        const post_id = e.target.parentNode.parentNode.id
        const passes = e.target.parentNode.parentNode.children[3].children[1].firstChild.textContent
        fetch('/api/passes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_id: user.id, post_id: post_id})
        }).then((resp) => {
            if (resp.status === 200) {
                resp.json().then(() => {
                    e.target.parentNode.parentNode.children[3].children[1].firstChild.textContent = `${parseInt(passes) + 1}`
                })
            }
        })
    }

    function handleCommentClick(e) {
        if (e.target.parentNode.parentNode.children[6].style.display === '') {
            e.target.parentNode.parentNode.children[6].style.display = 'flex';
        } else {
            e.target.parentNode.parentNode.children[6].style.display = '';
        }
        
    }

    let renderedPostList = null
    if (userposts) {
        renderedPostList = userposts.map((post, i) => {
            let renderedCommentList = null
            if (post.comments) {
                renderedCommentList = post.comments.map((comment, j) => {
                    return (
                        <div className="text comment_obj" key={j}>
                            <div className="user_and_comment">
                                <NavLink to={`/${comment.user.username}`}><img src={comment.user.profile_pic ? `http://localhost:5555/${comment.user.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" /></NavLink>
                                <div className="comment">{comment.content}</div>
                            </div>
                            <div className="comment_likes"><button>like</button>{comment.likes} likes</div>
                        </div>
                    )
                })
            }
            return (
                <div id={post.id} className="card" key={i}>
                    <div className="user_and_post_owner">
                        <NavLink to={`/${userpage.username}`}><img src={userpage.profile_pic ? `http://localhost:5555/${userpage.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" /></NavLink>
                        <h2 className="text">{userpage.username}</h2>
                    </div>
                    <div className="media">

                    </div>
                    <p className="text post_str">{post.str_content}</p>
                    <div className="stats text">
                        <div className="wants-num"><span>{post.wants.length}</span> wants</div>
                        <div className="passes-num"><span>{post.passes.length}</span> passes</div>
                        <div className="comments-num"><span>{post.comments.length}</span> comments</div>
                    </div>
                    <div className="buttons text">
                        <button onClick={handleWantClick}>Want</button>
                        <button onClick={handlePassClick}>Pass</button>
                        <button onClick={handleCommentClick}>Comment</button>
                        {/* <button>Share</button> */}
                    </div>
                    <div className="comments">{post.comments.at(0) ? renderedCommentList : <span className="no_comments text">No comments</span>}</div>
                    <form className="newCommentFormWrapper">
                        <img src={user.profile_pic ? `http://localhost:5555/${user.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" />
                        <input placeholder="White a comment..."  />
                        <button>x</button>
                    </form>
                </div>
            )
        })
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
                    {userpage ? <img src={`http://localhost:5555/${userpage.banner_pic}`} /> : null}
                </div>
                <div className="about text">
                    <div className="basic_info">
                        {userpage ? <img src={userpage.profile_pic ? `http://localhost:5555/${userpage.profile_pic}` : no_pic} /> : null}
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
                            <NavLink to={`/${user.username}`}><img src={user.profile_pic ? `http://localhost:5555/${user.profile_pic}` : no_pic} className="profile-pic" alt="profile pic" /></NavLink>
                            <button onClick={handlePostFormClick} className="creatPostButton">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}, create a post!</button>
                        </div> : null}
                        <div className="feed">
                            {renderedPostList ? renderedPostList : <h2 className="text"><br /><br />You don{"'"}t have any posts!</h2>}
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