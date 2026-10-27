import {
  InfoSections,
  type InfoSection,
} from "@/components/common/InfoSections";

const SECTIONS: InfoSection[] = [
  {
    icon: "wallet",
    title: "Para qué sirve",
    body: "Para que no se te olvide nada cuando te llega plata y no pierdas el hilo de tus cuentas. Todo lo que ganas y lo que gastas queda en un solo lugar, ordenado por categorías.",
  },
  {
    icon: "pencil-plus",
    title: "Cómo registrar",
    body: "En Inicio elige Ingreso o Gasto, escribe el valor, escoge la categoría y, si quieres, una nota. Anota cada movimiento en el momento: lo ganado en el día, la gasolina, la comida, un pago a un banco.",
  },
  {
    icon: "chart-donut",
    title: "Tu resumen",
    body: "Arriba ves lo ganado, lo gastado y lo que te quedó, con el porcentaje de lo que ya gastaste. Más abajo, cuánto llevas en cada categoría.",
  },
  {
    icon: "history",
    title: "Historial y filtro por mes",
    body: "En Historial ves todo lo que has registrado, día por día. Puedes cambiar de mes y filtrar solo ingresos o solo gastos para saber cuánto ganaste y cuánto sacaste.",
  },
  {
    icon: "download",
    title: "Descargar por mes",
    body: "En Perfil puedes descargar el resultado de cualquier mes en un archivo que abre en Excel. Lo guardas en el celular o lo compartes.",
  },
  {
    icon: "gold",
    title: "Oro",
    body: "Cuando registras un ingreso en una categoría de oro, aparece una pestaña para llevar tus gramos: cuánto entra, cuánto sacas o vendes y cuánto te queda.",
  },
  {
    icon: "shield-lock",
    title: "Tus datos",
    body: "Lo que registras se guarda en una base de datos en la nube, ligada a tu cuenta. Cada cuenta ve únicamente sus propios movimientos. Los detalles están en Términos y privacidad.",
  },
];

export default function ComoFuncionaScreen() {
  return (
    <InfoSections
      intro="Mis Finanzas te ayuda a tener tu plata en orden: anotas lo que entra y lo que sale, y la app hace las cuentas por ti."
      sections={SECTIONS}
      footer="Mis Finanzas es una herramienta para llevar tus registros. No reemplaza la asesoría financiera ni contable."
    />
  );
}
