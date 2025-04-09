import { useState } from "react";
import api from "../services/api";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await api.post("/tasks", { title,description });
    setTitle("");
    setDescription("");
    onTaskAdded(); // Rafraîchir la liste des tâches
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 max-w-xl mx-auto">
      <input
        type="text"
        placeholder="Titre de la tâche"
        className="p-2 border rounded w-72"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description de la tache"
        className="p-2 border rounded w-72"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex-1">
        Ajouter
      </button>
    </form>
  );
};

export default TaskForm;
