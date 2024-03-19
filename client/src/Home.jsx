import { useContext } from "react"
import { Context } from './Context';
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'

function Home() {
    const { user, inactivityCount, posts } = useContext(Context)

    function handlePostFormClick() {
        const overlay = document.querySelector('.overlay')
        const main = document.querySelector('main')
        const postForm = document.querySelector('.post-form')
        overlay.style.display = 'flex'
        postForm.style.display = 'block'
        main.style.filter = 'brightness(40%)'
    }
    let renderedPostList = null
    if (posts) {
        renderedPostList = posts.map((post, i) => {
            let renderedCommentList = 'No comments'
            if (post.comments) {
                renderedCommentList = post.comments.map((comment, j) => {
                    return (
                        <div className="text comment_obj" key={j}>
                            <div className="user_and_comment">
                                <img id="user_pic" src={comment.user.profile_pic ? comment.user.profile_pic : no_pic} className="profile-pic" alt="user-pic" />
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
                        <img id="user_pic" src={post.user.profile_pic ? post.user.profile_pic : no_pic} className="profile-pic" alt="user-pic" />
                        <h2 className="text">{post.user.username}</h2>
                    </div>
                    <div className="media">

                    </div>
                    <p className="text post_str">{post.str_content}</p>
                    <div className="stats text">
                        <div className="endorses-num">{post.endorse} endorses</div>
                        <div className="renounces-num">{post.renounce} renounces</div>
                        <div className="comments-num">{post.comments.length} comments</div>
                    </div>
                    <div className="buttons text">
                        <button>Endorse</button>
                        <button>Renounce</button>
                        <button>Comment</button>
                        <button>Share</button>
                    </div>
                    <div className="comments">{renderedCommentList}</div>
                </div>
            )
        })
    }

    return (
        <>
            <div className="mainPage">
                <div className="leftPanel">
                    <div className="buttons text">
                        1
                    </div>
                    <div className="shortcuts text">
                        2
                    </div>
                </div>
                <div className="center">
                    <div className="text">something</div>
                    <div className="card createPostDiv">
                        <img src={user.profile_pic ? user.profile_pic : no_pic} className="profile-pic" alt="profile pic" />
                        <button onClick={handlePostFormClick} className="creatPostButton">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}, create a post!</button>
                    </div>
                    <div className="feed">
                        {renderedPostList}
                    </div>
                </div>
                <div className="rightPanel">
                    <div className="suggestion text">
                        1
                    </div>
                    <div className="bdays text">
                        2
                    </div>
                    <div className="friends text">
                        3
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home