import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "providers"), where("userId", "==", user.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const profileData = querySnapshot.docs[0].data();
        setUserProfile({
          id: querySnapshot.docs[0].id,
          ...profileData
        });
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("Hiba a profil betöltése során:", err);
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">Bejelentkezés szükséges.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">Betöltés...</p>
        </div>
      </div>
    );
  }

  // Ellenőrizzük, hogy melyik oldalról jött
  const isFromEditProfile = location.state?.from === 'edit-profile';
  const isFromCreateProfile = location.state?.from === 'create-profile';

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-secondary mb-4">
            Dashboard
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Üdvözöl, {user.email}!
          </h2>
          
          {userProfile ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">
                {isFromEditProfile ? "✅ Sikeresen frissítetted a szolgáltatói profilodat." : 
                 isFromCreateProfile ? "✅ Sikeresen létrehoztad a szolgáltatói profilodat." :
                 "✅ Rendelkezel egy szolgáltatói profillal."}
              </p>
              <p className="text-sm mt-1">
                Vállalkozás: {userProfile.name} - {userProfile.city}
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">
                ℹ️ Még nem hoztál létre szolgáltatói profilt.
              </p>
              <p className="text-sm mt-1">
                Hozz létre egy profilt, hogy szolgáltatásaidat hirdethesd!
              </p>
            </div>
          )}
        </div>
        
        <div className="text-center space-y-4">
          {userProfile ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Link 
                  to="/profil" 
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Saját profil megtekintése
                </Link>
                <Link 
                  to="/szolgaltatok" 
                  className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Szolgáltatók megtekintése
                </Link>
                <Link 
                  to="/" 
                  className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Vissza a főoldalra
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Link 
                to="/create-profile" 
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Szolgáltatói profil létrehozása
              </Link>
              <div className="space-y-2">
                <Link 
                  to="/" 
                  className="inline-block bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Vissza a főoldalra
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 