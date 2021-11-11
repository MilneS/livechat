import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "reactstrap";
import firebase from "../Firebase";
import "../Styles.css";

function Login() {
  const history = useHistory();
  const [creds, setCreds] = useState({ nickname: "" });
  const [showLoading, setShowLoading] = useState(false);
  const ref = firebase.database().ref("users/");

  const login = (e) => {
    e.preventDefault();
    setShowLoading(true);
    ref
      .orderByChild("nickname")
      .equalTo(creds.nickname)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          localStorage.setItem("nickname", creds.nickname);
          history.push("/roomlist");
          setShowLoading(false);
        } else {
          const newUser = firebase.database().ref("users/").push();
          newUser.set(creds);
          localStorage.setItem("nickname", creds.nickname);
          history.push("/roomlist");
          setShowLoading(false);
        }
      });
  };

  const onChange = (e) => {
    e.persist();
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  return (
    <div class='mainCont'>
      <h1>Login to start chatting.</h1>
      <div class="loginContainer">
        {showLoading && <Spinner color="primary" />}
        <div class="loginFormContainer">
          <form onSubmit={login}>
            <label class="label">Username</label>
            <input
              type="text"
              name="nickname"
              id="nickname"
              placeholder="Enter Your Username"
              value={creds.nickname}
              onChange={onChange}
              class="loginInput"
            />
            <button class="button">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
