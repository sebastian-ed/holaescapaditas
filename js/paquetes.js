/**
 * HOLA ESCAPADITAS — paquetes.js
 * Datos iniciales. Se sobreescriben con lo que guardes en el panel.
 */

const PAQUETES_INICIALES = [
  {
    id: "paq-001",
    nombre: "Bariloche Mágico",
    destino: "Patagonia, Argentina",
    descripcion: "Lagos cristalinos, bosques de araucarias y nieve en invierno. El sur argentino en todo su esplendor.",
    descripcionLarga: "Sumérgete en el paisaje más espectacular de Argentina. Este paquete incluye vuelo directo a Bariloche, hotel boutique frente al lago, desayuno buffet todas las mañanas y traslados incluidos.\n\nPodés elegir excursiones opcionales al Cerro Catedral, circuito chico o cruce lacustre a Chile. Cada día es una aventura nueva en uno de los destinos más lindos del mundo.",
    imagenes: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=85"
    ],
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
    descripcion: "Playas de arena blanca, mar turquesa y todo el descanso que merecés. El Caribe al alcance de tu mano.",
    descripcionLarga: "Volá a Cancún y dejate llevar por las playas más bonitas del Caribe. Resort 5 estrellas frente al mar con régimen todo incluido: comidas, bebidas ilimitadas, actividades acuáticas y entretenimiento nocturno.\n\nA minutos de la zona arqueológica de Tulum y el Parque Xcaret. Ideal para parejas, familias y grupos de amigos que quieren desconectarse de todo.",
    imagenes: [
      "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=1200&q=85",
      "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=1200&q=85"
    ],
    precio: 1850,
    moneda: "USD",
    noches: 7,
    categoria: "Internacional",
    incluye: ["Vuelo internacional", "Resort 5★ todo incluido", "Traslados aeropuerto", "Seguro de viaje", "Asistencia 24h"],
    badge: "Más vendido",
    activo: true
  },
  {
    id: "paq-003",
    nombre: "Escapada a Mendoza",
    destino: "Mendoza, Argentina",
    descripcion: "Bodegas, montañas y el mejor vino del mundo. Un fin de semana que se convierte en experiencia gourmet.",
    descripcionLarga: "Visitá las mejores bodegas de Luján de Cuyo, disfrutá de un almuerzo en viñedo con vista a los Andes, recorré el Aconcagua Provincial Park y relajate en un spa de montaña.\n\nIdeal para parejas o amigos que quieren una escapada de calidad sin salir del país.",
    imagenes: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1200&q=85"
    ],
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
    descripcion: "El clásico europeo con las ciudades más icónicas. Madrid, París y Roma en un circuito con guía en español.",
    descripcionLarga: "Un itinerario pensado para aprovechar cada día al máximo. Arrancás en Madrid (3 noches), cruzás a París en tren de alta velocidad (4 noches) y terminás con 4 días en Roma.\n\nHoteles céntricos con desayunos incluidos y guía acompañante en español durante todo el recorrido. El sueño europeo al alcance de todos.",
    imagenes: [
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=85",
      "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=1200&q=85",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=85"
    ],
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
    nombre: "Cataratas del Iguazú",
    destino: "Misiones, Argentina",
    descripcion: "Las cataratas más impresionantes del mundo. Parque Nacional, Garganta del Diablo y paseo en lancha.",
    descripcionLarga: "Las Cataratas del Iguazú son Patrimonio Mundial UNESCO y una de las 7 Maravillas Naturales del Mundo. Este paquete incluye acceso al parque nacional, paseo en lancha por el Circuito Inferior y la experiencia única de la Garganta del Diablo.\n\nSe puede combinar con el lado brasileño para una experiencia completa. Ideal para familias y grupos.",
    imagenes: [
      "https://images.unsplash.com/photo-1536184479936-ead1e7e70571?w=1200&q=85",
      "https://images.unsplash.com/photo-1549045374-b6edabf4c2ef?w=1200&q=85"
    ],
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
    descripcion: "Compras en Miami y la magia de Disney u Universal en Orlando. El combo perfecto para toda la familia.",
    descripcionLarga: "Comenzás con 3 noches en Miami para disfrutar South Beach, Wynwood y los mejores shoppings. Luego te trasladás a Orlando para vivir 4 días de pura magia: Disney Magic Kingdom, EPCOT y Universal Studios.\n\nHoteles cerca de los parques para no perder tiempo en traslados. El viaje soñado para toda la familia.",
    imagenes: [
      "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1200&q=85",
      "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=85"
    ],
    precio: 3600,
    moneda: "USD",
    noches: 7,
    categoria: "Internacional",
    incluye: ["Vuelo internacional", "Hoteles", "Traslados Miami-Orlando", "3 días de parques Disney/Universal", "Seguro"],
    badge: "Familias",
    activo: true
  }
];

const CONFIG_INICIAL = {
  whatsapp: "",
  email: "",
  telefono: "",
  instagram: "https://www.instagram.com/hola.escapaditas/",
  mensajeWa: "Hola! Vi su web y quiero consultar sobre paquetes de viaje 🌍"
};

/* ===== STORAGE ===== */
const LS_PAQUETES = 'he_paquetes';
const LS_CONFIG   = 'he_config';

function cargarPaquetes() {
  const raw = localStorage.getItem(LS_PAQUETES);
  if (raw) { try { return JSON.parse(raw); } catch(e){} }
  localStorage.setItem(LS_PAQUETES, JSON.stringify(PAQUETES_INICIALES));
  return JSON.parse(JSON.stringify(PAQUETES_INICIALES));
}
function guardarPaquetes(lista) {
  localStorage.setItem(LS_PAQUETES, JSON.stringify(lista));
}
function cargarConfig() {
  const raw = localStorage.getItem(LS_CONFIG);
  if (raw) { try { return { ...CONFIG_INICIAL, ...JSON.parse(raw) }; } catch(e){} }
  return { ...CONFIG_INICIAL };
}
function guardarConfig(cfg) {
  localStorage.setItem(LS_CONFIG, JSON.stringify(cfg));
}
