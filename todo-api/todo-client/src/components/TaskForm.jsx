import { useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    setLoading(true);
    try {
      await api.post("/tasks", { title, description });
      toast.success("Tâche ajoutée avec succès 🎉");
      setTitle("");
      setDescription("");
      onTaskAdded?.();
    } catch (err) {
      toast.error("Erreur lors de l'ajout de la tâche");
    } finally {
      setLoading(false);
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
        disabled={loading}
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 border rounded mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        disabled={loading || !title.trim()}
      >
        {loading ? "Ajout en cours..." : "Ajouter"}
      </button>
    </form>
  );
};

export default TaskForm;
