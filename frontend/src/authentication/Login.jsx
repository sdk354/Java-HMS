import { Link } from "react-router-dom";

export default function Login() {
	return (
		<div className="auth-card">
			<h2 className="login-title">Grand Plaza Hotel</h2>
			<p className="login-subtitle">Welcome to our hotel management system</p>

			<div className="form-group">
				<label htmlFor="email">Email</label>
				<input id="email" name="email" type="email" placeholder="Enter your email" />
			</div>

			<div className="form-group">
				<label htmlFor="password">Password</label>
				<input id="password" name="password" type="password" placeholder="Enter your password" />
			</div>

			<button className="button-accent">Sign In</button>

			<p className="register-text">
				Don’t have an account? <Link to="/register" className="register-link">Register</Link>
			</p>
		</div>
	);
}
