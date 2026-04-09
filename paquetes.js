/**
 * ============================================================
 *  ESCAPADITAS — PAQUETES DE VIAJE
 *  ============================================================
 *  Editá este archivo para gestionar tus paquetes.
 *  Los cambios se guardan automáticamente en el navegador.
 *  
 *  Usá el panel ⚙️ (botón abajo a la izquierda) para
 *  agregar, editar y eliminar paquetes sin tocar código.
 *  ============================================================
 */

const PAQUETES_INICIALES = [
  {
    id: "paq-001",
    nombre: "Bariloche Mágico",
    destino: "Patagonia, Argentina",
    descripcion: "Descubrí la magia del sur argentino con este paquete todo incluido. Lagos cristalinos, bosques de araucarias y nieve en invierno. Una experiencia que no vas a olvidar.",
    descripcionLarga: "Sumérgete en el paisaje más espectacular de Argentina. Este paquete incluye vuelo directo a Bariloche, hotel boutique frente al lago, desayuno buffet todas las mañanas y traslados incluidos. Podés elegir excursiones opcionales al Cerro Catedral, circuito chico o cruce lacustre.",
    imagen: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    precio: 280000,
    moneda: "ARS",
    noches: 5,
    categoria: "Nacional",
    incluye: ["Vuelos ida y vuelta", "Hotel 4★", "Desayuno diario", "Traslados aeropuerto", "Seguro de viaje"],
    badge: "",
    activo: true
  },
  {
    id: "paq-002",
    nombre: "Cancún Todo Incluido",
    destino: "Quintana Roo, México",
    descripcion: "Playas de arena blanca, mar turquesa y todo el descanso que merecés. El destino favorito para parejas y familias con el mejor todo incluido.",
    descripcionLarga: "Voláa Cancún y dejate llevar por las playas más bonitas del Caribe. Resort 5 estrellas frente al mar con régimen todo incluido: comidas, bebidas, actividades acuáticas y entretenimiento. A minutos de la zona arqueológica de Tulum y el Parque Xcaret.",
    imagen: "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800&q=80",
    precio: 1850,
    moneda: "USD",
    noches: 7,
    categoria: "Internacional",
    incluye: ["Vuelo internacional", "Resort 5★ todo incluido", "Traslados", "Seguro de viaje", "Asistencia 24h"],
    badge: "Más vendido",
    activo: true
  },
  {
    id: "paq-003",
    nombre: "Escapada a Mendoza",
    destino: "Mendoza, Argentina",
    descripcion: "Bodegas, montañas y el mejor vino del mundo. Mendoza te espera con tours vitivinícolas, spa de viñedo y paisajes de los Andes.",
    descripcionLarga: "Un fin de semana largo que se convierte en una experiencia gourmet. Visitá las mejores bodegas de Luján de Cuyo, disfrutá de un almuerzo en viñedo, recorré el Aconcagua Provincial Park y relajate en un spa de montaña.",
    imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    precio: 180000,
    moneda: "ARS",
    noches: 3,
    categoria: "Nacional",
    incluye: ["Vuelos", "Hotel boutique", "Desayuno", "Tour bodegas", "Traslados"],
    badge: "Oferta",
    activo: true
  },
  {
    id: "paq-004",
    nombre: "Europa en 12 días",
    destino: "España, Francia, Italia",
    descripcion: "El clásico europeo con las ciudades más icónicas del viejo continente. Madrid, París y Roma en un circuito organizado con guía en español.",
    descripcionLarga: "Un itinerario pensado para aprovechar cada día al máximo. Arrancás en Madrid, cruzás a París en tren de alta velocidad y terminás con 4 días en Roma. Hoteles céntricos, desayunos incluidos y guía acompañante en español durante todo el recorrido.",
    imagen: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
    precio: 4200,
    moneda: "USD",
    noches: 12,
    categoria: "Internacional",
    incluye: ["Vuelo internacional", "Hoteles céntricos", "Desayunos", "Trenes entre ciudades", "Guía en español", "Seguro"],
    badge: "",
    activo: true
  },
  {
    id: "paq-005",
    nombre: "Iguazú Cataratas",
    destino: "Misiones, Argentina",
    descripcion: "Las cataratas más impresionantes del mundo a tu alcance. Paquete familiar con acceso al Parque Nacional y Paseo Garganta del Diablo.",
    descripcionLarga: "Las Cataratas del Iguazú son declaradas Patrimonio Mundial de la UNESCO y una de las 7 Maravillas Naturales del Mundo. Este paquete incluye el acceso al parque nacional, paseo en lancha por el Circuito Inferior y la experiencia de la Garganta del Diablo.",
    imagen: "https://images.unsplash.com/photo-1536184479936-ead1e7e70571?w=800&q=80",
    precio: 220000,
    moneda: "ARS",
    noches: 4,
    categoria: "Nacional",
    incluye: ["Vuelos", "Hotel", "Desayuno", "Entradas al parque", "Paseo en lancha", "Traslados"],
    badge: "",
    activo: true
  },
  {
    id: "paq-006",
    nombre: "Miami & Orlando",
    destino: "Florida, Estados Unidos",
    descripcion: "Compras en Miami y la magia de Disney u Universal en Orlando. El combo perfecto para toda la familia con parques temáticos incluidos.",
    descripcionLarga: "Comenzás 3 noches en Miami con free day para disfrutar South Beach y Wynwood. Luego te trasladás a Orlando para vivir 4 días de pura magia: Disney Magic Kingdom, EPCOT y Universal Studios. Hoteles cerca de los parques para no perder tiempo.",
    imagen: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&q=80",
    precio: 3600,
    moneda: "USD",
    noches: 7,
    categoria: "Internacional",
    incluye: ["Vuelo internacional", "Hoteles", "Traslados Miami-Orlando", "3 días de parques Disney/Universal", "Seguro"],
    badge: "Familias",
    activo: true
  }
];

// Configuración inicial del sitio
const CONFIG_INICIAL = {
  whatsapp: "5491100000000",
  email: "hola@escapaditas.com",
  telefono: "+54 11 0000-0000",
  instagram: "https://www.instagram.com/hola.escapaditas/",
  mensajeWa: "Hola! Vi su web y quiero consultar sobre paquetes de viaje 🌍",
  adminPassword: "escapaditas2025"
};
