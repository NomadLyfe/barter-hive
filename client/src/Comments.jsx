/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'

function Comments({ comment }) {
    const { user, userpage, setUserposts } = useContext(Context);
    const [editMode, setEditMode] = useState(false)

    function handleLikeClick(e) {
        const id = parseInt(e.target.parentNode.id)
        fetch('/api/comments', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'id': id, 'userpage': true, 'userpage_id': userpage.id})
        }).then((resp) => {
            if (resp.ok) {
                resp.json().then((posts) => {
                    setUserposts(posts)
                });
            }
        });
    }

    function handleDeleteComment(e) {
        const result = window.confirm(`Are you sure you want to delete your comment?`);
        const comment_id = parseInt(e.target.parentNode.parentNode.parentNode.children[1].id)
        if (result) {
            fetch(`/api/comment/${comment_id}/${userpage.id}/${0}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((posts) => {
                        setUserposts(posts)
                    });
                }
            });
        }
    }

    function handleEditButton() {
        setEditMode(!editMode)
    }

    const formSchema = yup.object().shape({
        comment: yup.string().max(200)
    });

    const formik = useFormik({
        initialValues: {
            comment: comment.content,
            comment_id: null
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`/api/comment/${values.comment_id}/${userpage.id}/${0}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'comment_content': values.comment})
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((posts) => {
                        setUserposts(posts)
                    });
                }
            });
        }
    });

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            formik.setFieldValue('comment_id', parseInt(e.target.parentNode.parentNode.children[1].id))
            formik.handleSubmit()
            setEditMode(false)
        }
    }

    return (
        <div className="text comment_obj">
            <div className="user_and_comment">
                <NavLink to={`/${comment.user.username}`}><img src={comment.user.profile_pic ? `http://localhost:5555/${comment.user.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" /></NavLink>
                {editMode ? <input name="comment" className="comment text" value={formik.values.comment} onChange={formik.handleChange} onKeyDown={handleKeyPress} /> : <div className="comment">{comment.content}</div>}
                {comment.user.id === user.id ? <div className="comment_button"><button onClick={handleDeleteComment}>{'\u2715'}</button><button onClick={handleEditButton}>{'\u270e'}</button></div> : null}
            </div>
            <div id={comment.id} className="comment_likes"><button onClick={handleLikeClick}>like</button><span>{comment.likes}</span> likes</div>
        </div>
    )
}


export default Comments