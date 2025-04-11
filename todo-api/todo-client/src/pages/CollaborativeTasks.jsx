import { useEffect, useState } from "react";
import api from "../services/api";
import TaskList from "../components/TaskList";

const CollaborativeTasks = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");

  // Récupérer les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs", err);
      }
    };
    fetchUsers();
  }, []);

  // Récupérer toutes les tâches
  const fetchAllTasks = async () => {
    try {
      const res = await api.get("/tasks/all");
      setTasks(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des tâches", err);
    }
  };

  // Effectuer un rafraîchissement automatique des tâches toutes les 5 secondes
  useEffect(() => {
    fetchAllTasks(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchAllTasks(); // Rafraîchissement des tâches toutes les 5 secondes
    }, 1000);

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      const user = users.find((u) => u.id === selectedUserId);
      setSelectedUserName(user?.name || "");
    } else {
      setSelectedUserName("");
    }
  }, [selectedUserId, users]);

  const filteredTasks = selectedUserId
    ? tasks.filter((task) => task.user_id === selectedUserId)
    : tasks;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">Tâches collaboratives</h2>

      <div className="flex gap-6">
        {/* Liste des utilisateurs */}
        <div className="w-1/4 bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Utilisateurs</h3>
          <ul>
            <li
              onClick={() => setSelectedUserId(null)}
              className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${
                selectedUserId === null ? "bg-blue-200" : ""
              }`}
            >
              Tous les utilisateurs
            </li>
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${
                  selectedUserId === user.id ? "bg-blue-200" : ""
                }`}
              >
                {user.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Liste des tâches */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2 text-blue-700">
            {selectedUserId ? `Tâches de ${selectedUserName}` : "Toutes les tâches"}
          </h3>
          <TaskList
            tasks={filteredTasks}
            readonly={true}
            showUser={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CollaborativeTasks;
