import { useContext } from "react"
import { Context } from './Context';
import './css files/Home.css'

function Home() {
    const { inactivityCount, setInactivityCount } = useContext(Context)



    return (
        <>
            <div className="mainPage">
                <div className="leftPanel">
                    <div className="buttons text">
                        1
                    </div>
                    <div className="shortcuts text">
                        2
                    </div>
                </div>
                <div className="feed">
                    <h1 className="text">Your Feed</h1>
                    <div className="card">
                        <button onClick={() => setInactivityCount((inactivityCount) => inactivityCount + 1)}>
                            count is {inactivityCount}
                        </button>
                        <p className="text">
                            Edit <code>src/App.jsx</code> and save to test HMR
                        </p>
                    </div>
                </div>
                <div className="rightPanel">
                    <div className="suggestion text">
                        1
                    </div>
                    <div className="bdays text">
                        2
                    </div>
                    <div className="friends text">
                        3
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home