import React, { createContext, useState } from 'react';
import { useNavigate } from "react-router-dom";

export const Context = createContext();

function ContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [inactivityCount, setInactivityCount] = useState(0);
    const navigate = useNavigate();
    return (
        <Context.Provider value={{ user, setUser, navigate, inactivityCount, setInactivityCount }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider