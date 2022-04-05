export const register = async (email, password) => {
	fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	}).then((res) => res.json());
};
