import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import HTMLReactParser from 'html-react-parser'

const ConfirmModal = ({ show, onAction, title, content }) => {
	return (
		<Modal
			show={show}
			onHide={() => onAction('MODAL_ACTION_CLOSE')}
			backdrop="static"
			keyboard={false}
			animation={false}>
			<Modal.Header closeButton>
				<Modal.Title className="h5">{HTMLReactParser(title)}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{HTMLReactParser(content)}</Modal.Body>
			<Modal.Footer>
				<Button
					variant="secondary"
					onClick={() => onAction('MODAL_ACTION_CLOSE')}>
					Cancel
				</Button>
				<Button
					variant="danger"
					onClick={() => onAction('MODAL_ACTION_CONFIRM')}>
					Confirm
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

export default ConfirmModal
