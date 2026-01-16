import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:8081/api'
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => response, (error) => {
	const status = error.response ? error.response.status : null;
	const originalRequest = error.config;

	if (originalRequest.url.includes('/auth/')) {
		return Promise.reject(error);
	}

	if (status === 401) {
		console.warn("Session expired. Redirecting to login...");
		localStorage.clear();
		window.location.href = "/login";
		return Promise.reject(error);
	}

	if (status === 403) {
		console.error(`Permission Denied (403) for: ${originalRequest.url}`);
		return Promise.reject(error);
	}

	return Promise.reject(error);
});

export default api;