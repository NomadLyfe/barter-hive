import { useContext, useState } from "react";
import { useFormik } from "formik";
import { Context } from './Context';
import * as yup from "yup";
import './css files/Login.css';
import logoNoBack from './images/logo-no-background.svg';
import { Country, State, City }  from 'country-state-city';

function Signup() {
    const { setUser, navigate } = useContext(Context)
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
        username: yup.string().required('Must enter username').min(5).max(25).matches(userRegEx, 'You are using illegal characters for username'),
        password: yup.string().required('Must enter password').min(8).max(25).matches(passRegEx, 'You are not meeing password requirements'),
        passwordconf: yup.string().required().min(8).max(25).matches(passRegEx, 'You are not meeing password requirements'),
        email: yup.string().required().max(50).matches(emailRegEx, 'Email is not valid'),
        bday: yup.date().required(),
        phone: yup.string().required().max(20).min(7).matches(phoneRegEx, 'Phone number is not valid'),
        country: yup.string().required(),
        state: yup.string().required(),
        city: yup.string().required()
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            passwordconf: '',
            email: '',
            bday: '',
            phone: '',
            country: '',
            state: '',
            city: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            if (values.password === values.passwordconf) {
                fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                }).then((resp) => {
                    if (resp.ok) {
                        resp.json().then((user) => {
                            setUser(() => {
                                return user
                            });
                            navigate(`/`)
                        });
                    }
                });
                formik.resetForm();
            }
        }
    });

    function handleClick() {
        navigate('/login')
    }

    function handleAsteriskToggle(e) {
        const { name, value } = e.target;
        const label = e.target.parentNode.querySelector(`#${name}`);
        if (label) {
            if (value !== '') {
                label.classList.add('input-filled');
            } else {
                label.classList.remove('input-filled');
            }
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

    function restrictCharacters(e) {
        const value = e.target.value.replace(/\D/g, '');
        formik.setFieldValue('phone', value);
    }

    return (
        <>
            <form className="loginForm" onSubmit={formik.handleSubmit}>
                <img src={logoNoBack} className="logo" alt="logo-no-back" />
                <h1>Sign Up</h1>
                <label id='username' className="required input-label">Username</label>
                <input placeholder='Type your username' type='text' id='usernameinp' name='username' autoComplete="on" onChange={formik.handleChange} value={formik.values.username} onFocus={handleAsteriskToggle} onBlur={handleAsteriskToggle} required />
                <label id='password' className="required input-label">Password</label>
                <input placeholder='Type your password' type='password' id='passwordinp' name='password' onChange={formik.handleChange} value={formik.values.password} onFocus={handleAsteriskToggle} onBlur={handleAsteriskToggle} required />
                <label id='passwordconf' className="required input-label">Confirm Password</label>
                <input placeholder='Type your password' type='password' id='passwordconfinp' name='passwordconf' onChange={formik.handleChange} value={formik.values.passwordconf} onFocus={handleAsteriskToggle} onBlur={handleAsteriskToggle} required />
                <label id='email' className="required input-label">E-mail</label>
                <input placeholder='Type your email' type='email' id='emailinp' name='email' onChange={formik.handleChange} value={formik.values.email} onFocus={handleAsteriskToggle} onBlur={handleAsteriskToggle} required />
                <label id='bday' className="required input-label">Birthday</label>
                <input placeholder='Type your birthday' type='date' id='bdayinp' name='bday' onChange={formik.handleChange} value={formik.values.bday} onFocus={handleAsteriskToggle} onBlur={handleAsteriskToggle} required />
                <label id='phone' className="required input-label">Phone Number</label>
                <input placeholder='Type your phone number' type='tel' id='phoneinp' name='phone' onChange={restrictCharacters} value={formik.values.phone} onFocus={handleAsteriskToggle} onBlur={handleAsteriskToggle} required minLength={7} maxLength={20} />
                <label id='country' className="required input-label">Country</label>
                <select id='countryinp' name='country' onChange={handleCountrySelection} value={formik.values.country}  onFocus={handleAsteriskToggle} onBlur={handleAsteriskToggle} required>
                    <option></option>
                    {countries}
                </select>
                <label id='state' className="required input-label">State</label>
                <select id='stateinp' name='state' onChange={handleStateSelection} value={formik.values.state} onFocus={handleAsteriskToggle} onBlur={handleAsteriskToggle} required>
                    <option></option>
                    {states}
                </select>
                <label id='city' className="required input-label">City</label>
                <select id='cityinp' name='city' onChange={formik.handleChange} value={formik.values.city} onFocus={handleAsteriskToggle} onBlur={handleAsteriskToggle} required>
                    <option></option>
                    {cities}
                </select>
                <button type='submit'>SIGN UP</button>
                <a onClick={handleClick}>Or Login</a>
            </form>
        </>
    )
}

export default Signup