import React, { useContext, useEffect, useState } from "react";
import { FloatingLabel, ListGroup, Form } from "react-bootstrap";

import "./Sidebar.css";
import { authHeader } from "../../api/auth";
import { LabelContext } from "../../contexts/LabelContext";

const Sidebar = () => {
  const [newLabel, setNewLabel] = useState("");
  const [labels, setLabels] = useState(['My day', 'Important', 'Planned', 'Assigned to me', 'Flagged email', 'Task']);
  const labelContext = useContext(LabelContext);

  const fetchLabels = async () => {
    const userId = JSON.parse(localStorage.getItem("authInfo")).user._id;
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/labels/${userId}`,
      {
        method: "GET",
        headers: authHeader(),
      }
    );
    const respJson = await resp.json();

    labelContext.setDocumentId(respJson.insertedId || respJson._id);
    labelContext.setLabels(
      respJson.insertedId ? [] : respJson.additionalLabels
    );
    // setLabels([...labels, ...respJson.additionalLabels]);
  };

  useEffect(() => {
    void fetchLabels();
  }, []);

  const handleOnChangeNewLabel = (event) => {
    setNewLabel(event.target.value);
  };

  const handleEnter = async (event) => {
    if (event.key === "Enter") {
      await fetch(`${process.env.REACT_APP_API_URL}/labels/new-label`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({
          documentId: labelContext.documentId,
          newLabel
        })
      });
      await fetchLabels();
      setNewLabel("");
    }
  };

  return (
    <div className={"sidebar"}>
      <ListGroup variant="flush">
        <ListGroup.Item className={"label-item"} action>
          <i className="bi bi-brightness-high"></i>
          <span className={"label-name"}>My day</span>
        </ListGroup.Item>
        <ListGroup.Item className={"label-item"} action>
          <i className="bi bi-star"></i>
          <span className={"label-name"}>Important</span>
        </ListGroup.Item>
        <ListGroup.Item className={"label-item"} action>
          <i className="bi bi-calendar-check"></i>
          <span className={"label-name"}>Planned</span>
        </ListGroup.Item>
        <ListGroup.Item className={"label-item"} action>
          <i className="bi bi-person"></i>
          <span className={"label-name"}>Assigned to me</span>
        </ListGroup.Item>
        <ListGroup.Item className={"label-item"} action>
          <i className="bi bi-flag"></i>
          <span className={"label-name"}>Flagged email</span>
        </ListGroup.Item>
        <ListGroup.Item className={"label-item"} action>
          <i className="bi bi-house"></i>
          <span className={"label-name"}>Task</span>
        </ListGroup.Item>
        {labels.slice(6).map(label => {
          return (
            <ListGroup.Item className={"label-item"} action>
              <span className={"label-name"}>{label}</span>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
      <FloatingLabel
        controlId={"floatingInput"}
        label={"Add new label"}
        className={"mt-2 me-2"}
      >
        <Form.Control
          type="text"
          placeholder={"ABC"}
          value={newLabel}
          onChange={handleOnChangeNewLabel}
          onKeyDown={handleEnter}
        />
      </FloatingLabel>
    </div>
  );
};
export default Sidebar;
