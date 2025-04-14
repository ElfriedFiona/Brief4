import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import CollaborativeTasks from "./CollaborativeTasks";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaUsers } from "react-icons/fa";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("mine");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    const intervalId = setInterval(fetchTasks, 1000);
    return () => clearInterval(intervalId);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) => {
      if (filterStatus === "completed") return task.completed;
      if (filterStatus === "incomplete") return !task.completed;
      return true;
    })
    .filter((task) => {
      if (viewMode === "mine") return task.user_id?.toString() === userId;
      return true;
    });

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Mon Tableau de bord</h1>
          <h2 className="text-lg font-semibold text-black">
            Bienvenue {currentUser?.name || "Utilisateur"}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`relative px-4 py-2 rounded flex items-center gap-2 transition-all duration-300 ${
              viewMode === "mine"
                ? "bg-blue-600 text-white"
                : "bg-white border text-blue-600"
            }`}
            onClick={() => setViewMode("mine")}
          >
            <FaUser />
            Mes tâches
            {viewMode === "mine" && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-1 bg-white rounded"
              />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`relative px-4 py-2 rounded flex items-center gap-2 transition-all duration-300 ${
              viewMode === "all"
                ? "bg-blue-600 text-white"
                : "bg-white border text-blue-600"
            }`}
            onClick={() => setViewMode("all")}
          >
            <FaUsers />
            Tâches collaboratives
            {viewMode === "all" && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-1 bg-white rounded"
              />
            )}
          </motion.button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Filtres */}
      {viewMode === "mine" && (
        <div className="flex flex-col md:flex-row justify-end items-center mb-4 gap-2">
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            className="p-2 border rounded w-full md:w-72"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded w-full md:w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Toutes</option>
            <option value="completed">Terminées</option>
            <option value="incomplete">Non terminées</option>
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            {showForm ? "Annuler" : "Ajouter"}
          </button>
        </div>
      )}

      {/* Affichage des tâches */}
      <AnimatePresence mode="wait">
        {viewMode === "mine" ? (
          <motion.div
            key="mine"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col lg:flex-row-reverse justify-center max-w-6xl mx-auto gap-6">
              {/* Formulaire en premier sur mobile, à droite sur desktop */}
              {showForm && (
                <motion.div
                  key="taskForm"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3 }}
                  className="w-full lg:w-[300px] border-t lg:border-t-0 lg:border-l border-gray-300 pt-4 lg:pt-0"
                >
                  <TaskForm
                    onTaskAdded={() => {
                      fetchTasks();
                      setShowForm(false);
                    }}
                  />
                </motion.div>
              )}

              <div className="w-full lg:flex-1">
                <TaskList tasks={filteredTasks} onTaskUpdated={fetchTasks} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collab"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <CollaborativeTasks />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
