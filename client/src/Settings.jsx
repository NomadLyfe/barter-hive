import { useContext, useState } from "react"
import { Context } from './Context';
import './css files/Login.css'
import no_pic from './images/no-profile-pic.png'

function Settings() {
    const { user, editOn, setEditOn } = useContext(Context)
    
    // {`settings ${darkMode ? 'dark' : 'light'}`}

    const [darkMode, setDarkMode] = useState(false);

    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
        console.log('hi')
        // You can implement logic here to toggle dark mode in your app
    };

    return (
        <div className="settings-wrapper text">
            <header><h2>Settings</h2></header>
            <div className="editSwitch">
                <p>Edit:</p>
                <label class="switch">
                    <input type="checkbox" onClick={() => {
                        setEditOn(!editOn)
                        }} />
                    <span class="slider round"></span>
                </label>
            </div>
            <div className="settings">
                <div className="picInfo">
                    <img src={user.profile_pic} />
                </div>
                <form className="loginForm" onSubmit={handleDarkModeToggle}>
                    <label id="username">Username:</label>
                    {editOn ? <input placeholder='Type your username' type="text" id="usernameinp" name="username" autoComplete="on" /> : <span>{user.username ?? ''}</span>}
                    <label id="password">Password:</label>
                    {editOn ? <input placeholder='Type your password' type='password' id='passwordinp' name='password' /> : <span>{user.username ?? ''}</span>}
                    <label id="email">E-mail:</label>
                    {editOn ? <input placeholder='Type your email' type='password' id='emailinp' name='email' /> : <span>{user.email ?? ''}</span>}
                    <label id="profile">Profile Picture:</label>
                    {editOn ? <input type="file" id="profileinp" name="profile" accept="image/*" /> : <span>{user.profile_pic ?? ''}</span>}
                    <label id="banner">Banner Picture:</label>
                    {editOn ? <input type="file" id="bannerinp" name="banner" accept="image/*" /> : <span>{user.banner_pic ?? ''}</span>}
                    <label id="city">City:</label>
                    {editOn ? <input placeholder="Type your city" type="text" id="cityinp" name="city" autoComplete="on" /> : <span>{user.city ?? ''}</span>}
                    <label id="state">State:</label>
                    {editOn ? <input placeholder="Type your state" type="text" id="stateinp" name="state" autoComplete="on" /> : <span>{user.state ?? ''}</span>}
                    <label id="country">Country:</label>
                    {editOn ? <input placeholder="Type your country" type="text" id="countryinp" name="country" autoComplete="on" /> : <span>{user.country ?? ''}</span>}
                    {editOn ? <button type='submit'>SAVE</button> : null}
                </form>
            </div>
        </div>

    )
}

export default Settings