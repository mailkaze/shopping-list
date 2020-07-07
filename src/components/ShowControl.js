import React from "react";
import './showControl.css'

export const ShowControl = (props) => {
  return (
    <div className="show-control">
      {props.showMarked ? (
        <i className="fas fa-chevron-down" onClick={props.toggleShow}></i>
      ) : (
        <i className="fas fa-chevron-right" onClick={props.toggleShow}></i>
      )}
      <span>Mostrar elementos marcados</span>
    </div>
  );
};
