export const DEFAULT_CATEGORIES = [
  // Taxi
  { name: "Carreras", scope: "taxi", icon: "taxi" },
  { name: "Gasolina", scope: "taxi", icon: "gas-station" },
  { name: "Lavada", scope: "taxi", icon: "car-wash" },
  { name: "Parqueadero", scope: "taxi", icon: "parking" },
  { name: "Peajes", scope: "taxi", icon: "road-variant" },

  // Personal
  { name: "Comida en la calle", scope: "propio", icon: "food" },
  { name: "Desayunos", scope: "propio", icon: "coffee" },
  { name: "Maquillaje y Skincare", scope: "propio", icon: "lipstick" },
  { name: "Manicure y Pedicure", scope: "propio", icon: "hand-heart" },
  { name: "Depilación", scope: "propio", icon: "razor-double-edge" },
  { name: "Pasajes Universidad", scope: "propio", icon: "bus" },
  { name: "Pasajes Hermana", scope: "propio", icon: "bus-side" },
  { name: "Universidad y Materiales", scope: "propio", icon: "school" },
  { name: "Plan de Celular", scope: "propio", icon: "cellphone" },

  // Casa
  { name: "Mercado", scope: "casa", icon: "cart" },
  { name: "Mercado de Verduras", scope: "casa", icon: "food-apple" },
  { name: "Servicio de Energía / Luz", scope: "casa", icon: "lightbulb-on" },
  { name: "Servicio de Agua y Alcantarillado", scope: "casa", icon: "water" },
  { name: "Internet y Televisión", scope: "casa", icon: "wifi" },
  { name: "Gas Domiciliario", scope: "casa", icon: "fire" },
] as const;