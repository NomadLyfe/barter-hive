import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Context } from './Context';
import './css files/Login.css';
import logoNoBack from './images/logo-no-background.svg';

function Login() {
    // const { user, setUser, navigate, setPosts, offset, setOffset, setShowingposts, setNumposts, setMaxposts } = useContext(Context)
    const { setUser, navigate } = useContext(Context);
    const [loginError, setLoginError] = useState(false);

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
            fetch('/api/login', {
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
                } else if (resp.status === 401) {
                    setLoginError(true);
                }
            });
            formik.resetForm();
        }
    });

    function handleSignUpClick() {
        navigate('/signup')
    }

    return (
        <>
            <form className="loginForm" onSubmit={formik.handleSubmit}>
                <img src={logoNoBack} className="logo" alt="logo-no-back" />
                <h1>Login</h1>
                <label id='username'>Username</label>
                <input placeholder='Type your username' type='text' id='usernameinp' name='username' autoComplete="on" onChange={formik.handleChange} value={formik.values.username} />
                <label id='password'>Password</label>
                <input placeholder='Type your password' type='password' id='passwordinp' name='password' onChange={formik.handleChange} value={formik.values.password} />
                {loginError && <p className="error-message">Invalid username or password. Please try again.</p>}
                <a>Forgot Password?</a>
                <button type='submit'>LOGIN</button>
                <a onClick={handleSignUpClick}>Or Sign Up</a>
            </form>
        </>
    )
}

export default Login