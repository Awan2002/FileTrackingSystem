import React , {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import {auth, db} from "../firebase"
import { doc, setDoc } from 'firebase/firestore'

const Register = ({setShowNav}) => {
  const [err, setError] = useState(false);
  const navigate = useNavigate();
  const [values, setValues] = useState({
    displayName : "",
    email : "",
    password : "",
    role : "",
    department : "",
    photoUrl : ""
  });
  useEffect(() => {
    setShowNav(false);
    // eslint-disable-next-line
  },[]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({
      ...values,
      [name] : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(values);
    try {
      //Setting authentication
      const res = await createUserWithEmailAndPassword(auth, values.email, values.password);
      
      //Saving the Display name for the user
      await updateProfile(res.user, {
        displayName : values.displayName
      });
      console.log(res.user);
      await setDoc(doc(db, "users", res.user.uid), {
        uid : res.user.uid,
        displayName : values.displayName,
        email : values.email,
        role : values.role,
        department : values.department,
        photoUrl : values.photoUrl
      });

      await setDoc(doc(db, "userFiles", res.user.uid), {});
      setShowNav(true);
      navigate('/inbox');


    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  return (
    <div id="site-main">
      <div className="container">
        <div className="title">
            <h2>Register</h2>
        </div>
        <form action="" className="form" onSubmit={handleSubmit}>
        <div className="user">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" name="displayName" placeholder="Awan" required onChange={handleChange}/>
            </div>
          </div>
          <div className="user">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" placeholder="example@gmail.com" required onChange={handleChange}/>
            </div>
          </div>
          <div className="user">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="Password" required onChange={handleChange}/>
            </div>
          </div>
          <div className="user">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select name="role" required onChange={handleChange}>
                <option value="-">---</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Head of Department">Head of Department</option>
              </select>
            </div>
          </div>
          <div className="user">
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select name="department"required onChange={handleChange}>
                <option value="-">---</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Machanical Engineering">Machanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
          </div>
          <div className="user">
            <div className="form-group">
              <button>Register</button>
              {err && <span>Something went Wrong!</span>}
            </div>
          </div>
        </form>
        <div className='new-user already-user'>
            <span>Already a User ? <Link to={"/"}>Login</Link></span>
        </div>
      </div>
    </div>
  )
}

export default Register