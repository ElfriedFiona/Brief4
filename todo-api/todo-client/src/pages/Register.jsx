import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation basique du formulaire
  if (!email || !password || !name) {
    setError("Tous les champs doivent être remplis.");
    return;
  }

  // Validation de l'email (simple exemple de regex)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setError("Email invalide.");
    return;
  }

  // Validation du mot de passe (au moins 6 caractères, pour l'exemple)
  if (password.length < 6) {
    setError("Le mot de passe doit contenir au moins 6 caractères.");
    return;
  }

    try {
      // Envoie des données d'inscription sans gérer le token à ce stade
      await api.post("/register", { name, email, password });
      // Affichage d'un toast de succès
      toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      navigate("/login"); // Redirige vers la page de connexion après inscription
    } catch (err) {
      setError("Erreur lors de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Inscription</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          placeholder="Nom"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          S'inscrire
        </button>
        <p className="text-center text-sm">
          Déjà un compte ?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Se connecter
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
