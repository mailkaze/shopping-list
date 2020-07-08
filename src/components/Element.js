import React, { useState, useEffect } from "react";
import './element.css'

export const Element = (props) => {
  const [quantity, setQuantity] = useState(1);
  const [showButtons, setShowButtons] = useState(false)

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
    }
  };

  return (
    <div className="card">
      <div className="content">
        <label htmlFor={"checkbox" + props.element.id}>
          {
            props.element.marked
            ? <i className="fas fa-check"></i>
            : <i className="far fa-square"></i>
          }
        </label>
        <input
          type="checkbox"
          name="checkbox"
          className="checkbox"
          id={"checkbox" + props.element.id}
          checked={props.element.marked}
          onChange={() => {
            console.log(props.element.name)
            console.log(props.element.id)
            props.toggleMarked(props.element.id)
            }
          }
        />
        <p>{props.element.name} X </p>
        <input
          className="form-control"
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
      <i className="fas fa-ellipsis-v" onClick={() => setShowButtons(!showButtons)}></i>
      {
        showButtons && (
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
        )
      }
    </div>
  );
};
