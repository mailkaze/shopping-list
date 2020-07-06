import React from "react";

export const ShowControl = (props) => {
  return (
    <div>
      {props.showMarked ? (
        <i className="fas fa-chevron-down" onClick={props.toggleShow}></i>
      ) : (
        <i className="fas fa-chevron-right" onClick={props.toggleShow}></i>
      )}
      <span>Mostrar elementos marcados</span>
    </div>
  );
};
