import React from "react";
import "./Input.css";

function Input({ label, state, setState, placeholder, type }) {
  return (
    <div className="input-wrapper">
      <p className="label-input">{label}</p>
      <input
        value={state}
        type={type}
        onChange={(e) => setState(e.target.value)}
        placeholder={placeholder}
        className="custom-input"
      />
    </div>
  );
}

export default Input;
