import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import CollaborativeTasks from "./CollaborativeTasks";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaUsers,
} from "react-icons/fa";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("mine"); // "mine" ou "all"
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
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Mon Tableau de bord</h1>

        <div className="flex items-center gap-4">
          {/* Onglet Mes Tâches */}
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

          {/* Onglet Tâches Collaboratives */}
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

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Filtres & Recherche */}
      {viewMode === "mine" && (
        <div className="flex justify-end items-center mb-4 gap-2">
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            className="p-2 border rounded w-72"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Toutes</option>
            <option value="completed">Terminées</option>
            <option value="incomplete">Non terminées</option>
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {showForm ? "Annuler" : "Ajouter"}
          </button>
        </div>
      )}

      {/* Affichage conditionnel des vues */}
      <AnimatePresence mode="wait">
        {viewMode === "mine" ? (
          <motion.div
            key="mine"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-center max-w-6xl mx-auto gap-6">
              <div className="flex-1">
                <TaskList tasks={filteredTasks} onTaskUpdated={fetchTasks} />
              </div>

              <div className="w-[300px]">
                <AnimatePresence>
                  {showForm && (
                    <motion.div
                      key="taskForm"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TaskForm
                        onTaskAdded={() => {
                          fetchTasks();
                          setShowForm(false);
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
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
