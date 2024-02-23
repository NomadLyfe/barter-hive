import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import './css files/index.css'
import ContextProvider from './Context.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ContextProvider>
                <App />
            </ContextProvider>
        </BrowserRouter>
    </React.StrictMode>
)
