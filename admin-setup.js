// 🔐 Admin Jogosultság Hozzáadása Script
// Futtasd ezt a scriptet a böngésző konzolban (F12 > Console)

// 1. Importáld a szükséges függvényeket
import { createOrUpdateAdminUser, setAdminStatus } from './src/utils/adminHelper.js';

// 2. Funkció az admin jogosultság hozzáadásához
async function makeMeAdmin() {
  try {
    // Firebase Auth-ból lekérjük a jelenlegi felhasználót
    const { getAuth, onAuthStateChanged } = await import('firebase/auth');
    const auth = getAuth();
    
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log('🔍 Felhasználó UID:', user.uid);
          console.log('📧 Email:', user.email);
          
          // Admin jogosultság hozzáadása
          const success = await createOrUpdateAdminUser(
            user.uid,
            user.email,
            user.displayName || user.email.split('@')[0],
            true
          );
          
          if (success) {
            console.log('✅ Sikeresen admin jogosultságot kaptál!');
            console.log('🔄 Frissítsd az oldalt, hogy lásd az Admin linket a navigációban.');
            resolve(true);
          } else {
            console.error('❌ Hiba az admin jogosultság hozzáadása során');
            reject(new Error('Admin jogosultság hozzáadása sikertelen'));
          }
        } else {
          console.error('❌ Nincs bejelentkezett felhasználó');
          reject(new Error('Nincs bejelentkezett felhasználó'));
        }
      });
    });
  } catch (error) {
    console.error('❌ Hiba:', error);
    throw error;
  }
}

// 3. Alternatív módszer - ha már létezik a felhasználó
async function setMyAdminStatus() {
  try {
    const { getAuth, onAuthStateChanged } = await import('firebase/auth');
    const auth = getAuth();
    
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log('🔍 Felhasználó UID:', user.uid);
          
          // Csak az admin jogosultságot állítjuk be
          const success = await setAdminStatus(user.uid, true);
          
          if (success) {
            console.log('✅ Admin jogosultság sikeresen beállítva!');
            console.log('🔄 Frissítsd az oldalt.');
            resolve(true);
          } else {
            console.error('❌ Hiba az admin jogosultság beállítása során');
            reject(new Error('Admin jogosultság beállítása sikertelen'));
          }
        } else {
          console.error('❌ Nincs bejelentkezett felhasználó');
          reject(new Error('Nincs bejelentkezett felhasználó'));
        }
      });
    });
  } catch (error) {
    console.error('❌ Hiba:', error);
    throw error;
  }
}

// 4. Használat:
// makeMeAdmin() - Teljes admin felhasználó létrehozása
// setMyAdminStatus() - Csak admin jogosultság hozzáadása

console.log('🚀 Admin setup script betöltve!');
console.log('📝 Használat:');
console.log('   makeMeAdmin() - Teljes admin felhasználó létrehozása');
console.log('   setMyAdminStatus() - Csak admin jogosultság hozzáadása'); 