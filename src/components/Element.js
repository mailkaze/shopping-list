import React, { useState, useEffect } from "react";
import './element.css'

export const Element = (props) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(props.element.quantity);
  }, []);

  const handleEdit = (id) => {
    props.setCurrentId(id);
    props.setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Borrar este elemento?")) {
      props.deleteElement(id);
    }
  };

  const handleChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleKeyUp = (e, id) => {
    if (e.keyCode === 13) {
      if (!isNaN(e.target.value) && e.target.value > 0) {
        props.updateQuantity(quantity, id)
      } else {
        setQuantity(1)
        props.updateQuantity(1, id)
      }
      props.calculateTotal()
    }
  };

  return (
    <div className="card">
      <div className="content">
        <input
          type="checkbox"
          name="checkbox"
          id="checkbox"
          checked={props.element.marked}
          onChange={() => props.toggleMarked(props.element.id)}
        />
        <p>{props.element.name}</p>
        <input
          id="quantity"
          type="number"
          name="quantity"
          step="0.1"
          value={quantity}
          onChange={(e) => handleChange(e)}
          onKeyUp={(e) => handleKeyUp(e, props.element.id)}
        />
        <p>Bs.{Intl.NumberFormat().format(props.element.price * quantity)}</p>
      </div>
      <div className="buttons">
        <i
          className="fas fa-pen"
          onClick={() => handleEdit(props.element.id)}
        ></i>
        <i
          className="fas fa-trash"
          onClick={() => handleDelete(props.element.id)}
        ></i>
      </div>
    </div>
  );
};
