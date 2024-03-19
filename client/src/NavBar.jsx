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
    const { user, setUser, navigate, isActive, users, setUsers } = useContext(Context)

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

    function handleSearchChange(e) {
        formik.handleChange(e)
        if (e.target.value) {
            fetch(`/api/search_users/${e.target.value}`).then((resp) => {
                if (resp.status === 200) {
                    resp.json().then((userList) => {
                        console.log(userList)
                        setUsers(userList)
                    })
                }
            });
        } else {
            setUsers(null)
        }
    }

    function handleSearchFocus(e) {
        const results = document.querySelector('.dynamicResults')
        results.style.display = 'block';
        e.target.style.width = '250px';
    }

    function handleSearchBlur(e) {
        const results = document.querySelector('.dynamicResults')
        results.style.display = 'none';
        e.target.style.width = '169px';
    }

    let renderedDynamicSearch = null
    if (users) {
        renderedDynamicSearch = users.map((u, index) => {
            return (
                <div className="result" key={index}>
                    <img id="user_pic" src={u.profile_pic ? u.profile_pic : no_pic} className="profile-pic" alt="user-pic" />
                    <div>
                        <span>{u.username}</span>
                        {/* {user.friends.includes(u) ? <span>friend</span> : <span>x mutual friends</span>} */}
                    </div>
                </div>
            )
        })
    } else {
        <div className="dynamicResults">
            No results
        </div>
    }


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
                        <form onSubmit={formik.handleSubmit} onFocus={handleSearchFocus} onBlur={handleSearchBlur}>
                            <input type='text'name="queryTerm" value={formik.values.queryTerm} onChange={handleSearchChange} placeholder='Search Barter Hive' />
                        </form>
                        <div className="dynamicResults text">
                            {renderedDynamicSearch}
                        </div>
                    </div>
                </div>
                <div className="navlinks">
                    <NavLink><button>1</button></NavLink>
                    <NavLink><button>2</button></NavLink>
                </div>
                <div className="notifications">
                    {!user ? <NavLink to="/login">Login</NavLink> : null}
                    {!user ? <NavLink to='/signup'>Signup</NavLink> : null}
                    <img id="user_pic" src={user.profile_pic ? user.profile_pic : no_pic} className="profile-pic" alt="user-pic" />
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