import { Alert } from 'react-bootstrap';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router';

import { authHeader } from '../../api/auth';

const Join = () => {
	const { id } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState('waiting');
	const [isSuccess, setIsSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Call API
	const joinList = async () => {
		setIsLoading(true);

		const inviteToken = searchParams.get('inviteToken');
		const res = await fetch(
			`${process.env.REACT_APP_API_URL}/lists/${id}/join?inviteToken=${inviteToken}`,
			{
				method: 'GET',
				headers: authHeader(),
			}
		);

		const response = await res.json();
		console.log('Join list', response['data']);

		if (response['inviteToken'] === 200) {
			setIsSuccess(true);
		} else {
			setIsSuccess(false);
		}
		setIsLoading(false);
	};

	// Use effect
	useEffect(() => {
		joinList();
	}, []);

	useEffect(() => {
		if (!isLoading) {
			if (isSuccess) {
				setStatus('success');
			} else {
				setStatus('fail');
			}
		} else {
			setStatus('waiting');
		}
	}, [isLoading, isSuccess]);

	useEffect(() => {
		if (status !== 'waiting') {
			setTimeout(() => {
				navigate('/');
			}, 3000);
		}
	}, [status]);

	// Generate component
	const generateAlert = () => {
		if (status === 'success') {
			return (
				<Alert variant="success">Join list successfully. Please wait...</Alert>
			);
		} else if (status === 'fail') {
			return <Alert variant="danger">Join list fail. Please wait...</Alert>;
		} else if (status === 'waiting') {
			return <Alert variant="warning">Waiting please...</Alert>;
		}
	};

	const renderPage = () => {
		return <>{generateAlert(status)}</>;
	};

	return renderPage();
};

export default Join;
