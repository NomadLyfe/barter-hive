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
    const { user, chat, setChat, messages, setMessages } = useContext(Context)

    useEffect(() => {
        const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:5555';
        socket = io(URL);

        socket.on('chat_result', (ms) => {
            console.log(ms)
            console.log([...ms])
            setMessages([...ms])
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
                    setChat(chat)
                    setMessages([...chat.messages])
                    console.log([...chat.messages])
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
        renderedmessages = messages.toReversed().map((message, i) => (
            <div key={i} className={`message ${message.user.username}`}>
                {message.user.username}: {message.content}
            </div>
        ))
    }


    const formSchema = yup.object().shape({
        message: yup.string().max(1000)
    });

    const formik = useFormik({
        initialValues: {
            message: '',
            // user_id: user.id,
            // chat_id: chat ? chat.id : null
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            socket.emit("json", { message: values.message, user_id: user.id, chat_id: chat ? chat.id : null })
            // fetch('/api/messages', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(values)
            // }).then((resp) => {
            //     if (resp.ok) {
            //         resp.json().then((message) => {
            //             setMessages([...messages, message]);
            //         });
            //     }
            // });
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