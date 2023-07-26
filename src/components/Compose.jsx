import React, { useContext, useEffect, useState } from "react";
import {arrayUnion,collection,doc,getDocs,setDoc,updateDoc,} from "firebase/firestore";
import { db, storage } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";


const Compose = () => {
  const empty = {
    subject : '',
    comment : '',
    select : ''
  }
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [values, setValues] = useState(empty);
  const [file, setFile] = useState(null);
  const [dUrl, setDUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [detail, setDetail] = useState({});
  const navigate = useNavigate();
  const id = uuid();

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
        else{
          setDetail(doc.data());
        }
      });
      setUsers(temp);
    };

    handleusers();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    

    setValues({
      ...values,
      [name]: value,
    });
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const uploadFile = (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `pdfs/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setDUrl(downloadUrl);
        });
        console.log("Upload complete!");
      }
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const doc1 = { displayName: currentUser.displayName, uid: currentUser.uid, photoUrl : detail.photoUrl };
    const doc2 = users.find((user) => user.uid === values.select);
    const timestamp = new Date();
    await updateDoc(doc(db, "userFiles", doc1.uid), {
      sent: arrayUnion({
        id: id,
        subject: values.subject,
        to_id: doc2.uid,
        to_displayName: doc2.displayName,
        date: timestamp,
      }),
    });
    await updateDoc(doc(db, "userFiles", doc2.uid), {
      receive: arrayUnion({
        id: id,
        subject: values.subject,
        from_id: doc1.uid,
        from_displayName: doc1.displayName,
        date: timestamp,
      }),
    });
    

    await setDoc(doc(db, "files", id), {
      holder_id: doc2.uid,
      holder_displayName: doc2.displayName,
      status: "Incomplete",
      downloadUrl : dUrl,
      creationTime : timestamp,
      comments : arrayUnion({
        displayName : currentUser.displayName,
        photoUrl : doc1.photoUrl,
        comment : values.comment,
        time : timestamp,
        user_id : currentUser.uid
      })
    });
    setFile(null);
    setUploadProgress(0);
    setValues(empty);
    navigate("/sent");
  }

  return (
    <div id="compose">
      <div className="container">
        <form action="" onSubmit={handleSubmit}>
          <div className="compose">
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input type="text" name="subject" value = {values.subject} onChange={handleChange} placeholder="Subject" />
            </div>
          </div>
          <div className="compose">
            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <input type="text" name="comment" value={values.comment} onChange={handleChange} placeholder="Write Something" />
            </div>
          </div>
          <div className="compose">
            <div className="form-group">
              <input type="file" onChange={handleFileChange}/>
              <button className="upload" onClick={uploadFile}>Upload File</button>
            </div>
            {uploadProgress > 0 && <div>Upload progress: {uploadProgress}%</div>}
          </div>
          <div className="compose">
            <div className="form-group">
              <select name="select" id="" value={values.select} onChange={handleChange}>
                <option value="">--</option>
                {users.map((user) => (
                  <option value={user.uid} key={user.uid}>
                    {user.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="compose">
            <div className="form-group">
              <button className="send">Send</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Compose;
