import React from "react"
import logoNoTitle from './images/logo-no-title.png'
import { NavLink } from "react-router-dom";
import './css files/NavBar.css'
import { Context } from './Context';
import { useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import active from './images/active.png'
import inactive from './images/inactive.png'
import no_pic from './images/no-profile-pic.png'

function NavBar() {
    const { user, setUser, navigate, isActive } = useContext(Context)

    function handleUserClick() {
        const dropdown = document.querySelector('.user_dropdown')
        console.log(dropdown.style.display)
        dropdown.style.display == '' ? dropdown.style.display = 'block' : dropdown.style.display = ''
    }

    function handleLogoutClick() {
        fetch("/api/login", { method: "DELETE" }).then((resp) => {
            if (resp.ok) {
                navigate('/');
                setUser(null);
            }
        });
    };

    const formSchema = yup.object().shape({
        queryTerm: yup.string()
    });

    const formik = useFormik({
        initialValues: {
            queryTerm: "",
            offset: 0
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch(`/users`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values, null, 2)
            }).then(resp => resp.json()).then(() => {
                navigate(`/`);
            })
            formik.resetForm();
        }
    });

    return (
        <>
            <div className="navigation">
                <div className="logo-search">
                    <div>
                        <a>
                            <img src={logoNoTitle} className="logo" alt="logo-no-title" />
                        </a>
                    </div>
                    <div className="searchbar">
                        <form onSubmit={formik.handleSubmit}>
                            <input type='text'name="queryTerm" value={formik.values.queryTerm} onChange={formik.handleChange} placeholder='Search Barter Hive' />
                        </form>
                    </div>
                </div>
                <div className="navlinks">
                    <NavLink><button>1</button></NavLink>
                    <NavLink><button>2</button></NavLink>
                </div>
                <div className="notifications">
                    {!user ? <NavLink to="/login">Login</NavLink> : null}
                    {!user ? <NavLink to='/signup'>Signup</NavLink> : null}
                    <button onClick={handleUserClick} className="user_pic"><img src={user.profile_pic ? user.profile_pic : no_pic} alt="user-pic" /></button>
                    <div className="status"><img src={isActive ? active : inactive} alt="status" /></div>
                    <div className="user_dropdown">
                        <div></div>
                        <div className="dropdown_buttons">
                            {user ? <NavLink to="/account">Account</NavLink> : null}
                            {user ? <NavLink onClick={handleLogoutClick}>Log Out</NavLink> : null}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar