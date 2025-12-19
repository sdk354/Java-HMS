import './Login.css';
import { Link } from "react-router-dom";
export default function Login() {
  return (
    <div className="login-container">
      <div className="login-card">

        <h2 className="login-title">Grand Plaza Hotel</h2>
        <p className="login-subtitle">
          Welcome to our hotel management system
        </p>

        <div className="form-group">
          <label>Username</label>
          <input type="text" placeholder="Enter your username" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        <button className="login-btn">Sign In</button>
        <p className="register-text" style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account? 
        <Link to="/register" className="register-link">Register</Link>
        </p>

      </div>
    </div>
  );
}