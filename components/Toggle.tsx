"use client";

import styles from "./toggle.module.css";

export const Toggle = ({ handleChange, isChecked }: { handleChange: () => void; isChecked: boolean }) => {
  return (
    <div className={styles["toggle-container"]}>
      <input
        type="checkbox"
        id="check"
        className={styles.toggle}
        onChange={handleChange}
        checked={isChecked}
      />
      <label htmlFor="check">Dark Mode</label>
    </div>
  );
};

export default Toggle;

