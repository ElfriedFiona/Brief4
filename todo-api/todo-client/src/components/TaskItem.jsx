import api from "../services/api";
import { useState } from "react";

const TaskItem = ({ task, onTaskUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description || "");

  const toggleComplete = async () => {
    await api.patch(`/tasks/${task.id}/toggle`);
    onTaskUpdated();
  };

  const handleDelete = async () => {
    await api.delete(`/tasks/${task.id}`);
    onTaskUpdated();
  };

  const handleUpdate = async () => {
    await api.put(`/tasks/${task.id}`, {
      title: newTitle,
      description: newDescription,
    });
    setEditing(false);
    onTaskUpdated();
  };

  return (
    <li className="bg-white p-4 rounded shadow mb-2 max-w-xl mx-auto">
      {editing ? (
        <div className="flex flex-col gap-2">
          <input
            className="border p-1"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Titre"
          />
          <textarea
            className="border p-1"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description"
          />
        </div>
      ) : (
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
      )}

      <div className="flex items-center justify-end mt-2 gap-2">

        <button
          className="text-green-600"
          onClick={toggleComplete}
          title="Marquer comme terminé"
        >
          ✅
        </button>
        {editing ? (
          <button className="text-blue-600" onClick={handleUpdate}>
            💾
          </button>
        ) : (
          <button className="text-yellow-600" onClick={() => setEditing(true)}>
            ✏️
          </button>
        )}
        <button className="text-red-600" onClick={handleDelete}>
          🗑️
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
