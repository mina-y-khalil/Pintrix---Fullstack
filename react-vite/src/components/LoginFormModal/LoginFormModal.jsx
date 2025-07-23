import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

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
      closeModal();
    }
  };

  return (
    <>
      <h1>Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="error-text">{errors.email}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="error-text">{errors.password}</p>}
        <button type="submit" className="login-button">Log In</button>

        {/*DEMO-USER BUTTON -LA */}
        <button
        type="button"
        className="demo-login-button"
        onClick={async () => {
          const serverResponse = await dispatch(
            thunkLogin({ email: 'demo@aa.io', password: 'password' })
          );
          if (serverResponse) {
            setErrors({ credential: "Demo login failed"});
          } else {
            closeModal();
          }
        }}>Log in as Demo User</button>


      </form>
    </>
  );
}

export default LoginFormModal;