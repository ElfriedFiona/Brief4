import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { motion, AnimatePresence } from "framer-motion";


const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Mon Tableau de bord</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Déconnexion
        </button>
      </div>

      {/* Barre de recherche + bouton Ajouter alignés à droite */}
    <div className="flex items-center">
      <input
        type="text"
        placeholder="Rechercher une tâche..."
        className="p-2 border rounded w-72"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        onClick={() => setShowForm(!showForm)}
        className="ml-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        {showForm ? "Annuler" : "Ajouter"}
      </button>
    </div>


      {/* Formulaire d'ajout affiché uniquement si demandé */}
      <AnimatePresence>
  {showForm && (
    <motion.div
      key="taskForm"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end max-w-5xl mx-auto mb-6"
    >
      <div className="w-full max-w-sm">
        <TaskForm onTaskAdded={() => {
          fetchTasks();
          setShowForm(false); // Cacher le form après ajout
        }} />
      </div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Liste des tâches */}
      <TaskList tasks={filteredTasks} onTaskUpdated={fetchTasks} />
    </div>
  );
};

export default Dashboard;
