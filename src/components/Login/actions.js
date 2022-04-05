export const login = async (email, password) => {
	return fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	}).then((res) => res.json());
};
