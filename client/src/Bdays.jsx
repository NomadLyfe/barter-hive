import { useContext } from "react"
import { Context } from './Context';
import { NavLink } from "react-router-dom";
import './css files/Home.css'

function Bdays() {
    const { user, currdate } = useContext(Context)

    let renderedbdays = null
    if (user) {
        const friends = [...user.friendships]
        const friend_ids = friends.map(u => u.id)
        friends.splice(friend_ids.indexOf(user.id), 1)
        renderedbdays = friends.map((friend, i) => {
            let bday = new Date(friend.bday)
            if (bday.getMonth() == currdate.getMonth() && bday.getDay() == currdate.getDay()) {
                return (
                    <div className="bday" key={i}>
                        <div>It is <NavLink to={`/${friend.username}`}>{friend.username}{"'"}s</NavLink> birthday today!</div>
                    </div>
                )
            }
        })
    }

    return(
        <>
            {renderedbdays[0] ? renderedbdays : <div className="no_bday">No Birthdays</div>}
        </>
    )
}

export default Bdays