import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { TodoProvider } from "./contexts/TodoContext";
import { LabelProvider } from "./contexts/LabelContext";
import { ListProvider } from "./contexts/ListContext";

ReactDOM.render(
  <React.StrictMode>
    <ListProvider>
      <TodoProvider>
        <LabelProvider>
          <App />
        </LabelProvider>
      </TodoProvider>
    </ListProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
