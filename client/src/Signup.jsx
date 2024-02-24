import { useContext } from "react";
import { useFormik } from "formik";
import { Context } from './Context';
import * as yup from "yup";
import './css files/Login.css';

function Signup() {
    const { user, setUser, navigate } = useContext(Context)

    const formSchema = yup.object().shape({
        username: yup.string().required('Must enter username').max(20),
        password: yup.string().required('Must enter password').max(20),
        passwordconf: yup.string().required(),
        email: yup.string().required(),
        bday: yup.string().required(),
        phone: yup.string().required(),
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
                                navigate(`/${user.username}`)
                                return user
                            });
                        });
                    }
                });
                formik.resetForm();
            }
        }
    });

    function handleClick(e) {
        navigate('/login')
    }

    return (
        <>
            <form className="loginForm" onSubmit={formik.handleSubmit}>
                <h1>Sign Up</h1>
                <label id='username'>Username</label>
                <input placeholder='Type your username' type='text' id='usernameinp' name='username' autoComplete="on" onChange={formik.handleChange} value={formik.values.username} />
                <label id='password'>Password</label>
                <input placeholder='Type your password' type='password' id='passwordinp' name='password' onChange={formik.handleChange} value={formik.values.password} />
                <label id='passwordconf'>Confirm Password</label>
                <input placeholder='Type your password' type='password' id='passwordconfinp' name='passwordconf' onChange={formik.handleChange} value={formik.values.passwordconf} />
                <label id='email'>E-mail</label>
                <input placeholder='Type your email' type='text' id='emailinp' name='email' onChange={formik.handleChange} value={formik.values.email} />
                <label id='bday'>Birthday</label>
                <input placeholder='Type your birthday' type='text' id='bdayinp' name='bday' onChange={formik.handleChange} value={formik.values.bday} />
                <label id='phone'>Phone Number</label>
                <input placeholder='Type your phone number' type='text' id='phoneinp' name='phone' onChange={formik.handleChange} value={formik.values.phone} />
                <label id='country'>Country</label>
                <input placeholder='Type your country' type='text' id='countryinp' name='country' onChange={formik.handleChange} value={formik.values.country} />
                <label id='state'>State</label>
                <input placeholder='Type your state' type='text' id='stateinp' name='state' onChange={formik.handleChange} value={formik.values.state} />
                <label id='city'>City</label>
                <input placeholder='Type your city' type='text' id='cityinp' name='city' onChange={formik.handleChange} value={formik.values.city} />
                <button type='submit'>SIGN UP</button>
                <a onClick={handleClick}>Or Login</a>
            </form>
        </>
    )
}

export default Signup