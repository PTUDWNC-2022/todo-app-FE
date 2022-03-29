import './RightsideBar.css';
import {Card, Col, Form, Row} from "react-bootstrap";
import React from "react";

const RightSideBar = ({ todoDetail }) => {
    return (
        <div className="container w-25">
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
                        <span role="textbox" dangerouslySetInnerHTML={{__html: todoDetail.name}} contentEditable type="text" className="todo-name" />
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

export default RightSideBar;