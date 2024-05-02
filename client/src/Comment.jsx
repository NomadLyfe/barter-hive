/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'

function Comment({ comment, postId, setCurrentPost }) {
    const { user } = useContext(Context)
    const [editMode, setEditMode] = useState(false)
    const [currentComment, setCurrentComment] = useState(comment)

    useEffect(() => {
        setCurrentComment(comment)
    }, [user])

    function handleLikeClick(e) {
        const id = parseInt(e.target.parentNode.id)
        fetch('/api/comments', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'id': id})
        }).then((resp) => {
            if (resp.ok) {
                resp.json().then((editedComment) => {
                    setCurrentComment(editedComment)
                });
            }
        });
    }

    function handleDeleteComment(e) {
        const result = window.confirm(`Are you sure you want to delete your comment?`);
        const comment_id = parseInt(e.target.parentNode.parentNode.parentNode.children[1].id)
        if (result) {
            fetch(`/api/comment/${comment_id}/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((editedPost) => {
                        setCurrentPost(editedPost)
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
            new_content: currentComment.content,
            id: null
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`/api/comments`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((editedComment) => {
                        setCurrentComment(editedComment)
                    });
                }
            });
        }
    });

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            formik.setFieldValue('id', parseInt(e.target.parentNode.parentNode.children[1].id))
            formik.handleSubmit()
            setEditMode(false)
        }
    }

    return (
        <div className="text comment_obj">
            <div className="user_and_comment">
                <NavLink to={`/${currentComment.user.username}`}><img src={currentComment.user.profile_pic ? `/api${currentComment.user.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" /></NavLink>
                {editMode ? <input name="new_content" className="comment text" value={formik.values.new_content} onChange={formik.handleChange} onKeyDown={handleKeyPress} /> : <div className="comment">{currentComment.content}</div>}
                {currentComment.user.id === user.id ? <div className="comment_button"><button onClick={handleDeleteComment}>{'\u2715'}</button><button onClick={handleEditButton}>{'\u270e'}</button></div> : null}
            </div>
            <div id={comment.id} className="comment_likes"><button onClick={handleLikeClick}>like</button><span>{currentComment.likes}</span> likes</div>
        </div>
    )
}


export default Comment