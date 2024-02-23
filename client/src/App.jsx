import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css files/App.css'
import Login from './Login';

function App() {
    const [user, setUser] = useState(null);
    const [count, setCount] = useState(0);
    const history = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
        setCount(count + 1)
        }, 1000);

        return () => clearInterval(interval)

    }, [count])


    function resetTimer(e) {
        setCount(0)
    }

    if (!user) {
        return (
            <>
                <Login />
            </>
        )
    }

    return (
        <>
            <main onMouseMove={resetTimer}>
                <NavBar />
                <div>
                    <Routes>
                        <Route exact path='/:user'>

                        </Route>
                        <div>
                            <a href="https://vitejs.dev" target="_blank">
                                <img src={viteLogo} className="logo" alt="Vite logo" />
                            </a>
                            <a href="https://react.dev" target="_blank">
                                <img src={reactLogo} className="logo react" alt="React logo" />
                            </a>
                        </div>
                        <h1>Vite + React</h1>
                        <div className="card">
                            <button onClick={() => setCount((count) => count + 1)}>
                                count is {count}
                            </button>
                            <p>
                                Edit <code>src/App.jsx</code> and save to test HMR
                            </p>
                        </div>
                        <p className="read-the-docs">
                            Click on the Vite and React logos to learn more
                        </p>
                    </Routes>
                </div>
            </main>
        </>
    )
}

export default App
