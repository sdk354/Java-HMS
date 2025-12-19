import { Link } from "react-router-dom";
import "./login.css"; 

export default function Register() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Register as Guest</h2>
        <p className="login-subtitle">
          Create a new account to book your stay
        </p>

        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>

        <button className="login-btn">Register</button>

        <p style={{ textAlign: "center", marginTop: "15px" }}> Already have an account?{" "}
        <Link to="/" className="signup-link"> Sign In</Link>
        </p>
      </div>
    </div>
  );
}
