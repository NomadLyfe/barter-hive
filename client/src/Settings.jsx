import { useContext } from "react"
import { Context } from './Context';
import { useFormik } from "formik";
import * as yup from "yup";
import './css files/Login.css'
import no_pic from './images/no-profile-pic.png'
import { Navigate } from "react-router-dom";

function Settings() {
    const { user, setUser, editOn, setEditOn, navigate } = useContext(Context)
    
    // {`settings ${darkMode ? 'dark' : 'light'}`}

    const formSchema = yup.object().shape({
        username: yup.string().max(20),
        password: yup.string().max(20),
        email: yup.string().max(50),
        phone: yup.string().max(20),
        profile: yup.mixed(),
        banner: yup.mixed(),
        city: yup.string().max(20),
        state: yup.string().max(20),
        country: yup.string().max(20)
    })

    const formik = useFormik({
        initialValues: {
            username: user.username,
            password: '',
            email: user.email,
            phone: user.phone,
            profile: '',
            banner: '',
            city: user.city,
            state: user.state,
            country: user.country
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch('/api/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((updatedUser) => {
                        setUser(updatedUser);
                        setEditOn(false)
                        const check_box = document.querySelector('.switch').firstChild;
                        check_box.checked = false;
                    });
                }
            });
        }
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            formik.setFieldValue(`${e.target.name}`, base64String);
        };
        reader.readAsDataURL(file);
    };

    function handleDeleteAccount() {
        const result = window.confirm(`${user.username}, are you sure you want to delete your account?`);
        if (result) {
            fetch(`/api/user/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((resp) => {
                if (resp.ok) {
                    resp.json().then((data) => {
                        console.log(data)
                        setUser(null)
                        navigate('/login')
                    })
                }
            })
        }
    }

    return (
        <div className="settings-wrapper text">
            <header><h1>Settings</h1></header>
            <div className="editSwitch">
                <p>Edit:</p>
                <label className="switch">
                    <input type="checkbox" onClick={() => {
                        setEditOn(!editOn)
                        }} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="settings">
                <div className="picInfo">
                    <img src={user.profile_pic ? `http://localhost:5555/${user.profile_pic}` : no_pic} alt="user-pic" />
                </div>
                <form className="loginForm" onSubmit={formik.handleSubmit}>
                    <label id="username">Username:</label>
                    {editOn ? <input placeholder='Type your username' type="text" id="usernameinp" name="username" autoComplete="on" onChange={formik.handleChange} value={formik.values.username} /> : <span>{user.username ?? ''}</span>}
                    <label id="password">Password:</label>
                    {editOn ? <input placeholder='Leave blank to leave unchanged' type='password' id='passwordinp' name='password' onChange={formik.handleChange} value={formik.values.password} /> : <span>{'**********'}</span>}
                    <label id="email">E-mail:</label>
                    {editOn ? <input placeholder='Type your email' type='text' id='emailinp' name='email' onChange={formik.handleChange} value={formik.values.email} /> : <span>{user.email ?? ''}</span>}
                    <label id="phone">Phone Number:</label>
                    {editOn ? <input placeholder='Type your phone number' type='text' id='phoneinp' name='phone' onChange={formik.handleChange} value={formik.values.phone} /> : <span>{user.phone ?? ''}</span>}
                    <label id="profile">Profile Picture:</label>
                    {editOn ? <input type="file" id="profileinp" name="profile" accept="image/*" onChange={handleFileChange} /> : <span>{user.profile_pic ?? ''}</span>}
                    <label id="banner">Banner Picture:</label>
                    {editOn ? <input type="file" id="bannerinp" name="banner" accept="image/*" onChange={handleFileChange} /> : <span>{user.banner_pic ?? ''}</span>}
                    <label id="city">City:</label>
                    {editOn ? <input placeholder="Type your city" type="text" id="cityinp" name="city" autoComplete="on" onChange={formik.handleChange} value={formik.values.city} /> : <span>{user.city ?? ''}</span>}
                    <label id="state">State:</label>
                    {editOn ? <input placeholder="Type your state" type="text" id="stateinp" name="state" autoComplete="on" onChange={formik.handleChange} value={formik.values.state} /> : <span>{user.state ?? ''}</span>}
                    <label id="country">Country:</label>
                    {editOn ? <input placeholder="Type your country" type="text" id="countryinp" name="country" autoComplete="on" onChange={formik.handleChange} value={formik.values.country} /> : <span>{user.country ?? ''}</span>}
                    {editOn ? <button type='submit'>SAVE</button> : null}
                    <button className="delete_account" onClick={handleDeleteAccount}>Delete Account</button>
                </form>
            </div>
        </div>
    )
}

export default Settings