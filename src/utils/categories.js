// Részletes kategóriák és alkategóriák
export const categories = [
  {
    id: "mesteremberek",
    name: "Mesteremberek",
    icon: "🔨",
    subcategories: [
      { id: "villanyszerelo", name: "Villanyszerelő", icon: "⚡" },
      { id: "vizszerelo", name: "Vízszerelő", icon: "🚰" },
      { id: "futeszerelo", name: "Fűtésszerelő", icon: "🔥" },
      { id: "klimaszerelo", name: "Klímaszerelő", icon: "❄️" },
      { id: "asztalos", name: "Asztalos", icon: "🪚" },
      { id: "kobanyasz", name: "Kőműves", icon: "🧱" },
      { id: "festő", name: "Festő", icon: "🎨" },
      { id: "burkoló", name: "Burkoló", icon: "🧩" },
      { id: "kertész", name: "Kertész", icon: "🌱" },
      { id: "egyebmester", name: "Egyéb mesterember", icon: "🔧" }
    ]
  },
  {
    id: "szepsegapolas",
    name: "Szépségápolás",
    icon: "💄",
    subcategories: [
      { id: "fodrasz", name: "Fodrász", icon: "✂️" },
      { id: "kozmetikus", name: "Kozmetikus", icon: "💅" },
      { id: "manikur", name: "Manikűr/Pedikűr", icon: "💅" },
      { id: "tetovalas", name: "Tetoválás", icon: "🎨" },
      { id: "masszazs", name: "Masszázs", icon: "💆" },
      { id: "kozmetika", name: "Kozmetika", icon: "🧴" },
      { id: "egyebszepseg", name: "Egyéb szépségápolás", icon: "✨" }
    ]
  },
  {
    id: "autoszerviz",
    name: "Autószerviz",
    icon: "🚗",
    subcategories: [
      { id: "autoszerelo", name: "Autószerelő", icon: "🔧" },
      { id: "autoelektronika", name: "Autóelektronika", icon: "⚡" },
      { id: "autolakatos", name: "Autólakatos", icon: "🔨" },
      { id: "autofestő", name: "Autófestő", icon: "🎨" },
      { id: "gumiszerelo", name: "Gumiszerelő", icon: "🛞" },
      { id: "autowash", name: "Autómosás", icon: "🚿" },
      { id: "egyebauto", name: "Egyéb autószerviz", icon: "🚙" }
    ]
  },
  {
    id: "forditas",
    name: "Fordítás / Ügyintézés",
    icon: "📋",
    subcategories: [
      { id: "fordito", name: "Fordító", icon: "📝" },
      { id: "tolmacs", name: "Tolmács", icon: "🗣️" },
      { id: "ugyintezo", name: "Ügyintéző", icon: "📄" },
      { id: "jogasz", name: "Jogász", icon: "⚖️" },
      { id: "adotanacsado", name: "Adótanácsadó", icon: "💰" },
      { id: "egyebforditas", name: "Egyéb fordítás/ügyintézés", icon: "📋" }
    ]
  },
  {
    id: "koltoztetes",
    name: "Költöztetés",
    icon: "📦",
    subcategories: [
      { id: "koltozteto", name: "Költöztető cég", icon: "🚚" },
      { id: "csomagolás", name: "Csomagolás", icon: "📦" },
      { id: "raktarozas", name: "Raktározás", icon: "🏭" },
      { id: "egyebkoltoztetes", name: "Egyéb költöztetés", icon: "📦" }
    ]
  },
  {
    id: "informatika",
    name: "Informatika / Web",
    icon: "💻",
    subcategories: [
      { id: "webdesign", name: "Webdesign", icon: "🎨" },
      { id: "programozo", name: "Programozó", icon: "💻" },
      { id: "it", name: "IT támogatás", icon: "🔧" },
      { id: "grafikus", name: "Grafikus", icon: "🎨" },
      { id: "seo", name: "SEO/Szocial media", icon: "📱" },
      { id: "egyebit", name: "Egyéb informatika", icon: "💻" }
    ]
  },
  {
    id: "oktatas",
    name: "Oktatás",
    icon: "📚",
    subcategories: [
      { id: "nyelvtanar", name: "Nyelvtanár", icon: "🗣️" },
      { id: "matektanar", name: "Matematika tanár", icon: "📐" },
      { id: "magyartanar", name: "Magyar tanár", icon: "📖" },
      { id: "zenetanar", name: "Zene tanár", icon: "🎵" },
      { id: "sporttanar", name: "Sport tanár", icon: "⚽" },
      { id: "egyeboktatas", name: "Egyéb oktatás", icon: "📚" }
    ]
  },
  {
    id: "egészség",
    name: "Egészség",
    icon: "🏥",
    subcategories: [
      { id: "masszazs", name: "Masszázs", icon: "💆" },
      { id: "gyogytorna", name: "Gyógytorna", icon: "🏃" },
      { id: "pszichologus", name: "Pszichológus", icon: "🧠" },
      { id: "dietetikus", name: "Dietetikus", icon: "🥗" },
      { id: "egyebegeszseg", name: "Egyéb egészség", icon: "🏥" }
    ]
  },
  {
    id: "szolgáltatások",
    name: "Szolgáltatások",
    icon: "🛠️",
    subcategories: [
      { id: "takaritas", name: "Takarítás", icon: "🧹" },
      { id: "mosoda", name: "Mosoda", icon: "👕" },
      { id: "fotografus", name: "Fotós", icon: "📸" },
      { id: "videografer", name: "Videográfus", icon: "🎥" },
      { id: "esemenyszervezo", name: "Eseményszervező", icon: "🎉" },
      { id: "egyebszolgaltatas", name: "Egyéb szolgáltatás", icon: "🛠️" }
    ]
  }
];

// Összes alkategória lekérése
export const getAllSubcategories = () => {
  return categories.flatMap(category => 
    category.subcategories.map(sub => ({
      ...sub,
      parentCategory: category.name,
      parentIcon: category.icon
    }))
  );
};

// Kategória keresése ID alapján
export const getCategoryById = (id) => {
  return categories.find(cat => cat.id === id);
};

// Alkategória keresése ID alapján
export const getSubcategoryById = (id) => {
  for (const category of categories) {
    const subcategory = category.subcategories.find(sub => sub.id === id);
    if (subcategory) {
      return {
        ...subcategory,
        parentCategory: category.name,
        parentIcon: category.icon
      };
    }
  }
  return null;
}; 