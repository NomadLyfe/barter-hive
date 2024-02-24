import { useContext } from "react"
import { Context } from './Context';
import reactLogo from './images/react.svg';
import viteLogo from '/vite.svg';

function Home() {
    const { inactivityCount, setInactivityCount } = useContext(Context)

    return (
        <>
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
                <button onClick={() => setInactivityCount((inactivityCount) => inactivityCount + 1)}>
                    count is {inactivityCount}
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}

export default Home