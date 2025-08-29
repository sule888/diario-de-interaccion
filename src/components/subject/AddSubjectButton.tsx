import styles from "./AddSubjectButton.module.css";

export default function AddSubjectButton({ onClick }: { onClick: () => void }) {
  return (
    // como exportar estilos de un archivo modulado de css a los componentes
    <button className={`btn btn--primary ${styles.button}`} onClick={onClick}>
      + Agregar sujeto de interacción
    </button>
  );
}
