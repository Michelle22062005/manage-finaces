import React from "react";
import { InfoSections, type InfoSection } from "@/components/common/InfoSections";

const RESPONSABLE = "Danna Oyola";
const CONTACTO = "michelapache17@gmail.com";

const SECTIONS: InfoSection[] = [
  {
    icon: "account",
    title: "Quién es la responsable",
    body: `Mis Cuentas es una aplicación creada y administrada por ${RESPONSABLE}. Para cualquier duda sobre tus datos puedes escribir a ${CONTACTO}.`,
  },
  {
    icon: "database",
    title: "Qué datos guardamos",
    body: "Tu nombre, tu correo y tu contraseña (que se guarda cifrada y nadie puede leer), además de lo que tú registras: ingresos, gastos, categorías y, si lo usas, los gramos de oro.",
  },
  {
    icon: "target",
    title: "Para qué los usamos",
    body: "Únicamente para que la app funcione: mostrarte tus registros, hacer tus totales y generar los archivos que descargas. No usamos tus datos para publicidad.",
  },
  {
    icon: "cloud-lock",
    title: "Dónde se guardan",
    body: "Tus datos se guardan en una base de datos en la nube y viajan por una conexión cifrada. Los proveedores técnicos que alojan la app y la base de datos solo los procesan para que el servicio funcione.",
  },
  {
    icon: "hand-back-right",
    title: "No los vendemos ni los compartimos",
    body: "No vendemos tus datos ni los entregamos a terceros con fines comerciales.",
  },
  {
    icon: "shield-account",
    title: "Tus derechos",
    body: `Según la Ley 1581 de 2012, puedes conocer, actualizar y rectificar tus datos, pedir que se eliminen y retirar tu autorización cuando quieras. Escríbenos a ${CONTACTO}.`,
  },
    {
    icon: "account-remove",
    title: "Eliminar tu cuenta",
    body: `Puedes eliminar tu cuenta cuando quieras desde Perfil, en "Eliminar mi cuenta". Se borran tu cuenta y todos tus datos de forma permanente. Si no puedes entrar a la app, escribe a ${CONTACTO} y lo hacemos por ti.`,
    },
  {
    icon: "scale-balance",
    title: "Reglas de uso",
    body: "Tú eres responsable de que lo que registras sea correcto y de cuidar tu contraseña. Mis Cuentas es una herramienta para llevar tus registros: no reemplaza la asesoría financiera, contable ni legal.",
  },
  {
    icon: "update",
    title: "Cambios",
    body: "Si estos términos cambian, te avisaremos en la app antes de que apliquen.",
  },
];

export default function LegalScreen() {
  return (
    <InfoSections
      intro="Aquí te explicamos, en palabras simples, cómo cuidamos tu información y qué reglas tiene la app."
      sections={SECTIONS}
      footer="Versión 2026-10"
    />
  );
}