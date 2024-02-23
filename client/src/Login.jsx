import React from "react"
import { useFormik } from "formik";
import * as yup from "yup";
import './css files/Login.css'

function Login() {

    const formSchema = yup.object().shape({
        username: yup.string().required('Must enter username').max(20),
        password: yup.string().required('Must enter password').max(20)
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: formSchema,
        onSubmit: (values) => {

        }
    })

    return (
        <>
            <div className="loginForm">
                <h1>Login</h1>
                <label id='username' htmlFor='usernameinp'>Username</label>
                <input placeholder='Type your username' type='text' id='usernameinp' name='username' autoComplete="on" onChange={formik.handleChange} value={formik.values.username} />
                <label id='password' htmlFor='passwordinp'>Password</label>
                <input placeholder='Type your password' type='password' id='passwordinp' name='password' onChange={formik.handleChange} value={formik.values.password} />
                <a>Forgot Password?</a>
                <button type='submit'>LOGIN</button>
                <a>Or Sign Up</a>
            </div>
        </>
    )
}

export default Login