import { useEffect, useContext } from 'react';
import { Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './css files/App.css';
import Login from './Login';
import Signup from './Signup'
import { Context } from './Context';
import NavBar from './NavBar';

function App() {
    const { user, setUser, navigate, inactivityCount, setInactivityCount } = useContext(Context)

    useEffect(() => {
        const interval = setInterval(() => {
        setInactivityCount(inactivityCount + 1)
        console.log(inactivityCount + 1)
        }, 1000);

        return () => clearInterval(interval)

    }, [inactivityCount])


    function resetTimer(e) {
        setInactivityCount(0)
        console.log(0)
    }

    if (!user) {
        return (
            <>
                <Routes>
                    <Route path='/login?' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                </Routes>
            </>
        )
    }

    return (
        <>
            <main onMouseMove={resetTimer}>
                <NavBar />
                <div>
                    <Routes>
                        <Route exact path='/:user' />
                    </Routes>
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
                        <button onClick={() => setCount((inactivityCount) => inactivityCount + 1)}>
                            count is {inactivityCount}
                        </button>
                        <p>
                            Edit <code>src/App.jsx</code> and save to test HMR
                        </p>
                    </div>
                    <p className="read-the-docs">
                        Click on the Vite and React logos to learn more
                    </p>
                </div>
            </main>
        </>
    )
}

export default App
