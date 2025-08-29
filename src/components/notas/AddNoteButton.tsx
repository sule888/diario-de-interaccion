import styles from "./AddNoteButton.module.css";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
};

export default function AddNoteButton({ onClick, disabled }: Props) {
  return (
    <button
      className={`btn btn--success ${styles.button}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Agregar nota de interacción"
      title="Agregar nota de interacción"
    >
      + Nueva nota
    </button>
  );
}
