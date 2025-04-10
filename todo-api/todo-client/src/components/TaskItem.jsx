import { useState } from "react";
import api from "../services/api";
import {
  FaCheckSquare,
  FaRegSquare,
  FaEdit,
  FaTrash,
  FaSave,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const TaskItem = ({ task, onTaskUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description || "");

  const toggleComplete = async () => {
    try {
      await api.patch(`/tasks/${task.id}/toggle`);
      toast.success(task.completed ? "Tâche marquée comme incomplète" : "Tâche marquée comme terminée");
      onTaskUpdated();
    } catch {
      toast.error("Échec lors du changement de statut");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task.id}`);
      toast.success("Tâche supprimée");
      onTaskUpdated();
    } catch {
      toast.error("Échec de la suppression");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/tasks/${task.id}`, {
        title: newTitle,
        description: newDescription,
      });
      toast.success("Tâche mise à jour");
      setEditing(false);
      onTaskUpdated();
    } catch {
      toast.error("Échec de la mise à jour");
    }
  };

  return (
    <motion.li
      className="bg-white p-4 rounded shadow mb-2 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      {editing ? (
        <div className="flex flex-col gap-2">
          <input
            className="border p-1 rounded"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Titre"
          />
          <textarea
            className="border p-1 rounded"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description"
          />
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <button onClick={toggleComplete} title="Changer le statut">
            {task.completed ? (
              <FaCheckSquare className="text-green-600 text-xl" />
            ) : (
              <FaRegSquare className="text-gray-400 text-xl" />
            )}
          </button>

          <div>
            <h3
              className={`text-lg font-semibold ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end mt-2 gap-3">
        {editing ? (
          <button className="text-blue-600" onClick={handleUpdate} title="Sauvegarder">
            <FaSave />
          </button>
        ) : (
          <button className="text-yellow-600" onClick={() => setEditing(true)} title="Modifier">
            <FaEdit />
          </button>
        )}
        <button className="text-red-600" onClick={handleDelete} title="Supprimer">
          <FaTrash />
        </button>
      </div>
    </motion.li>
  );
};

export default TaskItem;
