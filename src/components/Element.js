import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { setShowForm, setCurrentId } from '../redux/actions'
import { editElement, deleteElement } from '../redux/actions'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { faCheck, faEllipsisV, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ElementStyled = styled.div`
  background: #fcc266;
  position: relative;
  margin: 3px 0 0 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-direction: row;
  padding: 10px;
  border: none;
  box-shadow: 1px 1px 3px rgba(0,0,0,.6);
  .content > *{
    display: inline-block;
    margin-right: 5px;
  }
  .content label{
    transform: scale(1.3);
    cursor: pointer;
    margin: 0;
  }
  label .fa-square, .fa-check {
    margin: 0 5px 0 2px;
  }
  label .fa-check {
    color: #82C91E;
  }
  .content .checkbox {
    display: none;
  }
  .content p {
    margin-bottom: 0;
  }
  .content #quantity {
    width: 38px;
    padding: 0 0 0 2px;
    height: 1.8em;
    background: #fcc266;
    border-style: none;
  }
  .buttons {
    background: whitesmoke;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, .7);
    border-radius: 3px;
    padding: 6px 10px;
    position: absolute;
    right: 34px;
    bottom: 2px;
    font-size: 1.4em;
  }
  .fa-ellipsis-v {
    display: inline-block;
    cursor: pointer;
  }
  .fa-pen {
    margin-right: 14px;
    display: inline-block;
    cursor: pointer;
  }
  .fa-trash {
    display: inline-block;
    cursor: pointer;
  }
`

export const Element = ({ element }) => {
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1);
  const [showButtons, setShowButtons] = useState(false)

  const toggleMarked = async (id) => {
    dispatch(editElement({...element, marked: !element.marked}))
    const res = await db.collection("shoppingElements").doc(id).get();
    const data = res.data();
    await db.collection("shoppingElements").doc(id).update({ ...data, marked: !data.marked });
  };

  const deleteEle = async id => {
    dispatch(deleteElement(id))
    await db.collection('shoppingElements').doc(id).delete()  
  }

  const updateQuantity = async (num, id) => {
    dispatch(editElement({...element, quantity: num}))
    const doc = await db.collection('shoppingElements').doc(id).get()
    await db.collection('shoppingElements').doc(id).update({...doc.data(), quantity: num})
  }

  useEffect(() => {
    setQuantity(element.quantity);
  }, []);

  const handleEdit = (id) => {
    setShowButtons(!showButtons)
    dispatch(setCurrentId(id))
    dispatch(setShowForm(true))
  };

  const handleDelete = (id) => {
    setShowButtons(!showButtons)
    if (window.confirm("¿Borrar este elemento?")) {
      deleteEle(id);
    }
  };

  const handleChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleKeyUp = (e, id) => {
    if (e.keyCode === 13) {
      if (!isNaN(e.target.value) && e.target.value > 0) {
        updateQuantity(quantity, id)
      } else {
        setQuantity(1)
        updateQuantity(1, id)
      }
    }
  };

  return (
    <ElementStyled className="card">
      <div className="content">
        <label htmlFor={"checkbox" + element.id}>
          {
            element.marked
            ? <FontAwesomeIcon icon={faCheck} />
            : <FontAwesomeIcon icon={faSquare} />
          }
        </label>
        <input
          type="checkbox"
          name="checkbox"
          className="checkbox"
          id={"checkbox" + element.id}
          checked={element.marked}
          onChange={() => {
            toggleMarked(element.id)
          }
          }
        />
        <p>{element.name} X </p>
        <input
          className="form-control"
          id="quantity"
          type="number"
          name="quantity"
          step="0.1"
          value={quantity}
          onChange={(e) => handleChange(e)}
          onKeyUp={(e) => handleKeyUp(e, element.id)}
        />
        <p>Bs.{Intl.NumberFormat().format(element.price * quantity)}</p>
      </div>
      {/* <i className="fas fa-ellipsis-v" onClick={() => setShowButtons(!showButtons)}></i> */}
      <FontAwesomeIcon icon={faEllipsisV} onClick={() => setShowButtons(!showButtons)} />
      {
        showButtons && (
          <div className="buttons">
            <FontAwesomeIcon icon={faPen} onClick={() => handleEdit(element.id)} />
            <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(element.id)} />
          </div>
        )
      }
    </ElementStyled>
  );
};
