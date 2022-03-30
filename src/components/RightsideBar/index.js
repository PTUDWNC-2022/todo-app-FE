import './RightsideBar.css';
import { Card, Col, Form, Row } from 'react-bootstrap';
import React, { useEffect, useRef, useState } from 'react';

const RightSideBar = ({ todoDetail }) => {
	const [expand, setExpand] = useState(false);

	function useOutsideAlerter(ref) {
		useEffect(() => {
			/**
			 * If clicked on outside of element
			 */
			function handleClickOutside(event) {
				if (
					ref.current &&
					!ref.current.contains(event.target) &&
					!event.target.classList.contains('todo-item') &&
					!event.target.classList.contains('form-check-label') &&
					!event.target.classList.contains('form-check-input')
				) {
					setExpand(false);
				} else {
					setExpand(true);
				}
			}
			// Bind the event listener
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				// Unbind the event listener on clean up
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, [ref]);
	}

	// useEffect(() => {
	//     if(Object.keys(todoDetail).length) {
	//         setExpand(true);
	//     }
	// }, [todoDetail]);

	const containerRef = useRef(null);
	useOutsideAlerter(containerRef);

	return (
		<div
			className={`container w-25 ${!expand ? 'collapse-container' : ''}`}
			ref={containerRef}>
			<Card body>
				<Row>
					<Col xl={1} className="pt-1">
						<Form.Check
							type="checkbox"
							checked={todoDetail.isCompleted}
							onChange={() => {}}
						/>
					</Col>
					<Col xl={11}>
						<span
							role="textbox"
							dangerouslySetInnerHTML={{ __html: todoDetail.name }}
							contentEditable
							type="text"
							className="todo-name"
						/>
					</Col>
				</Row>
			</Card>
		</div>
	);
};

export default RightSideBar;
