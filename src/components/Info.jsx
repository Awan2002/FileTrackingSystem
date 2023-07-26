import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Comments from './Comments';

const Info = () => {
  const {currentUser} = useContext(AuthContext);
  const {fileId} = useParams();
  const [viewDetails, setViewDetails] = useState({});

  useEffect(() => {
    const handleFile = async (collectionPath) => {
      try {
        const docSnap = await getDoc(doc(db, collectionPath, currentUser.uid));
        let foundFile = false;

        if (docSnap.exists()) {
          const sentFiles = docSnap.data().sent;
          
          if(sentFiles){
            for (const dc of sentFiles) {
              if (dc.id === fileId) {
                const fileSnap = await getDoc(doc(db, "files", fileId));
                
                var curseconds = fileSnap.data().creationTime.seconds;
                var currentdate = new Date(curseconds*1000);
                var day = currentdate.toLocaleDateString();
                var time = currentdate.toLocaleTimeString();
                var dt = day + "  " + time;
                const dic = {
                  subject: dc.subject,
                  holder: fileSnap.data().holder_displayName,
                  status: fileSnap.data().status,
                  downloadURL: fileSnap.data().downloadUrl,
                  date : dt
                };

                setViewDetails(dic);
                foundFile = true;
                break;
              }
            }
          }
        }

        if (!foundFile && docSnap.exists()) {
          const receiveFiles = docSnap.data().receive;
          for (const dc of receiveFiles) {
            if (dc.id === fileId) {
              const fileSnap = await getDoc(doc(db, "files", fileId));
              curseconds = fileSnap.data().creationTime.seconds;
              currentdate = new Date(curseconds*1000);
              day = currentdate.toLocaleDateString();
              time = currentdate.toLocaleTimeString();
              dt = day + "  " + time;
              const dic = {
                subject: dc.subject,
                holder: fileSnap.data().holder_displayName,
                status: fileSnap.data().status,
                downloadURL: fileSnap.data().downloadUrl,
                date : dt
              };

              setViewDetails(dic);
              foundFile = true;
              break;
            }
          }
        }

        if (!foundFile) {
          console.log("File not found in sent or receive collection.");
        }
      } catch (err) {
        console.log(err);
      }
    };

    handleFile("userFiles"); // Check in the "userFiles" collection which contains both "sent" and "receive"
  }, [currentUser.uid, fileId]);

  const handleAccept = async (e) => {
    e.preventDefault();
    setViewDetails({ ...viewDetails, status: "Accepted" });
    await updateDoc(doc(db, "files", fileId), {
      status: "Accepted",
    });
  };
  const handleReject = async (e) => {
    e.preventDefault();
    setViewDetails({ ...viewDetails, status: "Rejected" });
    await updateDoc(doc(db, "files", fileId), {
      status: "Rejected",
    });
  };


  return (
    <>
    <div id='info'>
      <div className='container'>
        <form action="">
          <div className="info">
            <div className="form-group">
            <label >Subject</label>
            <input type="text" readOnly value={viewDetails.subject}/>
            </div>
          </div>
          <div className="info">
            <div className="form-group">
              <div className='person'>
              <label >Holder</label>
                <input type="text" readOnly value={viewDetails.holder}/>
              </div>
            </div>
          </div>
          <div className="info">
            <div className="form-group">
              <div className='person'>
              <label >Creation Time</label>
                <input type="text" readOnly value={viewDetails.date}/>
              </div>
            </div>
          </div>
          <div className="info">
            <div className="form-group">
              <div className='person'>
              <label >Status</label>
                <input style={{
                    color:
                      viewDetails.status === "Accepted"
                        ? "green"
                        : viewDetails.status === "Rejected"
                        ? "red"
                        : "inherit",
                  }} type="text" readOnly value={viewDetails.status}/>
              </div>
              <div className='status'>
                <button className='accept' onClick={handleAccept}>Accept</button>
                <button className='reject' onClick={handleReject}>Reject</button>
              </div>
            </div>
          </div>
          <div className="info">
            <div className="form-group">
            <label >File</label>
              <a href={viewDetails.downloadURL} target="_blank"  rel="noreferrer">Click to See</a>
            </div>
          </div>
          <div className="info">
            <div className="form-group button-grp">
            <button className="back"><Link to="/compose" style={{ textDecoration: "none", color: "#2b2d42" }}>Back</Link></button>
            <button className="back"><Link to="forward" style={{ textDecoration: "none", color: "#2b2d42" }}>Forward</Link></button>
            </div>
          </div>
        </form>
      </div>
    </div>
      <Comments fileId = {fileId}/>
    </>
  )
}

export default Info