import { useContext } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
import Friends from "./Friends";
import Bdays from "./Bdays";
import Chats from "./Chats";

function Home() {
    const { user, showingposts } = useContext(Context)

    function handlePostFormClick() {
        const overlay = document.querySelector('.overlay')
        const main = document.querySelector('main')
        const postForm = document.querySelector('.post-form')
        overlay.style.display = 'flex'
        postForm.style.display = 'block'
        main.style.filter = 'brightness(40%)'
    }
    let renderedPostList = null
    if (showingposts[0]) {
        renderedPostList = showingposts.map((post, i) => {
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
                        <NavLink to={`/${post.user.username}`}><img src={post.user.profile_pic ? post.user.profile_pic : no_pic} className="profile-pic" alt="user-pic" /></NavLink>
                        <h2 className="text">{post.user.username}</h2>
                    </div>
                    <div className="media">

                    </div>
                    <p className="text post_str">{post.str_content}</p>
                    <div className="stats text">
                        <div className="endorses-num">{post.wants.length} wants</div>
                        <div className="renounces-num">{post.passes.length} passes</div>
                        <div className="comments-num">{post.comments.length} comments</div>
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
            <div className="mainPage">
                <div className="leftPanel">
                    <div className="messages text">
                        messages?
                        <Chats />
                    </div>
                </div>
                <div className="center">
                    <div className="text">filters?</div>
                    <div className="card createPostDiv">
                        <NavLink to={`/${user.username}`}><img src={user.profile_pic ? user.profile_pic : no_pic} className="profile-pic" alt="profile pic" /></NavLink>
                        <button onClick={handlePostFormClick} className="creatPostButton">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}, create a post!</button>
                    </div>
                    <div className="feed">
                        {renderedPostList}
                        <div id="loadingcard" className="card">
                            <div className="user_and_post_owner">
                                <img src={no_pic} className="profile-pic" alt="user-pic" />
                                <h2 className="text"></h2>
                            </div>
                            <div className="media">
                            </div>
                            <p className="text post_str">Loading...</p>
                            <div className="stats text">
                                <div className="endorses-num">0 wants</div>
                                <div className="renounces-num">0 passes</div>
                                <div className="comments-num">0 comments</div>
                            </div>
                            <div className="buttons text">
                                <button>Want</button>
                                <button>Pass</button>
                                <button>Comment</button>
                                <button>Share</button>
                            </div>
                            <div className="comments"><span className="no_comments text">No comments</span></div>
                        </div>
                    </div>
                </div>
                <div className="rightPanel">
                    <div className="bdays text">
                        <h3>Birthdays</h3>
                        <Bdays />
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

export default Home