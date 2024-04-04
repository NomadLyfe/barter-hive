import { useEffect, useContext } from "react"
import { Context } from './Context';
import { useParams, NavLink } from "react-router-dom";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
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

    let renderedbdays = []
    if (user) {
        const friends = [...user.friendships]
        const friend_ids = friends.map(u => u.id)
        friends.splice(friend_ids.indexOf(user.id), 1)
        renderedbdays = friends.map((friend, i) => {
            let bday = new Date(friend.bday)
            if (bday.getMonth() == currdate.getMonth() && bday.getDay() == currdate.getDay()) {
                return (
                    <div className="bday" key={i}>
                        <div>It is {friend.username}</div>
                    </div>
                )
            }
        })
    }
    
    return (
        <>
            <div className="banner text"><img src="" /></div>
            <div className="about text">2</div>
            <div className="mainPage">
                <div className="leftPanel">
                    <div className="messages text">
                        messages?
                    </div>
                </div>
                <div className="center">
                    <div className="feed">{renderedPostList}</div>
                </div>
                <div className="rightPanel">
                    <div className="bdays text">
                        <h3>Birthdays</h3>
                        {renderedbdays[0] ? renderedbdays : <div className="no_bday">No Birthdays</div>}
                    </div>
                    <div className="friends text">
                        <h3>Friends</h3>
                        <Friends />
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfile