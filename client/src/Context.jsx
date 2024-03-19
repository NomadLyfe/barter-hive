import React, { createContext, useState } from 'react';
import { useNavigate } from "react-router-dom";

export const Context = createContext();

function ContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [inactivityCount, setInactivityCount] = useState(0);
    const [isActive, setIsActive] = useState(null)
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState([])
    const navigate = useNavigate();
    return (
        <Context.Provider value={{ user, setUser, navigate, inactivityCount, setInactivityCount, isActive, setIsActive, posts, setPosts, users, setUsers }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider