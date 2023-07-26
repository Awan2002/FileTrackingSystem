import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

const Forward = () => {
  const {currentUser} = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [values, setValues] = useState({});
  const {fileId} = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const handleusers = async () => {
      const temp = [];
      const querysnapshot = await getDocs(collection(db, "users"));
      querysnapshot.forEach((doc) => {
        if (doc.data().uid !== currentUser.uid) {
          temp.push({
            uid: doc.data().uid,
            displayName: doc.data().displayName,
          });
        }
      });
      setUsers(temp);
    };

    handleusers();

    const handleFile = async () => {
      console.log(fileId);
      try {
        const docSnap = await getDoc(doc(db, "userFiles", currentUser.uid));
        let found = false;
        if(docSnap.exists()){
          const sentFiles = docSnap.data().sent;
          // console.log(sentFiles);
          if(sentFiles){
            for(const dc of sentFiles){
              if(dc.id === fileId){
                  const dic = {
                      subject : dc.subject,
                  }
                  found = true;
                  setValues(dic);
                  break;
              }
            }
          }
        }

        if(!found && docSnap.exists()){
          const receive = docSnap.data().receive;
          // console.log(receive);
            for(const dc of receive){
              if(dc.id === fileId){
                  const dic = {
                      subject : dc.subject,
                  }
                  found = true;
                  setValues(dic);
                  break;
              }
            }
        }

        if(!found){
          console.log("File not found");
        }

      } catch (err) {
        console.log(err);
      }
    };

    handleFile();
    // eslint-disable-next-line
  }, [fileId]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const doc1 = { displayName: currentUser.displayName, uid: currentUser.uid };
    const doc2 = users.find((user) => user.uid === values.select);
    const date = new Date();
    await updateDoc(doc(db, "userFiles", doc1.uid), {
      sent: arrayUnion({
        id: fileId,
        subject: values.subject,
        to_id: doc2.uid,
        to_displayName: doc2.displayName,
        date: date,
      }),
      forwarded: arrayUnion({
        id: fileId,
        subject: values.subject,
        to_id: doc2.uid,
        to_displayName: doc2.displayName,
        date: date,
      })
    });

    await updateDoc(doc(db, "files", fileId), {
      holder_id : doc2.uid,
      holder_displayName : doc2.displayName
    })
    await updateDoc(doc(db, "userFiles", doc2.uid), {
      receive: arrayUnion({
        id: fileId,
        subject: values.subject,
        from_id: doc1.uid,
        from_displayName: doc1.displayName,
        // description: values.description,
        date: date,
      }),
    });

    navigate("/sent");
  }


  return (
    <div id="forward">
      <div className="container">
        <form action="" onSubmit={handleSubmit}>
          <div className="forward">
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" name="subject" readOnly value={values.subject} />
            </div>
          </div>
          <div className="forward">
            <div className="form-group">
              <select
                name="select"
                id=""
                value={values.select}
                onChange={handleChange}
              >
                <option value="">--</option>
                {users.map((user) => (
                  <option value={user.uid} key={user.uid}>
                    {user.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="forward">
            <div className="form-group">
            <button className="send">Forward</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Forward;
