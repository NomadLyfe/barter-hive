import React from "react"
import logoNoTitle from './images/logo-no-title.png'
import { NavLink } from "react-router-dom";
import './css files/NavBar.css'
import { Context } from './Context';
import { useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function NavBar() {
    const { user, setUser, navigate } = useContext(Context)

    function handleLogoutClick() {
        fetch("/logout", { method: "DELETE" }).then((resp) => {
            if (resp.ok) {
                history.push('/');
                onLogout(null);
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
            fetch(`/results`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values, null, 2)
            }).then(resp => resp.json()).then(restaurants => {
                history.push(`/results/${values.restaurant}/${values.location}`);
                onSearch(restaurants.businesses);
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
                    <NavLink><button>3</button></NavLink>
                </div>
                <div className="notifications">
                    {!user ? <NavLink to="/login" className='link' >Login</NavLink> : null}
                    {!user ? <NavLink to='/signup' className='link' >Signup</NavLink> : null}
                    {/* {user ? <Link to="/account" className='link' >Account</Link> : null} */}
                    {user ? <button onClick={handleLogoutClick} className='link' >Log Out</button> : null}
                </div>
            </div>
        </>
    )
}

export default NavBar