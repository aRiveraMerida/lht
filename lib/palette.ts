export const palette = {
  paper: "#EEE7DA",    // Fondo principal
  shell: "#6F7C4B",    // Verde caparazón
  moss: "#54633A",     // Verde musgo oscuro
  olive: "#8E9562",    // Verde oliva
  pond: "#9DB7A7",     // Verde agua / estanque
  sand: "#D8BA83",     // Arena dorada
  bark: "#5A4632",     // Marrón corteza (bordes, acentos primarios)
  amber: "#C78A3B",    // Ámbar
  cream: "#F7F1E7",    // Crema (cards, superficies)
  ink: "#181614",      // Negro tinta (texto principal)
} as const

export type PaletteColor = keyof typeof palette

export const categoryColors: Record<string, string> = {
  "Laboratorios": palette.sand,
  "Estrategia": palette.pond,
  "Automatizaciones": palette.amber,
  "Sin filtro": palette.olive,
  "Adopción IA": palette.shell,
  "Personas": palette.pond,
  "Notas de campo": palette.sand,
}
