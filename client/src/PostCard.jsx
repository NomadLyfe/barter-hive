/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
import Comment from "./Comment";
import PostMedia from "./PostMedia";

function PostCard({ post }) {
    const { user, userposts } = useContext(Context)
    const [tooltip, setTooltip] = useState({ jsx: '', visible: false, x: 0, y: 0 });
    const [currentPost, setCurrentPost] = useState(post)

    useEffect(() => {
        setCurrentPost(post)
    }, [userposts])

    function handleWantClick() {
        fetch('/api/wants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_id: user.id, post_id: currentPost.id})
        }).then((resp) => {
            if (resp.status === 200) {
                resp.json().then((editedPost) => {
                    setCurrentPost(editedPost)
                })
            }
        })
    }

    function handlePassClick() {
        fetch('/api/passes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_id: user.id, post_id: currentPost.id})
        }).then((resp) => {
            if (resp.status === 200) {
                resp.json().then((editedPost) => {
                    setCurrentPost(editedPost)
                })
            }
        })
    }

    function handleCommentClick(e) {
        e.preventDefault();
        if (e.target.parentNode.parentNode.lastChild.style.display === '') {
            e.target.parentNode.parentNode.lastChild.style.display = 'flex';
        } else {
            e.target.parentNode.parentNode.lastChild.style.display = '';
        }
    }

    const formSchema = yup.object().shape({
        comment: yup.string().max(200)
    });

    const formik = useFormik({
        initialValues: {
            comment: '',
            user_id: user.id,
            post_id: null
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            formik.values.post_id = currentPost.id
            fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((editedPost) => {
                        setCurrentPost(editedPost)
                    });
                }
            });
            formik.resetForm();
        }
    });

    let renderedCommentList = null
    if (currentPost.comments) {
        renderedCommentList = currentPost.comments.map((comment, j) => {
            return (
                <Comment key={j} comment={comment} postId={currentPost.id} setCurrentPost={setCurrentPost} />
            )
        })
    }

    const handleMouseEnter = (e, attr) => {
        const rect = e.target.getBoundingClientRect();
        const cardParentRect = e.target.closest(".card").getBoundingClientRect();
        setTooltip({
            jsx: (currentPost[attr].length > 0 ? <>{currentPost[attr].slice(0, 5).map(a => <div key={a.id}>{a.user.username}</div>)}{currentPost[attr].length > 5 ? <div>...</div> : null}</> : <div>None</div>),
            visible: true,
            x: rect.left - cardParentRect.left + rect.width / 2,
            y: rect.top - cardParentRect.top,
        });
    };

    const handleMouseLeave = () => {
        setTooltip({ jsx: '', visible: false, x: 0, y: 0 });
    };

    return (
        <div id={currentPost.id} className="card">
            <div className="user_and_post_owner">
                <NavLink to={`/${currentPost.user.username}`}><img src={currentPost.user.profile_pic ? `/api${currentPost.user.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" /></NavLink>
                <h2 className="text">{currentPost.user.username}</h2>
            </div>
            <PostMedia post={currentPost} />
            {currentPost.type === 'Sale' ? <p className="text price_str">${currentPost.price.toFixed(2)}</p> : null}
            <p className="text post_str">{currentPost.str_content}</p>
            <div className="stats text">
                <div className="wants-num" onMouseEnter={(e) => handleMouseEnter(e, "wants")} onMouseLeave={handleMouseLeave}><span>{currentPost.wants.length}</span> wants</div>
                <div className="passes-num" onMouseEnter={(e) => handleMouseEnter(e, "passes")} onMouseLeave={handleMouseLeave}><span>{currentPost.passes.length}</span> passes</div>
                <div className="comments-num" onMouseEnter={(e) => handleMouseEnter(e, "comments")} onMouseLeave={handleMouseLeave}><span>{currentPost.comments.length}</span> comments</div>
            </div>
            <div className="buttons text">
                <button onClick={handleWantClick}>Want</button>
                <button onClick={handlePassClick}>Pass</button>
                <button onClick={handleCommentClick}>Comment</button>
                {/* <button>Share</button> */}
            </div>
            <div className="comments">{currentPost.comments.at(0) ? renderedCommentList : <span className="no_comments text">No comments</span>}</div>
            <form className="newCommentFormWrapper" onSubmit={formik.handleSubmit}>
                <img src={user.profile_pic ? `/api${user.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" />
                <input placeholder="White a comment..." name="comment" onChange={formik.handleChange} value={formik.values.comment} />
                <button type="submit">Send</button>
                <button type="reset" onClick={handleCommentClick}>{'\u2715'}</button>
            </form>
            {tooltip.visible ? (
                <div
                    className="tooltip"
                    style={{
                        top: tooltip.y,
                        left: tooltip.x,
                        transform: 'translate(0px, -100%)'
                    }}
                >
                    {tooltip.jsx}
                </div>
            ) : null}
        </div>
    )
}

export default PostCard