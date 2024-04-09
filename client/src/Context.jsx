import React, { createContext, useState } from 'react';
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
    const [showingposts, setShowingposts] = useState(posts)
    const [numposts, setNumposts] = useState(0)
    const [maxposts, setMaxposts] = useState(25)
    const [userpage, setUserpage] = useState(null)
    const [userposts, setUserposts] = useState(null)
    const [messages, setMessages] = useState([])
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
            showingposts,
            setShowingposts,
            numposts, 
            setNumposts,
            maxposts, 
            setMaxposts,
            userpage, 
            setUserpage,
            userposts, 
            setUserposts,
            messages,
            setMessages
        }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider