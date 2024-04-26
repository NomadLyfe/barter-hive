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
    const { user, setUser, navigate, isActive, users, setUsers, setPosts } = useContext(Context)

    function handleLogoutClick() {
        fetch("/api/login", { method: "DELETE" }).then((resp) => {
            if (resp.ok) {
                navigate('/login');
                setPosts([]);
                setUser(null);
            }
        });
    }

    const formSchema = yup.object().shape({
        queryTerm: yup.string()
    });

    const formik = useFormik({
        initialValues: {
            queryTerm: "",
            offset: 0
        },
        validationSchema: formSchema,
        // onSubmit: (values) => {
        //     fetch(`/users`, {
        //         method: 'POST',
        //         headers: {
        //             'accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(values, null, 2)
        //     }).then(resp => resp.json()).then(() => {
        //         navigate(`/results?q={values.queryTerm}`);
        //     })
        //     formik.resetForm();
        // }
        // Future: build a function that navigates to a results page that displays all the users based on your query
    });

    function handleSearchChange(e) {
        formik.handleChange(e)
        if (e.target.value) {
            fetch(`/api/search_users/${e.target.value}`).then((resp) => {
                if (resp.status === 200) {
                    resp.json().then((userList) => {
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
        if (e.target == results) {
            e.preventDefault()
        } else {            
            results.style.display = 'none';
            e.target.style.width = '169px';
        }
    }

    function handleMouseDown(u) {
        navigate(`/${u}`)
    }

    let renderedDynamicSearch = null
    if (users) {
        renderedDynamicSearch = users.map((u, index) => {
            return (
                <div className="result" key={index} onMouseDown={() => handleMouseDown(u.username)}>
                    <NavLink to={`/${u.username}`}>
                        <img src={u.profile_pic ? `/api/${u.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" />
                        <div className="user_info">
                            <span>{u.username}</span>
                            {user.friendships.map((friend) => friend.id).includes(u.id) ? (u.id === user.id ? <span>you</span> : <span>friend</span>) : <span>x mutual friends</span>}
                        </div>
                    </NavLink>
                </div>
            )
        })
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
                        <form onFocus={handleSearchFocus} onBlur={handleSearchBlur}>
                            <input type='text'name="queryTerm" value={formik.values.queryTerm} onChange={handleSearchChange} placeholder='Search Barter Hive' autoComplete="off" />
                        </form>
                        <div className="dynamicResults text">
                            {users ? renderedDynamicSearch : <div className="no_results">No results</div>}
                        </div>
                    </div>
                </div>
                <div className="navlinks">
                    <NavLink to='/'><button>Home</button></NavLink>
                    <NavLink to={`/${user.username}`}><button>My Page</button></NavLink>
                </div>
                <div className="notifications">
                    {!user ? <NavLink to="/login">Login</NavLink> : null}
                    {!user ? <NavLink to='/signup'>Signup</NavLink> : null}
                    <img id="user_pic" src={user.profile_pic ? `/api${user.profile_pic}` : no_pic} className="profile-pic" alt="user-pic" />
                    <div className="status"><img src={isActive ? active : inactive} alt="status" /></div>
                    <div className="user_dropdown">
                        <div></div>
                        <div className="dropdown_buttons">
                            {user ? <NavLink to={`/${user.username}`}>My Page</NavLink> : null}
                            {user ? <NavLink to='/settings'>Settings</NavLink> : null}
                            {user ? <NavLink onClick={handleLogoutClick}>Log Out</NavLink> : null}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar