import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  // If user is already logged in, redirect to home
  if (sessionUser) return <Navigate to="/" replace={true} />;

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  // Handle demo user login
  const handleDemoLogin = async () => {
    const serverResponse = await dispatch(
      thunkLogin({
        email: 'demo@aa.io', // Use your actual demo user email
        password: 'password'
      })
    );
    if (serverResponse) {
      setErrors({ credential: "Demo login failed" });
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <h1>Log In</h1>
      {/* Display errors if any */}
      {Array.isArray(errors) && errors.length > 0 &&
        errors.map((message) => <p key={message}>{message}</p>)}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <button type="submit">Log In</button>

        {/* Demo User Login Button */}
        <button
          type="button"
          className="demo-login-button"
          onClick={handleDemoLogin}
        >
          Log in as Demo User
        </button>
      </form>
    </>
  );
}

export default LoginFormPage;