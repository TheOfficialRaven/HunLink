import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user) {
        setHasProfile(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
        // Profil ellenőrzése
        const q = query(collection(db, "providers"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        setHasProfile(!querySnapshot.empty);
        
        // Admin jogosultság ellenőrzése
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.isAdmin === true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Hiba a profil ellenőrzése során:", err);
        setHasProfile(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserProfile();
  }, [user]);

  return (
    <nav className={`navbar${isHomePage ? " navbar-home" : ""}`}>
      <Link to="/" className="navbar-logo">
        MagyarKereső
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/szolgaltatok" className="navbar-link">Szolgáltatók</Link>
            <Link to="/terkep" className="navbar-link">Térkép</Link>
            {!loading && (
              <Link 
                to={hasProfile ? "/profil" : "/create-profile"} 
                className="navbar-link"
              >
                {hasProfile ? "Saját profil" : "Profilom"}
              </Link>
            )}
            {/* Admin link - csak admin felhasználók számára */}
            {!loading && isAdmin && (
              <Link to="/admin" className="navbar-link navbar-admin">
                🔐 Admin
              </Link>
            )}
            <button 
              onClick={logout} 
              className="navbar-link navbar-logout"
            >
              Kijelentkezés
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Bejelentkezés</Link>
            <Link to="/register" className="navbar-button">
              Regisztráció
            </Link>
          </>
        )}
      </div>
    </nav>
  );
} 