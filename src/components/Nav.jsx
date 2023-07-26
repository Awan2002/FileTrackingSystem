import React, { useContext } from 'react'
import { FaUserAlt } from 'react-icons/fa';
import {BiLogOut} from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Nav = ({setShowNav}) => {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClick = () => {
        // setShowNav(false);
        signOut(auth);
        navigate("/");
    }

    const handleprofile = (e) => {
        e.preventDefault();
        
        navigate("/profile");
    }
  return (
    <div id='nav-bar'>
        <div className='nav-container'>
            <div className='profile' onClick={handleprofile}>
                <a href='#' onClick={(e) => e.preventDefault()}>
                    <span className='text-gradient'><i><FaUserAlt /></i>{currentUser.displayName}</span>
                </a>
            </div>
            <div className='comps'>
                <div>
                    <Link to={"/compose"}>Compose</Link>
                </div>
                <div>
                    <Link to={"/inbox"}>inbox</Link>
                </div>
                <div>
                    <Link to={"/sent"}>Sent</Link>
                </div>
            </div>
            <div className='logout' onClick={handleClick}>
                <a href='#' onClick={(e) => e.preventDefault()}>
                    <span className='text-gradient'><i><BiLogOut /></i> Logout</span>
                </a>
            </div>
        </div>
    </div>
  )
}

export default Nav