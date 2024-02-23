import { useContext } from "react";
import { useFormik } from "formik";
import { Context } from './Context';
import * as yup from "yup";
import './css files/Login.css';

function Signup() {
    const { user, setUser, navigate } = useContext(Context)

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
                        setUser(user);
                    });
                }
            });
            formik.resetForm();
        }
    });

    function handleClick(e) {
        navigate('/login')
    }

    return (
        <>
            <form className="loginForm" onSubmit={formik.handleSubmit}>
                <h1>Sign Up</h1>
                <label id='username' htmlFor='usernameinp'>Username</label>
                <input placeholder='Type your username' type='text' id='usernameinp' name='username' autoComplete="on" onChange={formik.handleChange} value={formik.values.username} />
                <label id='password' htmlFor='passwordinp'>Password</label>
                <input placeholder='Type your password' type='password' id='passwordinp' name='password' onChange={formik.handleChange} value={formik.values.password} />
                <button type='submit'>SIGN UP</button>
                <a onClick={handleClick}>Or Login</a>
            </form>
        </>
    )
}

export default Signup