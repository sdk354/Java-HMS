import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:8081/api',
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error.response ? error.response.status : null;
		const originalRequest = error.config;

		// 1. Never redirect on Login/Register errors
		if (originalRequest.url.includes('/auth/')) {
			return Promise.reject(error);
		}

		// 2. 401 Unauthorized: The token is dead. Redirect to login.
		if (status === 401) {
			console.warn("Session expired. Redirecting to login...");
			localStorage.clear();
			window.location.href = "/login";
			return Promise.reject(error);
		}

		// 3. 403 Forbidden: Token is valid, but the ROLE is wrong for this specific API.
		// CRITICAL: Do NOT clear storage or redirect here.
		// Just log the error and let the component handle the failure.
		if (status === 403) {
			console.error(`Permission Denied (403) for: ${originalRequest.url}`);
			// We return the error so the Dashboard/MyReservations can show "Access Denied"
			// instead of the whole app crashing.
			return Promise.reject(error);
		}

		return Promise.reject(error);
	}
);

export default api;