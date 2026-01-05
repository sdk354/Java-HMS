import { Link } from "react-router-dom";

export default function Register() {
	return (
		<div className="auth-card">
			<h2 className="login-title">Register as Guest</h2>
			<p className="login-subtitle">Create a new account to book your stay</p>

			<div className="form-group">
				<label htmlFor="name">Full Name</label>
				<input id="name" name="name" type="text" placeholder="Enter your full name" />
			</div>

			<div className="form-group">
				<label htmlFor="email">Email</label>
				<input id="email" name="email" type="email" placeholder="Enter your email" />
			</div>

			<div className="form-group">
				<label htmlFor="password">Password</label>
				<input id="password" name="password" type="password" placeholder="Enter your password" />
			</div>

			<button className="button-accent">Register</button>

			<p className="register-text" style={{ textAlign: "center", marginTop: "1rem" }}>
				Already have an account?{" "}
				<Link to="/login" className="register-link">Sign In</Link>
			</p>
		</div>
	);
}
