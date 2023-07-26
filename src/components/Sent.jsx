import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import Empty from "./Empty";

const Sent = () => {
  const { currentUser } = useContext(AuthContext);
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMails = async () => {
      const today = new Date().getTime();
      try {
        const docSnap = await getDoc(doc(db, "userFiles", currentUser.uid));
        if (docSnap.exists()) {
          const sent = docSnap.data().sent;
          const temp = await Promise.all(
            sent.map(async (docs) => {
              const document = await getDoc(doc(db, "files", docs.id));
              const dt = (docs.date.seconds)*1000;
              const mailData = {
                id: docs.id,
                subject: docs.subject,
                to_displayName: docs.to_displayName,
                to_id: docs.to_id,
                description: docs.description,
                date: Math.floor(Math.abs(today - dt)/(1000*3600*24)),
                holder_id: document.data().holder_id,
                holder_displayName: document.data().holder_displayName,
                status: document.data().status,
              };
              return mailData;
            })
          );
          setLoading(true);
          temp.sort((a, b) => b.date - a.date);
          setMails(temp.filter(mail => mail !== null));
        } else {
          console.log("document does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    };

    handleMails();
  }, [currentUser]);
  return (
    <div id="table-div">
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>To</th>
            <th>Status</th>
            <th>Action</th>
            <th>Days Left</th>
          </tr>
        </thead>
        </table>
        {!loading ? (
          <Empty />
        ) : (
          <table className="table">
            <tbody>
              {mails.map((mail, index) => (
                <tr key={mail.id}>
                  <td>{index + 1}</td>
                  <td>{mail.subject}</td>
                  <td onClick = {() => navigate(`/${mail.to_id}`)}style={{cursor : "pointer"}}>{mail.to_displayName}</td>
                  <td
                    style={{
                      color:
                        mail.status.toLowerCase().trim() === "accepted"
                          ? "green"
                          : mail.status.toLowerCase().trim() === "rejected"
                          ? "red"
                          : "inherit",
                    }}
                  >
                    {mail.status}
                  </td>
                  <td>
                    <Link to={`/inbox/${mail.id}`}>
                      <AiFillEdit />
                    </Link>
                  </td>
                  <td>{(15 - mail.date) > 0 ? (15-mail.date) : "Late"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
};

export default Sent;
