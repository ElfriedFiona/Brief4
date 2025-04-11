// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import CollaborativeTasks from "./pages/CollaborativeTasks";

function App() {
  return (


// Dans ton composant App :
<>
<Toaster
  position="top-right"
  toastOptions={{
    duration: 5000,
  }}
/>


  <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes protégées */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/collaboratif" element={<CollaborativeTasks />} />
        </Route>

        {/* Optionnel : page 404 */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
</>


  );
}

export default App;
