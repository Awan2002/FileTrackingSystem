import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {signInWithEmailAndPassword} from "firebase/auth"
import {auth} from "../firebase"

const Login = ({setShowNav}) => {
  const [err, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowNav(false);
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try{
      await signInWithEmailAndPassword(auth, email, password);
      setShowNav(true);
      navigate("/inbox");
    }catch(error) {
      console.log(error);
      setError(true);
    }
  }
  return (
    <div id="site-main">
      <div className="container">
        <div className="title">
            <h2>Login</h2>
        </div>
        <form action="" className="form" onSubmit={handleSubmit}>
          <div className="user">
            <div className="form-group">
              <label htmlFor="name">Email</label>
              <input type="text" name="email" placeholder="example@gmail.com" />
            </div>
          </div>
          <div className="user">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="Password" />
            </div>
          </div>
          <div className="user">
            <div className="form-group">
              <button>Login</button>
              {err && <span>Something went Wrong!</span>}
            </div>
          </div>
        </form>
        <div className='new-user'>
            <span>New User ? <Link to={"/register"}>Register</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
