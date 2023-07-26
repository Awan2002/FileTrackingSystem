import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Comments = ({ fileId }) => {
  const [comment, setComment] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [value, setValue] = useState("");

  useEffect(() => {

    const handlecomment = async () => {
      const queryShot = await getDoc(doc(db, "files", fileId));
      if (queryShot.exists()) {
        const text = queryShot.data().comments;
        const temp = [];
        text.forEach((doc) => {
          const curseconds = doc.time.seconds;
          var currentdate = new Date(curseconds * 1000);
          var day = currentdate.toLocaleDateString();
          var time = currentdate.toLocaleTimeString();
          var dt = day + "  " + time;
          temp.push({
            ...doc,
            time: dt,
          });
        });
        setComment(temp);
      }
    };
    handlecomment();
    const getUser = async () => {
        const snapshot = await getDoc(doc(db, "users", currentUser.uid));
        setUser(snapshot.data());
    }
    if(currentUser){
        getUser();
    }
  }, [setComment]);


  const handleClick = async (e) => {
    e.preventDefault();
    let time = new Date();
    let new_data = {
        user_id : user.uid,
        displayName : user.displayName,
        photoUrl : user.photoUrl,
        comment : value,
        time : time,
    }
    await updateDoc(doc(db, "files", fileId), {
        comments : arrayUnion(new_data)
    });
    time = new Date().toISOString();
    new_data.time = time;
    const new_comment = [...comment, new_data];
    setComment(new_comment);
    setValue("");
  }

  return (
    <div id="comment">
      <section>
        <header>
          <div className="msger-header-title">
            <i className="fas fa-comment-alt"></i> Remarks
          </div>
          <div className="msger-header-options">
            <span>
              <i className="fas fa-cog"></i>
            </span>
          </div>
        </header>
        <main>
        {comment.length > 0 && comment.map((msg) => (
            <div className={`msg ${msg.user_id === currentUser.uid ? "right-msg" : "left-msg"}`}>
              <img
                src={msg.photoUrl === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwJoaqh-Ehrbg2Qf6Nk_XiblTuvyyiOwsc2g&usqp=CAU" : msg.photoUrl}
                alt=""
              />

              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">{msg.displayName}</div>
                  <div className="msg-info-time">{msg.time}</div>
                </div>

                <div className="msg-text">
                  {msg.comment}
                </div>
              </div>
            </div>
        ))}
        </main>
        <form>
          <input type="text" placeholder="Enter your Remark/Doubt..." value={value} onChange={(e) => setValue(e.target.value)}/>
          <button onClick={handleClick}>Send</button>
        </form>
      </section>
    </div>
  );
};

export default Comments;
