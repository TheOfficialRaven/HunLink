import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Admin felhasználó létrehozása vagy frissítése
 * @param {string} uid - Felhasználó UID-je
 * @param {string} email - Email cím
 * @param {string} displayName - Megjelenítendő név
 * @param {boolean} isAdmin - Admin jogosultság
 */
export const createOrUpdateAdminUser = async (uid, email, displayName = null, isAdmin = true) => {
  try {
    const userRef = doc(db, "users", uid);
    
    // Ellenőrizzük, hogy létezik-e már a felhasználó
    const userDoc = await getDoc(userRef);
    
    const userData = {
      email: email,
      displayName: displayName || email.split('@')[0], // Ha nincs név, email-ből generálunk
      isAdmin: isAdmin,
      createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date(),
      updatedAt: new Date()
    };

    await setDoc(userRef, userData, { merge: true });
    
    console.log(`Admin felhasználó sikeresen ${userDoc.exists() ? 'frissítve' : 'létrehozva'}:`, email);
    return true;
  } catch (error) {
    console.error("Hiba az admin felhasználó létrehozása/frissítése során:", error);
    return false;
  }
};

/**
 * Admin jogosultság ellenőrzése
 * @param {string} uid - Felhasználó UID-je
 * @returns {Promise<boolean>} - Admin jogosultság
 */
export const checkAdminStatus = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.isAdmin === true;
    }
    
    return false;
  } catch (error) {
    console.error("Hiba az admin jogosultság ellenőrzése során:", error);
    return false;
  }
};

/**
 * Felhasználó adatainak lekérése
 * @param {string} uid - Felhasználó UID-je
 * @returns {Promise<object|null>} - Felhasználó adatai
 */
export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error("Hiba a felhasználó adatok lekérése során:", error);
    return null;
  }
};

/**
 * Admin jogosultság hozzáadása/eltávolítása
 * @param {string} uid - Felhasználó UID-je
 * @param {boolean} isAdmin - Admin jogosultság
 */
export const setAdminStatus = async (uid, isAdmin) => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await setDoc(userRef, {
        isAdmin: isAdmin,
        updatedAt: new Date()
      }, { merge: true });
      
      console.log(`Admin jogosultság ${isAdmin ? 'hozzáadva' : 'eltávolítva'} a felhasználóhoz:`, uid);
      return true;
    } else {
      console.error("Felhasználó nem található:", uid);
      return false;
    }
  } catch (error) {
    console.error("Hiba az admin jogosultság beállítása során:", error);
    return false;
  }
};

// Példa admin felhasználó létrehozásához (fejlesztés közben használható)
export const createExampleAdmin = async () => {
  const exampleAdmin = {
    uid: "admin_example_uid",
    email: "admin@example.com",
    displayName: "Admin Felhasználó",
    isAdmin: true
  };
  
  return await createOrUpdateAdminUser(
    exampleAdmin.uid,
    exampleAdmin.email,
    exampleAdmin.displayName,
    exampleAdmin.isAdmin
  );
}; 