/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
import Friends from "./Friends";
import Bdays from "./Bdays";
import Chats from "./Chats";

function Home() {
    const {
        user,
        navigate,
        posts,
        setPosts,
        offset,
        setOffset,
        scroll,
        setScroll
    } = useContext(Context)

    useEffect(() => {

        const handleScroll = () => {
            if (window.location.pathname === '/') {
                setScroll(window.scrollY)
            }
        }

        document.addEventListener('scroll', handleScroll)

        return () => {
            document.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        setOffset(() => 0)
        setScroll(() => 0)
        fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({offset: 0})
        }).then((resp) => {
            if (resp.status === 200) {
                resp.json().then((postList) => {
                    setOffset(offset + 5)
                    setPosts(postList)
                })
            }
        });
    }, [navigate])

    useEffect(() => {
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
            let controller = new AbortController()
            let signal = controller.signal
            fetch('/api/posts', {
                method: 'POST',
                signal: signal,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({offset: offset})
            }).then((resp) => {
                if (resp.status === 200) {
                    resp.json().then((postList) => {
                            setPosts(posts.concat(postList))
                            setOffset(offset + 5)
                            // console.log('5 more posts')
                    })
                }
            }).catch(err => {
                if (err.name === 'AbortError') {
                    console.log('Fetch request aborted')
                } else {
                    console.error('Error fetching data:', err)
                }
            })
            return () => controller.abort()
        }
    }, [scroll])

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

    function handleCommentClick(e) {
        e.preventDefault();
        if (e.target.parentNode.parentNode.children[6].style.display === '') {
            e.target.parentNode.parentNode.children[6].style.display = 'flex';
        } else {
            e.target.parentNode.parentNode.children[6].style.display = '';
        }
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

    const formSchema = yup.object().shape({
        comment: yup.string().max(200)
    });

    const formik = useFormik({
        initialValues: {
            comment: '',
            user_id: user.id,
            post_id: null,
            posts: null,
            userpage: false
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
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
                        setPosts(posts)
                    });
                }
            });
            formik.resetForm();
        }
    });

    function handleCommentSubmit(e) {
        e.preventDefault()
        formik.setFieldValue('post_id', parseInt(e.target.parentNode.id))
        formik.setFieldValue('posts', e.target.parentNode.parentNode.children.length - 1)
        formik.handleSubmit()
    }

    function handleLikeClick(e) {
        const id = parseInt(e.target.parentNode.id)
        fetch('/api/comments', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'id': id, 'posts': (e.target.parentNode.parentNode.parentNode.parentNode.parentNode.children.length - 1), 'userpage': false})
        }).then((resp) => {
            if (resp.ok) {
                resp.json().then((posts) => {
                    setPosts(posts)
                });
            }
        });
    }

    let renderedPostList = null
    if (posts[0]) {
        renderedPostList = posts.map((post, i) => {
            let renderedCommentList = null
            if (post.comments) {
                renderedCommentList = post.comments.map((comment, j) => {
                    return (
                        <div className="text comment_obj" key={j}>
                            <div className="user_and_comment">
                                <NavLink to={`/${comment.user.username}`}><img src={comment.user.profile_pic ? `http://localhost:5555/${comment.user.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" /></NavLink>
                                <div className="comment">{comment.content}</div>
                                <div className="comment_button"><button>{'\u2715'}</button><button>{'\u270e'}</button></div>
                            </div>
                            <div id={comment.id} className="comment_likes"><button onClick={handleLikeClick}>like</button><span>{comment.likes}</span> likes</div>
                        </div>
                    )
                })
            }
            
            return (
                <div id={post.id} className="card" key={i}>
                    <div className="user_and_post_owner">
                        <NavLink to={`/${post.user.username}`}><img src={post.user.profile_pic ? `http://localhost:5555/${post.user.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" /></NavLink>
                        <h2 className="text">{post.user.username}</h2>
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
        <>
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
                    {/* <div className="text">filters?</div> */}
                    <div className="card createPostDiv">
                        <NavLink to={`/${user.username}`}><img src={user.profile_pic ? `http://localhost:5555/${user.profile_pic}` : no_pic} className="profile-pic" alt="profile pic" /></NavLink>
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
                    <div className="chats text">
                        <h3>Chats</h3>
                        <Chats />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home