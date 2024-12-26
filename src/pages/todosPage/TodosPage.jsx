import { useEffect, useState } from "react";
import styles from "../todosPage/todosPage.css";

const URL = "http://localhost:8000/todos";

function TodosPage() {
    const [input, setInput] = useState("");
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editInput, setEditInput] = useState("");


    async function createTodo(event) {
        event.preventDefault();
        if (!input.trim()) return;

        const data = { status: false, title: input.trim() };
        const response = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.status === 201) {
            setInput("");
            getTodos();
        }
    }


    async function getTodos() {
        const response = await fetch(URL);
        const data = await response.json();
        setTodos(data);
    }


    async function deleteTodo(id) {
        const response = await fetch(`${URL}/${id}`, { method: "DELETE" });
        if (response.status === 200) {
            getTodos();
        }
    }


    async function updateTodoStatus(status, id) {
        const data = { status };
        const response = await fetch(`${URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.status === 200) {
            getTodos();
        }
    }


    async function saveUpdatedTitle(id) {
        if (!editInput.trim()) return;

        const data = { title: editInput.trim() };
        const response = await fetch(`${URL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.status === 200) {
            setEditId(null);
            setEditInput("");
            getTodos();
        }
    }

    useEffect(() => {
        getTodos();
    }, []);

    return (
        <>
            <h2>Todos</h2>
            <form onSubmit={createTodo}>
                <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Add new todo"
                />
                <button type="submit">Add</button>
            </form>

            <ul>
                {todos.map((todo) => (
                    <h3 key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.status}
                            onChange={(e) => updateTodoStatus(e.target.checked, todo.id)}
                        />
                        {editId === todo.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editInput}
                                    onChange={(e) => setEditInput(e.target.value)}
                                />
                                <button onClick={() => saveUpdatedTitle(todo.id)}>Save</button>
                                <button onClick={() => setEditId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className={todo.status ? "active" : ""}>{todo.title}</span>
                                <button onClick={() => {
                                    setEditId(todo.id);
                                    setEditInput(todo.title);
                                }}>Update</button>
                            </>
                        )}
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </h3>
                ))}
            </ul>
        </>
    );
}

export default TodosPage;
