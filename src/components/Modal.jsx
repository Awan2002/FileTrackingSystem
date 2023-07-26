import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";

const Modal = () => {
    const id = useParams();
    const [user, setUser] = useState({});

    useEffect(() => {
        const handleUser = async() => {
            const snapShot = await getDoc(doc(db, "users", id.id));

            if(snapShot.exists()){
                console.log(snapShot.data());
                setUser(snapShot.data());
            }
        }

        handleUser();
        // eslint-disable-next-line
    }, [])

  return (
      <div id="profile">
        <div className="container">
          <div className="profile">
            <div className="img">
              <img
                src={user.photoUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwJoaqh-Ehrbg2Qf6Nk_XiblTuvyyiOwsc2g&usqp=CAU"}
                alt=""
              />
            </div>
            <div className="info">
              <div>
                <label>Name : </label>
                <input type="text" readOnly placeholder={user.displayName} />
              </div>
              <div>
                <label>Email : </label>
                <input type="text" readOnly placeholder={user.email} />
              </div>
              <div>
                <label>Role : </label>
                <input type="text" readOnly placeholder={user.role} />
              </div>
              <div>
                <label>Department : </label>
                <input type="text" readOnly placeholder={user.department} />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Modal;
