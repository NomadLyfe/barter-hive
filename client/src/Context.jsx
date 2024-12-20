/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';
import { useNavigate } from "react-router-dom";

export const Context = createContext();

function ContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [inactivityCount, setInactivityCount] = useState(0);
    const [isActive, setIsActive] = useState(null)
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState(null)
    const [offset, setOffset] = useState(0)
    const [scroll, setScroll] = useState(0)
    const [currdate, setCurrdate] = useState(new Date())
    const [userpage, setUserpage] = useState(null)
    const [userposts, setUserposts] = useState(null)
    const [chat, setChat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [editOn, setEditOn] = useState(false)
    const navigate = useNavigate();
    return (
        <Context.Provider value={{ 
            user,
            setUser, 
            navigate, 
            inactivityCount, 
            setInactivityCount, 
            isActive, 
            setIsActive, 
            posts, 
            setPosts, 
            users, 
            setUsers, 
            offset, 
            setOffset, 
            scroll, 
            setScroll, 
            currdate, 
            setCurrdate,
            userpage, 
            setUserpage,
            userposts, 
            setUserposts,
            chat,
            setChat,
            messages, 
            setMessages,
            editOn,
            setEditOn
        }}>
            {children}
        </Context.Provider>
    );
}

export default ContextProvider