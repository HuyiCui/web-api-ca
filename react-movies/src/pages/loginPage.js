import React, { useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { Link } from "react-router-dom";

const LoginPage = (props) => {
  const context = useContext(AuthContext);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    context.authenticate(userName, password);
  };

  let location = useLocation();
  const { from } = location.state ? { from: location.state.from.pathname } : { from: "/" };

  if (context.isAuthenticated) {
    return <Navigate to={from} />;
  }

  return (
    <>
      <h2>Login Page</h2>
      <p>You must log in to view the protected pages.</p>

      <input
        id="username"
        placeholder="User Name"
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />

      <input
        id="password"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <button onClick={login}>Log in</button>

      <p>
        No account yet?{" "}
        <Link to="/signup">
          Please register
        </Link>
      </p>
    </>
  );
};

export default LoginPage;
