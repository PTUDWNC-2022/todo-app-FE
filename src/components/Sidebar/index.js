import React, { useContext, useEffect, useState } from "react";
import { FloatingLabel, ListGroup, Form } from "react-bootstrap";

import "./Sidebar.css";
import { authHeader } from "../../api/auth";
import { LabelContext } from "../../contexts/LabelContext";

const Sidebar = () => {
  const defaultLabels = [
    "My day",
    "Important",
    "Planned",
    "Assigned to me",
    "Flagged email",
    "Task",
  ];
  const [newLabel, setNewLabel] = useState("");
  const [labels, setLabels] = useState([]);
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
      respJson.insertedId ? [] : [...defaultLabels, ...respJson.additionalLabels]
    );
    setLabels([...defaultLabels, ...respJson.additionalLabels]);
  };

  useEffect(() => {
    void fetchLabels();
  }, []);

  const handleOnChangeNewLabel = (event) => {
    setNewLabel(event.target.value);
  };

  const handleRemoveLabel = async (label) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/labels/remove-label`, {
        method: "PUT",
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

  const handleEnter = async (event) => {
    if (event.key === "Enter") {
      await fetch(`${process.env.REACT_APP_API_URL}/labels/new-label`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({
          documentId: labelContext.documentId,
          newLabel: newLabel.trim(),
        }),
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
        {labels
          .slice(6)
          .sort()
          .map((label) => {
            return (
              <ListGroup.Item className={"additional-label"} action>
                <div>
                  <i className="bi bi-tags"></i>
                  <span className={"label-name"}>{label}</span>
                </div>
                <span className={"remove-label"}>
                  <i
                    className="bi bi-x-circle"
                    onClick={() => handleRemoveLabel(label)}
                  ></i>
                </span>
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
