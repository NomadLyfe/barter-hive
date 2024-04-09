import { useEffect, useContext } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import './css files/Home.css'
import no_pic from './images/no-profile-pic.png'
import { io } from 'socket.io-client';
import './css files/Chats.css';

let socket;

function Chats() {
    const { user, messages, setMessages } = useContext(Context)

    useEffect(() => {
        socket = io();

        socket.on('chat', (chat) => {
            setMessages([...messages, chat])
        })

        return (() => {
            socket.disconnect();
        })
    }, [])

    function openChat(e) {
        let user1 = null
        if (e.target.lastChild) {
            if (e.target.lastChild.innerHTML) {
                user1 = e.target.lastChild.innerHTML
            } else {
                user1 = e.target.parentNode.lastChild.innerHTML
            }
        } else {
            user1 = e.target.parentNode.lastChild.innerHTML
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
                    console.log(chat)
                    setMessages(chat.messages)
                })
            }
        })
    }

    let renderedchats = null
    if (user) {
        const chats = [...user.chats]
        const chat_ids = chats.map(u => u.id)
        chats.splice(chat_ids.indexOf(user.id), 1)
        renderedchats = chats.map((chatUser, i) => {
            return (
                <a className="friend" key={i} onClick={openChat}>
                    <img src={chatUser.profile_pic ? chatUser.profile_pic : no_pic} className="profile-pic" alt="profile pic" />
                    <div>{chatUser.username}</div>
                </a>
            )
        })
    }

    let renderedmessages = null
    if (messages) {
        renderedmessages = messages.map((message, i) => (
            <div key={i} className={`message ${message.user}`}>
                {message.user.username}: {message.content}
            </div>
        ))
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
            fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((message) => {
                        setMessages([...messages, message]);
                        socket.emit('chat', { user: user.username, msg: values.message })
                    });
                }
            });
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
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        />
                        <button >Send</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Chats