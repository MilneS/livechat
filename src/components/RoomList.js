import Moment from "moment";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Spinner } from "reactstrap";
import firebase from "../Firebase";
import "../Styles.css";

function RoomList() {
  const [room, setRoom] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setNickname(localStorage.getItem("nickname"));
      firebase
        .database()
        .ref("rooms/")
        .on("value", (resp) => {
          setRoom([]);
          setRoom(snapshotToArray(resp));
          setShowLoading(false);
        });
    };

    fetchData();
  }, []);

  const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
  };

  const enterChatRoom = (roomname) => {
    const chat = {
      roomname: "",
      nickname: "",
      message: "",
      date: "",
      type: "",
    };
    chat.roomname = roomname;
    chat.nickname = nickname;
    chat.date = Moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
    chat.message = `${nickname} enter the room`;
    chat.type = "join";
    const newMessage = firebase.database().ref("chats/").push();
    newMessage.set(chat);

    firebase
      .database()
      .ref("roomusers/")
      .orderByChild("roomname")
      .equalTo(roomname)
      .on("value", (resp) => {
        let roomuser = [];
        roomuser = snapshotToArray(resp);
        const user = roomuser.find((x) => x.nickname === nickname);
        if (user !== undefined) {
          const userRef = firebase.database().ref("roomusers/" + user.key);
          userRef.update({ status: "online" });
        } else {
          const newroomuser = { roomname: "", nickname: "", status: "" };
          newroomuser.roomname = roomname;
          newroomuser.nickname = nickname;
          newroomuser.status = "online";
          const newRoomUser = firebase.database().ref("roomusers/").push();
          newRoomUser.set(newroomuser);
        }
      });
    history.push("/chatroom/" + roomname);
  };

  const logout = () => {
    localStorage.removeItem("nickname");
    history.push("/login");
  };

  return (
    <div class="mainCont">
      {showLoading && <Spinner color="primary" />}
      <div class="secondCont">
        <div class="enter">
          Welcome {nickname},{" "}
          <span class="loginLink">
            <Link to="/addroom">Add a room</Link>
          </span>
        </div>
        <div class="enter">
          or enter a chatroom:
          <ul>
            {room.map((item, idx) => (
              <li
                key={idx}
                action
                onClick={() => {
                  enterChatRoom(item.roomname);
                }}
              >
                {item.roomname}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div class="logout">
        <button
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default RoomList;
