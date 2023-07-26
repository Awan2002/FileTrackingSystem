import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useContext, useEffect, useState } from 'react'
import {FaAngleDoubleLeft} from "react-icons/fa"

import { useNavigate } from 'react-router-dom'
import { db, storage } from '../firebase';
import {AuthContext} from "../context/AuthContext"
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile = ({setShowNav}) => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [profile, setProfile] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwJoaqh-Ehrbg2Qf6Nk_XiblTuvyyiOwsc2g&usqp=CAU");

    const [info, setInfo] = useState("");

    const {currentUser} = useContext(AuthContext);

    useEffect(() => {
        const handleprofile = async () => {
          const snapshot = await getDoc(doc(db, "users", currentUser.uid));

          const data = snapshot.data();

          setInfo(data);
          if(data.photoUrl){
            setProfile(data.photoUrl);
          }
        }
        handleprofile();
        setShowNav(false);
    },[]);

    const handleback = (e) => {
        e.preventDefault();
        setShowNav(true);
        navigate("/inbox");
    }

    const handleupload = (e) => {
        e.preventDefault();

        const storageref = ref(storage, currentUser.email);
        const uploadTask = uploadBytesResumable(storageref, file);

        uploadTask.on('state_changed' ,
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          // eslint-disable-next-line
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            try{
                console.log(downloadURL);
                setProfile(downloadURL);
                await updateDoc(doc(db, "users", currentUser.uid), {
                    photoUrl : downloadURL,
                })
            }catch(err){
              console.log(err);
            }
          })
        }
      )

    }


  return (
    <div id='profile'>
        <div className="container">
            <div className='back' onClick={handleback}>
                <div className='filter'>
                    <a href="#">
                        <FaAngleDoubleLeft /> Home
                    </a>
                </div>
            </div>

            <div className='profile'>
                <div className='img'>
                    <img src={profile} alt="" />
                    <div>
                      <input type="file" placeholder='Select Image' onChange={(e) => setFile(e.target.files[0])}/>
                      <button onClick={handleupload}>Upload</button>
                    </div>
                </div>
                <div className='info'>
                    <div>
                        <label >Name : </label>
                        <input type="text" readOnly placeholder={info.displayName}/>
                    </div>
                    <div>
                        <label >Email : </label>
                        <input type="text" readOnly placeholder={info.email}/>
                    </div>
                    <div>
                        <label >Role : </label>
                        <input type="text" readOnly placeholder={info.role}/>
                    </div>
                    <div>
                        <label >Department : </label>
                        <input type="text" readOnly placeholder={info.department}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile