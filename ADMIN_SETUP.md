# 🔐 Admin Dashboard Beállítás

## 📋 Áttekintés

Az AdminDashboard egy védett admin felület, amely csak admin jogosultsággal rendelkező felhasználók számára érhető el.

## 🚀 Gyors Beállítás

### 1. Admin Felhasználó Létrehozása

#### Firebase Console-ban:
1. Nyisd meg a Firebase Console-t
2. Válaszd ki a projektet
3. Menj a **Firestore Database** > **Data** szekcióba
4. Hozz létre egy új dokumentumot a `users` kollekcióban:

```json
{
  "email": "admin@example.com",
  "displayName": "Admin Felhasználó",
  "isAdmin": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Vagy kódban (fejlesztés közben):

```javascript
import { createOrUpdateAdminUser } from './src/utils/adminHelper';

// Admin felhasználó létrehozása
await createOrUpdateAdminUser(
  "felhasznalo_uid_je", // Firebase Auth UID
  "admin@example.com",
  "Admin Felhasználó",
  true
);
```

### 2. Admin Útvonal Elérése

- **URL**: `http://localhost:5174/admin`
- **Jogosultság**: Csak admin felhasználók
- **Átirányítás**: Nem admin felhasználók a főoldalra kerülnek

## 🔧 Technikai Részletek

### Firebase Firestore Szerkezet

```
users (collection)
┗ [user_uid] (document)
  ┣ email: "admin@example.com"
  ┣ displayName: "Admin Felhasználó"
  ┣ isAdmin: true
  ┣ createdAt: "2024-01-01T00:00:00.000Z"
  ┗ updatedAt: "2024-01-01T00:00:00.000Z"
```

### Biztonsági Szabályok

Firebase Firestore szabályok az admin jogosultságokhoz:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users kollekció - csak saját adatok olvasása
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Admin jogosultság ellenőrzése
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Admin funkciók - csak admin felhasználók
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

## 📁 Fájlstruktúra

```
src/
├── pages/
│   └── AdminDashboard.jsx          # Admin dashboard komponens
│   └── AdminDashboard.css          # Admin dashboard stílusok
├── utils/
│   └── ProtectedAdminRoute.jsx     # Védett admin útvonal komponens
│   └── adminHelper.js              # Admin segédfüggvények
└── App.jsx                         # Admin útvonal hozzáadva
```

## 🎯 Funkciók

### ✅ Implementált
- [x] Admin jogosultság ellenőrzés
- [x] Védett útvonal (`/admin`)
- [x] Modern, reszponzív admin felület
- [x] Loading állapotok
- [x] Automatikus átirányítás nem admin felhasználók számára

### 🔄 Később Implementálandó
- [ ] Felhasználók kezelése
- [ ] Szolgáltatók moderálása
- [ ] Vélemények kezelése
- [ ] Statisztikák és jelentések
- [ ] Rendszer beállítások
- [ ] Admin jogosultságok kezelése

## 🛠️ Fejlesztői Segédfüggvények

### Admin Felhasználó Létrehozása

```javascript
import { createOrUpdateAdminUser } from './src/utils/adminHelper';

// Példa admin létrehozása
const createAdmin = async () => {
  const success = await createOrUpdateAdminUser(
    "felhasznalo_uid",
    "admin@example.com",
    "Admin Név",
    true
  );
  
  if (success) {
    console.log("Admin felhasználó létrehozva!");
  }
};
```

### Admin Jogosultság Ellenőrzése

```javascript
import { checkAdminStatus } from './src/utils/adminHelper';

const checkAdmin = async (uid) => {
  const isAdmin = await checkAdminStatus(uid);
  console.log("Admin jogosultság:", isAdmin);
};
```

## 🔒 Biztonsági Megfontolások

1. **Jogosultság Ellenőrzés**: Minden admin művelet előtt ellenőrizzük az admin jogosultságot
2. **Védett Útvonalak**: A `/admin` útvonal csak admin felhasználók számára érhető el
3. **Firebase Szabályok**: Firestore szabályok biztosítják a biztonságot
4. **Automatikus Átirányítás**: Nem admin felhasználók automatikusan átirányítódnak

## 🚨 Hibaelhárítás

### "Nincs admin jogosultság" hiba
1. Ellenőrizd a Firestore-ban az `isAdmin: true` mezőt
2. Ellenőrizd a felhasználó UID-jét
3. Frissítsd az oldalt

### "Felhasználó nem található" hiba
1. Hozz létre egy dokumentumot a `users` kollekcióban
2. Használd a `createOrUpdateAdminUser` segédfüggvényt

### Firebase kapcsolat hiba
1. Ellenőrizd a Firebase konfigurációt
2. Ellenőrizd a hálózati kapcsolatot
3. Nézd meg a böngésző konzolját a hibákért

## 📞 Támogatás

Ha problémákat tapasztalsz az admin funkciókkal:

1. Ellenőrizd a Firebase Console-t
2. Nézd meg a böngésző konzolját
3. Ellenőrizd a Firestore szabályokat
4. Használd a `adminHelper.js` segédfüggvényeket

---

**🎯 Cél**: Biztonságos admin felület a weboldal kezeléséhez és moderálásához. 