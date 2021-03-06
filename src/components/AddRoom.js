import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Alert,
  Spinner,
} from "reactstrap";
import firebase from "../Firebase";

function AddRoom() {
  const history = useHistory();
  const [room, setRoom] = useState({ roomname: "" });
  const [showLoading, setShowLoading] = useState(false);
  const ref = firebase.database().ref("rooms/");


  const save = (e) => {
    e.preventDefault();
    setShowLoading(true);
    ref.orderByChild('roomname').equalTo(room.roomname).once('value', snapshot => {
        if (snapshot.exists()) {
            return (
                <div>
                    <Alert color="primary">
                        Room name already exist!
                    </Alert>
                </div>
            );
        } else {
            const newRoom = firebase.database().ref('rooms/').push();
            newRoom.set(room);
            history.goBack();
            setShowLoading(false);
        }
    });
};

const onChange = (e) => {
    e.persist();
    setRoom({...room, [e.target.name]: e.target.value});
}

return (
        <div class='mainCont'>
            {showLoading &&
                <Spinner color="primary" />
            }
            <div class="rounded px-3 px-sm-4 py-3 py-sm-5">
                <h2>Please enter new Room</h2>
                <form onSubmit={save}>
                        <input type="text" name="roomname" id="roomname" placeholder="Enter Room Name" value={room.roomname} onChange={onChange} />
                    <button variant="primary" type="submit">
                        Add
                    </button>
                </form>
        </div>
        </div>
    );
}
export default AddRoom