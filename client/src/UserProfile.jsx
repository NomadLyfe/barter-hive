import { useEffect, useContext } from "react"
import { Context } from './Context';
import { useParams, NavLink } from "react-router-dom";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
import Chats from "./Chats";
import Bdays from "./Bdays";
import Friends from "./Friends";

function UserProfile() {
    const { user, userpage, setUserpage, currdate, userposts, setUserposts } = useContext(Context);
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
    }, [])

    useEffect(() => {
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

    let renderedPostList = null
    if (userposts) {
        renderedPostList = userposts.map((post, i) => {
            let renderedCommentList = null
            if (post.comments) {
                renderedCommentList = post.comments.map((comment, j) => {
                    return (
                        <div className="text comment_obj" key={j}>
                            <div className="user_and_comment">
                                <NavLink to={`/${comment.user.username}`}><img src={comment.user.profile_pic ? comment.user.profile_pic : no_pic} className="profile-pic" alt="user-pic" /></NavLink>
                                <div className="comment">{comment.content}</div>
                            </div>
                            <div className="comment_likes"><button>like</button>{comment.likes} likes</div>
                        </div>
                    )
                })
            }
            return (
                <div className="card" key={i}>
                    <div className="user_and_post_owner">
                        <NavLink to={`/${userpage.username}`}><img src={userpage.profile_pic ? userpage.profile_pic : no_pic} className="profile-pic" alt="user-pic" /></NavLink>
                        <h2 className="text">{userpage.username}</h2>
                    </div>
                    <div className="media">

                    </div>
                    <p className="text post_str">{post.str_content}</p>
                    <div className="stats text">
                        <div className="endorses-num">{} wants</div>
                        <div className="renounces-num">{} passes</div>
                        <div className="comments-num">{} comments</div>
                    </div>
                    <div className="buttons text">
                        <button>Want</button>
                        <button>Pass</button>
                        <button>Comment</button>
                        <button>Share</button>
                    </div>
                    <div className="comments">{post.comments.at(0) ? renderedCommentList : <span className="no_comments text">No comments</span>}</div>
                </div>
            )
        })
    }
    
    return (
        <>
            <div className="banner text">
                {userpage ? <img src={userpage.banner_pic} /> : null}
            </div>
            <div className="about text">
                <p>Joined: {}</p>
                <p>Friends: {userpage ? userpage.friendships.length - 1 : null}</p>
                <p>Posts: {userpage ? userpage.posts.length : null}</p>
                <p>Relationship: {}</p>
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
                        <NavLink to={`/${user.username}`}><img src={user.profile_pic ? user.profile_pic : no_pic} className="profile-pic" alt="profile pic" /></NavLink>
                        <button onClick={handlePostFormClick} className="creatPostButton">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}, create a post!</button>
                    </div> : null}
                    <div className="feed">
                        {renderedPostList ? renderedPostList : <h2 className="text"><br /><br />You don't have any posts!</h2>}
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

export default UserProfile