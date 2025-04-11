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

const TaskItem = ({ task, onTaskUpdated, currentUserId, readonly = false, showUser = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description || "");

  const isOwner = task.user_id === currentUserId;
  const isReadOnly = readonly || !isOwner;

  const toggleComplete = async () => {
    try {
      await api.patch(`/tasks/${task.id}/toggle`, { completed: !task.completed });
      if (!isReadOnly) toast.success("Statut de la tâche mise à jour !");
      onTaskUpdated?.();
    } catch {
      if (!isReadOnly) toast.error("Erreur lors de la mise à jour.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${task.id}`);
      if (!isReadOnly) toast.success("Tâche supprimée.");
      onTaskUpdated?.();
    } catch {
      if (!isReadOnly) toast.error("Erreur lors de la suppression.");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/tasks/${task.id}`, {
        title: newTitle,
        description: newDescription,
      });
      if (!isReadOnly) toast.success("Tâche mise à jour !");
      setIsEditing(false);
      onTaskUpdated?.();
    } catch {
      if (!isReadOnly) toast.error("Erreur lors de la mise à jour.");
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      <td className="px-6 py-4 text-center">
        {isOwner ? (
          <button onClick={toggleComplete} title="Changer le statut">
            {task.completed ? (
              <FaCheckSquare className="text-green-600 text-lg" />
            ) : (
              <FaRegSquare className="text-gray-600 text-lg" />
            )}
          </button>
        ) : (
          task.completed ? (
            <FaCheckSquare className="text-green-600 text-lg" />
          ) : (
            <FaRegSquare className="text-gray-400 text-lg" />
          )
        )}
      </td>

      <td className="px-6 py-4">
        {isEditing ? (
          <input
            className="border p-1 rounded w-full"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        ) : (
          <span className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
            {task.title}
          </span>
        )}
      </td>

      <td className="px-6 py-4 text-gray-600">
        {isEditing ? (
          <textarea
            className="border p-1 rounded w-full"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        ) : (
          <span>{task.description}</span>
        )}
      </td>

      {showUser && (
        <td className="px-6 py-4">
          <span className="text-gray-500 italic text-sm">
            {task.user?.name}
          </span>
        </td>
      )}

<td className="px-6 py-4">{new Date(task.created_at).toLocaleString("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
})}</td>
<td className="px-6 py-4">{new Date(task.updated_at).toLocaleString("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
})}</td>


      {!isReadOnly && (
        <td className="px-6 py-4 text-right">
          {isEditing ? (
            <button
              onClick={handleUpdate}
              title="Sauvegarder"
              className="text-blue-600 mr-3 hover:scale-110 transition"
            >
              <FaSave />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              title="Modifier"
              className="text-yellow-600 mr-3 hover:scale-110 transition"
            >
              <FaEdit />
            </button>
          )}
          <button
            onClick={handleDelete}
            title="Supprimer"
            className="text-red-600 hover:scale-110 transition"
          >
            <FaTrash />
          </button>
        </td>
      )}
    </tr>
  );
};

export default TaskItem;
