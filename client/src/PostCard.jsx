/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
import Comments from "./Comments.jsx";
import PostMedia from "./PostMedia.jsx";

function PostCard() {
    const { user, userpage, userposts, setUserposts } = useContext(Context);

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

    const formSchema = yup.object().shape({
        comment: yup.string().max(200)
    });

    const formik = useFormik({
        initialValues: {
            comment: '',
            user_id: user.id,
            post_id: null,
            userpage: true,
            userpage_id: null
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            values.userpage_id = userpage ? userpage.id : null
            console.log(values)
            fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((posts) => {
                        setUserposts(posts)
                    });
                }
            });
            formik.resetForm();
        }
    });

    function handleCommentSubmit(e) {
        e.preventDefault()
        formik.setFieldValue('post_id', parseInt(e.target.parentNode.id))
        formik.handleSubmit()
    }

    let renderedPostList = null
    if (userposts && userpage) {
        renderedPostList = userposts.map((post, i) => {
            let renderedCommentList = null
            if (post.comments) {
                renderedCommentList = post.comments.map((comment, j) => {
                    return (
                        <Comments key={j} comment={comment} />
                    )
                })
            }

            return (
                <div id={post.id} className="card" key={i}>
                    <div className="user_and_post_owner">
                        <NavLink to={`/${userpage.username}`}><img src={userpage.profile_pic ? `http://localhost:5555/${userpage.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" /></NavLink>
                        <h2 className="text">{userpage.username}</h2>
                    </div>
                    <PostMedia post={post} />
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
                    <form className="newCommentFormWrapper" onSubmit={handleCommentSubmit}>
                        <img src={user.profile_pic ? `http://localhost:5555/${user.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" />
                        <input placeholder="White a comment..." name="comment" onChange={formik.handleChange} value={formik.values.comment} />
                        <button type="submit">Send</button>
                        <button type="reset" onClick={handleCommentClick}>{'\u2715'}</button>
                    </form>
                </div>
            )
        })
    }

    return (
        <>{renderedPostList ? renderedPostList : <h2 className="text"><br /><br />You don{"'"}t have any posts!</h2>}</>
    )
}

export default PostCard