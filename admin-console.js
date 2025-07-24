// 🔐 Admin Jogosultság Hozzáadása - Konzol Script
// Másold be ezt a kódot a böngésző konzolba (F12 > Console)

// Firebase importok
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./src/firebase/firebaseConfig.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Admin jogosultság hozzáadása
async function makeMeAdmin() {
  const auth = getAuth();
  
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error('❌ Nincs bejelentkezett felhasználó!');
        reject('Nincs bejelentkezett felhasználó');
        return;
      }
      
      try {
        console.log('🔍 Felhasználó UID:', user.uid);
        console.log('📧 Email:', user.email);
        
        const userRef = doc(db, "users", user.uid);
        
        // Ellenőrizzük, hogy létezik-e már a felhasználó
        const userDoc = await getDoc(userRef);
        
        const userData = {
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          isAdmin: true,
          createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date(),
          updatedAt: new Date()
        };

        await setDoc(userRef, userData, { merge: true });
        
        console.log('✅ Sikeresen admin jogosultságot kaptál!');
        console.log('🔄 Frissítsd az oldalt, hogy lásd az Admin linket a navigációban.');
        resolve(true);
        
      } catch (error) {
        console.error('❌ Hiba:', error);
        reject(error);
      }
    });
  });
}

// Csak admin jogosultság beállítása (ha már létezik a felhasználó)
async function setAdminStatus() {
  const auth = getAuth();
  
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.error('❌ Nincs bejelentkezett felhasználó!');
        reject('Nincs bejelentkezett felhasználó');
        return;
      }
      
      try {
        console.log('🔍 Felhasználó UID:', user.uid);
        
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          await setDoc(userRef, {
            isAdmin: true,
            updatedAt: new Date()
          }, { merge: true });
          
          console.log('✅ Admin jogosultság sikeresen beállítva!');
          console.log('🔄 Frissítsd az oldalt.');
          resolve(true);
        } else {
          console.error('❌ Felhasználó nem található a users kollekcióban');
          reject('Felhasználó nem található');
        }
        
      } catch (error) {
        console.error('❌ Hiba:', error);
        reject(error);
      }
    });
  });
}

// Használat:
console.log('🚀 Admin setup script betöltve!');
console.log('📝 Használat:');
console.log('   makeMeAdmin() - Teljes admin felhasználó létrehozása');
console.log('   setAdminStatus() - Csak admin jogosultság hozzáadása'); 