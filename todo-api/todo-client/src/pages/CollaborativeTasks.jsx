import { useEffect, useState } from "react";
import api from "../services/api";
import TaskList from "../components/TaskList";

const CollaborativeTasks = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");

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

  const fetchAllTasks = async () => {
    try {
      const res = await api.get("/tasks/all");
      setTasks(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des tâches", err);
    }
  };

  useEffect(() => {
    fetchAllTasks();
    const intervalId = setInterval(fetchAllTasks, 1000);
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
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Tâches collaboratives
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Utilisateurs */}
        <div className="w-full md:w-1/4 bg-white rounded shadow p-4">
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

        {/* Tâches */}
        <div className="w-full md:flex-1">
          <h3 className="font-semibold mb-2 text-blue-700">
            {selectedUserId ? `Tâches de ${selectedUserName}` : "Toutes les tâches"}
          </h3>
          <div className="overflow-x-auto">
            <TaskList
              tasks={filteredTasks}
              readonly={true}
              showUser={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeTasks;
