import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedAdminRoute({ children }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Ha nincs bejelentkezett felhasználó
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Firestore-ból lekérjük a felhasználó adatait
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Ellenőrizzük az admin jogosultságot
          if (userData.isAdmin === true) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          // Ha nincs felhasználó dokumentum
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Hiba az admin jogosultság ellenőrzése során:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Loading állapot
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '1.1rem',
        color: 'var(--text)'
      }}>
        Admin jogosultság ellenőrzése...
      </div>
    );
  }

  // Ha nem admin vagy nincs bejelentkezve, átirányítás
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Ha admin, megjelenítjük a gyermek komponenst
  return children;
} 