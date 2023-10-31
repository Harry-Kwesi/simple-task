import { useState, useEffect, createContext, useContext } from "react";

// Create a context for tasks and editing state
const TaskContext = createContext();

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [editMode, setEditMode] = useState(null);

  // Load tasks from local storage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Function to update local storage
  const updateLocalStorage = (updatedTasks) => {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Function to add a new task
  const addTask = () => {
    const trimmedText = taskText.trim();
    if (trimmedText === "") return;

    const newTask = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    updateLocalStorage(updatedTasks); // Update local storage with the updated tasks
    setTaskText("");
  };

  // Function to delete a task
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    updateLocalStorage(updatedTasks); // Update local storage with the updated tasks
  };

  // Function to toggle task completion
  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    updateLocalStorage(updatedTasks); // Update local storage with the updated tasks
  };

  // Function to enter edit mode
  const enterEditMode = (id) => {
    setEditMode(id);
  };

  // Function to exit edit mode and save changes
  const exitEditMode = (id, newText) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, text: newText };
      }
      return task;
    });
    setTasks(updatedTasks);
    updateLocalStorage(updatedTasks); // Update local storage with the updated tasks
    setEditMode(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        editMode,
        addTask,
        deleteTask,
        toggleCompletion,
        enterEditMode,
        exitEditMode,
      }}
    >
      <div>
        <h1>Task List</h1>
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={addTask}>Add Task</button>
        <ul>
          {tasks.length === 0 ? (
            <li>No tasks yet</li>
          ) : (
            tasks.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </ul>
      </div>
    </TaskContext.Provider>
  );
}

function TaskItem({ task }) {
  const {
    editMode,
    deleteTask,
    toggleCompletion,
    enterEditMode,
    exitEditMode,
  } = useContext(TaskContext);
  const [editedText, setEditedText] = useState(task.text);

  return (
    <li>
      {editMode === task.id ? (
        <>
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <button onClick={() => exitEditMode(task.id, editedText)}>
            Save
          </button>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleCompletion(task.id)}
          />
          <span>{task.text}</span>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
          <button onClick={() => enterEditMode(task.id)}>Edit</button>
        </>
      )}
    </li>
  );
}

export default TaskList;
