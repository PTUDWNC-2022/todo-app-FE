import {authHeader} from "./auth";

const loadAllTodos = () => {
    const userId = JSON.parse(localStorage.getItem("authInfo")).user._id;
    return fetch(
        `${process.env.REACT_APP_API_URL}/todos/${userId}`,
        {
            headers: authHeader(),
        }
    );
};

const handleUpdateTodoItem = (todo) => {
    const { _id, userId, ...rest } = todo;

    const requestOptions = {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ ...rest }),
    };

    return fetch(`${process.env.REACT_APP_API_URL}/todos/${_id}`, requestOptions);
};

export default {
    loadAllTodos,
    handleUpdateTodoItem
};