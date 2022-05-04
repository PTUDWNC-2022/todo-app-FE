import React, { useEffect, useState } from 'react';
import {
	Form,
	OverlayTrigger,
	Alert,
	Modal,
	Button,
	Tooltip,
} from 'react-bootstrap';
import HTMLReactParser from 'html-react-parser';

import './Modal.css';

const InviteMemberModal = ({ show, onAction, title, inviteLink }) => {
	// Local state
	const [inviteMethod, setInviteMethod] = useState('email');
	const [listEmailInvite, setListEmailInvite] = useState([]);
	const [emailInvite, setEmailInvite] = useState('');
	const [isCopy, setIsCopy] = useState(false);
	const [sendInviteEmailStatus, setSendInviteEmailStatus] = useState('');

	// Use effect
	useEffect(() => {
		if (isCopy) {
			setTimeout(() => {
				setIsCopy(false);
			}, 3000);
		}
	}, [isCopy]);

	// General method
	const handleAddEmailInvite = (e) => {
		e.preventDefault();

		if (emailInvite.length > 0) {
			setListEmailInvite([...listEmailInvite, emailInvite]);
			setEmailInvite('');
		}
	};

	const handleRemoveEmailInvite = (index) => {
		setListEmailInvite(listEmailInvite.filter((_, i) => i !== index));
	};

	const handleCopyLinkToClipboard = () => {
		setIsCopy(true);
		navigator.clipboard.writeText(inviteLink);
	};

	const sendInviteEmail = async () => {
		try {
			if (inviteMethod === 'email') {
				//
			}
			setSendInviteEmailStatus('successfully');
		} catch (error) {
			setSendInviteEmailStatus('fail');
		}
	};

	const notifySendInviteEmailStatus = () => {
		if (sendInviteEmailStatus === 'successfully') {
			return <Alert variant="success">Send invite email successfully!</Alert>;
		} else if (sendInviteEmailStatus === 'fail') {
			return <Alert variant="error">Send invite email fail!</Alert>;
		}
	};

	const inviteByEmailComponent = () => {
		return (
			<>
				<Form.Control
					value={emailInvite}
					id="email-invite"
					name="email-invite"
					sx={{ ml: 1, flex: 1 }}
					placeholder="Enter email address"
					onChange={(e) => setEmailInvite(e.target.value)}
				/>
			</>
		);
	};

	const inviteByLinkComponent = () => {
		return (
			<>
				<Form.Control
					value={inviteLink}
					id="link-invite"
					name="link-invite"
					disabled
					readOnly
				/>

				<OverlayTrigger
					placement="bottom"
					delay={{ show: 250, hide: 400 }}
					overlay={
						<Tooltip>{isCopy ? 'Copied' : 'Copy to clipboard'}</Tooltip>
					}>
					<Button
						className="btn-copy-link"
						variant="secondary"
						type="submit"
						onClick={handleCopyLinkToClipboard}>
						Copy link
					</Button>
				</OverlayTrigger>
			</>
		);
	};

	return (
		<React.Fragment>
			<Modal
				show={show}
				onHide={() => onAction('MODAL_ACTION_CLOSE')}
				centered
				backdrop={true}
				keyboard={false}
				animation={false}>
				<Modal.Header closeButton>
					<Modal.Title className="h5">{HTMLReactParser(title)}</Modal.Title>
				</Modal.Header>
				<Modal.Body className="invite-modal">
					{notifySendInviteEmailStatus()}

					{inviteMethod === 'email'
						? inviteByEmailComponent()
						: inviteByLinkComponent()}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="outline-secondary"
						onClick={() =>
							setInviteMethod(inviteMethod === 'email' ? 'link' : 'email')
						}>
						{inviteMethod === 'email' ? 'Invite by link' : 'Invite via email'}
					</Button>
					{inviteMethod === 'email' ? (
						<Button variant="primary" type="submit" onClick={sendInviteEmail}>
							Invite
						</Button>
					) : (
						<div></div>
					)}
				</Modal.Footer>
			</Modal>
		</React.Fragment>
	);
};

export default InviteMemberModal;
