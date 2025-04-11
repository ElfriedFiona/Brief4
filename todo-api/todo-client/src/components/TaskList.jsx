import { useEffect, useState } from "react";
import api from "../services/api";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onTaskUpdated, readonly = false, showUser = false }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/user");
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur connecté", err);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full bg-white text-sm text-left">
        <thead>
          <tr className="bg-blue-100 text-black text-sm uppercase">
            <th className="px-6 py-4">Statut</th>
            <th className="px-6 py-4">Titre</th>
            <th className="px-6 py-4">Description</th>
            {showUser && <th className="px-6 py-4">Utilisateur</th>}
            {!readonly && <th className="px-6 py-4 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskUpdated={onTaskUpdated}
              currentUserId={currentUser?.id}
              readonly={readonly}
              showUser={showUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
