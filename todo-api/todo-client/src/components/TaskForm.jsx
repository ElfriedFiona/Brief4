import { useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    try {
      await api.post("/tasks", { title, description });
      toast.success("Tâche ajoutée avec succès 🎉");
      setTitle("");
      setDescription("");
      onTaskAdded(); // Rafraîchir la liste
    } catch (err) {
      toast.error("Erreur lors de l'ajout de la tâche");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Nouvelle tâche</h2>
      <input
        type="text"
        placeholder="Titre"
        className="w-full p-2 border rounded mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 border rounded mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        Ajouter
      </button>
    </form>
  );
};

export default TaskForm;
