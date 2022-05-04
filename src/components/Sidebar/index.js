import React, { useContext, useEffect, useState } from 'react';
import { FloatingLabel, Form, ListGroup } from 'react-bootstrap';

import './Sidebar.css';
import { authHeader } from '../../api/auth';
import { LabelContext } from '../../contexts/LabelContext';
import { ListContext } from '../../contexts/ListContext';
import InviteMemberModal from '../CommonModal/InviteMemberModal';

const Sidebar = () => {
	const defaultLabels = [
		'My day',
		'Important',
		'Planned',
		'Assigned to me',
		'Flagged email',
		'Task',
	];
	const [newList, setNewList] = useState('');
	const labelContext = useContext(LabelContext);
	const listContext = useContext(ListContext);
	const [showInviteModal, setShowInviteModal] = useState(false);
	const [inviteLink, setInviteLink] = useState('1');

	const user =
		localStorage.getItem('authInfo') &&
		JSON.parse(localStorage.getItem('authInfo')).user;

	const toggleShowInviteModal = (list) => {
		console.log(list);
		listContext.setSelectedList(list);
		setShowInviteModal(!showInviteModal);
	};

	const fetchLabels = async () => {
		const resp = await fetch(
			`${process.env.REACT_APP_API_URL}/labels/${user._id}`,
			{
				method: 'GET',
				headers: authHeader(),
			}
		);
		const respJson = await resp.json();

		labelContext.setDocumentId(respJson.insertedId || respJson._id);
		labelContext.setLabels(
			respJson.insertedId
				? []
				: [...defaultLabels, ...respJson.additionalLabels]
		);
		// setLabels([...defaultLabels, ...respJson.additionalLabels]);
	};

	useEffect(() => {
		void fetchLabels();
		void fetchLists();
	}, []);

	useEffect(() => {
		async function fetchData() {
			const inviteListLink = await createInviteLink(
				listContext.selectedList._id
			);
			setInviteLink(inviteListLink);
		}
		fetchData();
	}, [listContext.selectedList]);

	const handleOnChangeNewList = (event) => {
		setNewList(event.target.value);
	};

	const handleRemoveLabel = async (label) => {
		try {
			await fetch(`${process.env.REACT_APP_API_URL}/labels/remove-label`, {
				method: 'PUT',
				headers: authHeader(),
				body: JSON.stringify({
					documentId: labelContext.documentId,
					label: label.trim(),
				}),
			});
			await fetchLabels();
		} catch (e) {
			console.log(e);
		}
	};

	const fetchLists = async () => {
		const resp = await fetch(
			`${process.env.REACT_APP_API_URL}/lists/user/${user._id}`,
			{
				method: 'GET',
				headers: authHeader(),
			}
		);
		const respJson = await resp.json();

		listContext.setLists(respJson);
	};

	const handleEnter = async (event) => {
		if (event.key === 'Enter') {
			await fetch(`${process.env.REACT_APP_API_URL}/lists`, {
				method: 'POST',
				headers: authHeader(),
				body: JSON.stringify({
					name: newList,
					isPublish: false,
					creator: user._id,
					users: [user],
					disabled: false,
					todos: [],
				}),
			});
			setNewList('');
			await fetchLists();
		}
	};

	const onListNameBlurred = async (event) => {
		if (
			event.currentTarget.textContent === listContext.selectedList.name ||
			!event.currentTarget.textContent
		)
			return;
		else {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/lists/update`,
				{
					method: 'PUT',
					headers: authHeader(),
					body: JSON.stringify({
						...listContext.selectedList,
						name: event.currentTarget.textContent,
					}),
				}
			);
		}
	};

	const createInviteLink = async (listId) => {
		const resp = await fetch(
			`${process.env.REACT_APP_API_URL}/lists/${listId}/invite/link`,
			{
				method: 'GET',
				headers: authHeader(),
			}
		);
		const result = await resp.json();
		return result.data;
	};

	console.log(listContext.selectedList);
	return (
		<div className={'sidebar'}>
			<ListGroup variant="flush">
				<ListGroup.Item className={'label-item'} action>
					<i className="bi bi-brightness-high"></i>
					<span className={'label-name'}>All</span>
				</ListGroup.Item>
				{listContext.lists.sort().map((list) => {
					return (
						!list.disabled && (
							<ListGroup.Item
								className={'additional-label'}
								action
								onClick={() => listContext.setSelectedList(list)}>
								<div className={'list-item'}>
									<i
										className="bi bi-list-check"
										style={{ flexBasis: 'auto' }}></i>
									<span
										contentEditable
										role="textbox"
										type="text"
										className={'list-name'}
										onBlur={onListNameBlurred}>
										{list.name}
									</span>
								</div>
								<span className="share-icon">
									<i
										className="bi bi-people"
										onClick={toggleShowInviteModal}></i>
								</span>
								<span className={'remove-label'}>
									<i
										className="bi bi-x-circle"
										onClick={() => handleRemoveLabel(list)}></i>
								</span>
							</ListGroup.Item>
						)
					);
				})}
			</ListGroup>
			<FloatingLabel
				controlId={'floatingInput'}
				label={'Add new list'}
				className={'mt-2 me-2'}>
				<Form.Control
					id={'new-list-form'}
					type="text"
					placeholder={'ABC'}
					value={newList}
					onChange={handleOnChangeNewList}
					onKeyDown={handleEnter}
				/>
			</FloatingLabel>

			<InviteMemberModal
				show={showInviteModal}
				onAction={toggleShowInviteModal}
				title="Share list"
				inviteLink={inviteLink}
			/>
		</div>
	);
};
export default Sidebar;
