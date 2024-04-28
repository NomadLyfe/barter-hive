/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
import Friends from "./Friends";
import Bdays from "./Bdays";
import Chats from "./Chats";
import HomePostCard from "./PostCard";

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

    let renderedPostList = null
    if (posts[0]) {
        renderedPostList = posts.map((post, i) => {
            return (
                <HomePostCard key={i} post={post} />
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
                        <NavLink to={`/${user.username}`}><img src={user.profile_pic ? `/api${user.profile_pic}` : no_pic} className="profile-pic" alt="profile pic" /></NavLink>
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