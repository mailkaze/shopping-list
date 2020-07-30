import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { setShowForm, setCurrentId } from '../redux/actions'
import { setElements } from '../redux/actions'


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
  .fas {
    display: inline-block;
    cursor: pointer;
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
  .fa-pen {
    margin-right: 14px;
  }
`

export const Element = ({ element }) => {
  console.log(element)
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1);
  const [showButtons, setShowButtons] = useState(false)

  const toggleMarked = async (id) => {
    try {
      const res = await db.collection("shoppingElements").doc(id).get();
      const data = res.data();
      await db.collection("shoppingElements").doc(id).update({ ...data, marked: !data.marked });
    } catch (e) {
      console.log('no se pudo cambiar el marcado en la DB, se hará en local')
      let localElements = localStorage.getItem('shoppingElements')
      if (localElements != null) {
        localElements = JSON.parse(localElements)
        const i = localElements.findIndex(e => e.id === id)
        localElements[i].marked = !localElements[i].marked
        localStorage.setItem('shoppingElements', JSON.stringify(localElements))
        dispatch(setElements(localElements))

      }
    }
  };

  const deleteElement = async id => {
    await db.collection('shoppingElements').doc(id).delete()
  }

  const updateQuantity = async (num, id) => {
    const doc = await db.collection('shoppingElements').doc(id).get()
    let el = {...doc.data(), quantity: num}
    await db.collection('shoppingElements').doc(id).update(el)
  }

  useEffect(() => {
    setQuantity(element.quantity);
  }, []);

  const handleEdit = (id) => {
    dispatch(setCurrentId(id))
    dispatch(setShowForm(true))
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Borrar este elemento?")) {
      deleteElement(id);
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
            ? <i className="fas fa-check"></i>
            : <i className="far fa-square"></i>
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
      <i className="fas fa-ellipsis-v" onClick={() => setShowButtons(!showButtons)}></i>
      {
        showButtons && (
          <div className="buttons">
            <i
              className="fas fa-pen"
              onClick={() => handleEdit(element.id)}
            ></i>
            <i
              className="fas fa-trash"
              onClick={() => handleDelete(element.id)}
            ></i>
          </div>
        )
      }
    </ElementStyled>
  );
};
