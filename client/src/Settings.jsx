import { useContext, useState } from "react"
import { Context } from './Context';
import { useFormik } from "formik";
import * as yup from "yup";
import './css files/Login.css'
import no_pic from './images/no-profile-pic.png'
import { Country, State, City }  from 'country-state-city';

function Settings() {
    const { user, setUser, editOn, setEditOn, navigate } = useContext(Context)
    const c = Country.getAllCountries()
    const countries = c.map((country, i) => {
        return (
            <option className={country.name.split(' ').join('_')} value={country.name} key={i} id={country.isoCode}>{country.name}</option>
        )
    })
    const [countryCode, setCountryCode] = useState(null)
    const [states, setStates] = useState(null)
    const [cities, setCities] = useState(null)
    const phoneRegEx = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
    const emailRegEx = /^[\w.]+@([\w-]+\.)+[\w-]{2,4}$/
    const passRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/
    const userRegEx = /^[A-Za-z][A-Za-z0-9_]{4,24}$/

    const formSchema = yup.object().shape({
        username: yup.string().min(5).max(25).matches(userRegEx, 'You are using illegal characters for username'),
        password: yup.string().max(25).matches(passRegEx, 'You are not meeing password requirements'),
        email: yup.string().max(50).matches(emailRegEx, 'Email is not valid'),
        phone: yup.string().max(20).matches(phoneRegEx, 'Phone number is not valid'),
        profile: yup.mixed(),
        banner: yup.mixed(),
        status: yup.string(),
        bio: yup.string().max(1500),
        city: yup.string(),
        state: yup.string(),
        country: yup.string()
    })

    const formik = useFormik({
        initialValues: {
            username: user.username,
            password: '',
            email: user.email,
            phone: user.phone,
            profile: '',
            banner: '',
            status: user['status'] ? user.status : '',
            bio: user['bio'] ? user.bio : '',
            city: user.city,
            state: user.state,
            country: user.country
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log('am i here?')
            fetch('/api/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then((resp) => {
                if (resp.status === 401) {
                    alert('Not logged in');
                } else if (resp.status === 400) {
                    resp.json().then((error) => {
                        alert(error.error);
                    });
                } else if (resp.ok) {
                    resp.json().then((updatedUser) => {
                        setUser(updatedUser);
                        setEditOn(false)
                        const check_box = document.querySelector('.switch').firstChild;
                        check_box.checked = false;
                    });
                }
            }).catch((error) => {
                console.error('Error:', error);
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
                    resp.json().then(() => {
                        setUser(null)
                        navigate('/login')
                    })
                }
            })
        }
    }

    function handleCountrySelection(e) {
        formik.handleChange(e)
        formik.setFieldValue('state', '')
        formik.setFieldValue('city', '')
        const countryName = e.target.value
        setCountryCode(e.target.querySelector(`.${countryName.split(' ').join('_')}`).id)
        const s = State.getStatesOfCountry(e.target.querySelector(`.${countryName.split(' ').join('_')}`).id)
        setStates(s.map((state, i) => {
            return (
                <option className={state.name.split(' ').join('_')} value={state.name} key={i} id={state.isoCode}>{state.name}</option>
            )
        }))
    }

    function handleStateSelection(e) {
        formik.handleChange(e)
        formik.setFieldValue('city', '')
        const stateName = e.target.value
        const stateCode = e.target.querySelector(`.${stateName.split(' ').join('_')}`).id
        const ci = City.getCitiesOfState(countryCode, stateCode)
        setCities(ci.map((city, i) => {
            return (
                <option className={city.name.split(' ').join('_')} value={city.name} key={i} id={city.isoCode}>{city.name}</option>
            )
        }))
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
                    <img src={user.profile_pic ? `/api${user.profile_pic}` : no_pic} alt="user-pic" />
                    {user.banner_pic ? <img className="banner-preview" src={`/api${user.banner_pic}`} alt="banner-pic" /> : null}
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
                    <label id="status">Status:</label>
                    {editOn ? <select placeholder='Select your status' type="text" id="statusinp" name="status" autoComplete="on" onChange={formik.handleChange} value={formik.values.status}>
                        <option value=''></option>
                        <option value='Single'>Single</option>
                        <option value='Engaged'>Engaged</option>
                        <option value='Married'>Married</option>
                        <option value='Divorced'>Divorced</option>
                        <option value='Taken'>Taken</option>
                    </select> : <span>{user.status ?? ''}</span>}
                    <label id="bio">Bio:</label>
                    {editOn ? <textarea placeholder='Type your bio' type="text" id="bioinp" name="bio" autoComplete="on" onChange={formik.handleChange} value={formik.values.bio} /> : <span id="bioarea">{user.bio ?? ''}</span>}
                    <label id="country">Country:</label>
                    {editOn ? <select placeholder="Type your country" type="text" id="countryinp" name="country" autoComplete="on" onChange={handleCountrySelection} value={formik.values.country}>
                        <option>{formik.values.country}</option>
                        {countries}
                    </select> : <span>{user.country ?? ''}</span>}
                    <label id="state">State:</label>
                    {editOn ? <select placeholder="Type your state" type="text" id="stateinp" name="state" autoComplete="on" onChange={handleStateSelection} value={formik.values.state}>
                        <option>{formik.values.state}</option>
                        {states}
                    </select> : <span>{user.state ?? ''}</span>}
                    <label id="city">City:</label>
                    {editOn ? <select placeholder="Type your city" type="text" id="cityinp" name="city" autoComplete="on" onChange={formik.handleChange} value={formik.values.city}>
                        <option>{formik.values.city}</option>
                        {cities}
                    </select> : <span>{user.city ?? ''}</span>}
                    {editOn ? <button type='submit'>SAVE</button> : null}
                    <button className="delete_account" onClick={handleDeleteAccount}>Delete Account</button>
                </form>
            </div>
        </div>
    )
}

export default Settings