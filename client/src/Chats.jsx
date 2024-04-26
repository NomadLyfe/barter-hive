/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from "react"
import { Context } from './Context';
import { useFormik } from "formik";
import * as yup from "yup";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
import { io } from 'socket.io-client';
import './css files/Chats.css';

let socket;

function Chats() {
    const { user, setUser, chat, setChat, messages, setMessages } = useContext(Context)

    useEffect(() => {
        // const URL = process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:8000' : '/api';
        const URL = 'https://barter-hive.onrender.com/'
        socket = io(URL);

        socket.on('chat_result', (ms) => {
            setMessages([...ms])
        })

        return (() => {
            socket.disconnect();
        })
    }, [])

    function openChat(e) {
        if (e.target.innerHTML != '\u2715') {
            let user1 = null
            if (e.target.children[1]) {
                if (e.target.children[1].innerHTML) {
                    user1 = e.target.children[1].innerHTML
                } else {
                    user1 = e.target.parentNode.children[1].innerHTML
                }
            } else {
                user1 = e.target.parentNode.children[1].innerHTML
            }
            fetch('/api/search_chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({user1: user1, user2: user.username})
            }).then((resp) => {
                if (resp.status === 200) {
                    resp.json().then((chat) => {
                        setChat(chat)
                        setMessages([...chat.messages])
                        document.querySelector('.messages').scroll(top)
                    })
                }
            })
        }
    }

    function handleHover(e) {
        const button = e.currentTarget.querySelector('button');
        if (button) {
            button.style.display = !button.style.display || button.style.display === 'none' ? 'block' : 'none';
        }
    }

    function handleDeleteChat(e) {
        const result = window.confirm(`Are you sure you want to delete your chat with ${e.target.parentNode.children[1].innerHTML}?`);
        if (result) {
            fetch(`/api/chat/${e.target.parentNode.id}/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((data) => {
                        setUser(data['u'])
                        setChat(null)
                        setMessages(null)
                    })
                }
            })
        }
    }

    let renderedchats = null
    if (user) {
        const chats = [...user.chats]
        const chat_ids = chats.map(u => u.id)
        chats.splice(chat_ids.indexOf(user.id), 1)
        renderedchats = chats.map((chatUser, i) => {
            return (
                <a id={`chat${chatUser.id}`} className="friend" key={i} onClick={openChat} onMouseOver={handleHover} onMouseOut={handleHover}>
                    <img src={chatUser.profile_pic ? `/api${chatUser.profile_pic}` : no_pic} className="profile-pic" alt="profile pic" />
                    <div>{chatUser.username}</div>
                    <button onClick={handleDeleteChat}>{'\u2715'}</button>
                </a>
            )
        })
    }

    let renderedmessages = null
    if (messages) {
        if (messages[0]) {
            renderedmessages = messages.toReversed().map((message, i) => (
                <div key={i} className={`message ${message.user.username}`}>
                    {message.user.username}: {message.content}
                </div>
            ))
        } else {
            renderedmessages = [<p key={1}>No messages yet</p>]
        }
    }


    const formSchema = yup.object().shape({
        message: yup.string().max(1000)
    });

    const formik = useFormik({
        initialValues: {
            message: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            socket.emit("json", { message: values.message, user_id: user.id, chat_id: chat ? chat.id : null })
            formik.resetForm();
        }
    });

    return(
        <>
            <div className="chatusers">{renderedchats}</div>
            <div className="chatboxwrapper">
                <h3>Chat Box</h3>
                <div className="chatbox">
                    <div className="messages">
                        {renderedmessages ? renderedmessages : <p>Click a chat above</p>}
                    </div>
                    <form className="input" onSubmit={formik.handleSubmit}>
                        <input
                        type="text"
                        placeholder="Type your message..."
                        name="message"
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Chats