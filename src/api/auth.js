export const authHeader = () => {
	const authString = localStorage.getItem('authInfo');
	const accessToken = authString && (JSON.parse(authString).accessToken || JSON.parse(authString).socialUser.accessToken);

	if (accessToken) {
		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		};
	} else {
		return {};
	}
};
