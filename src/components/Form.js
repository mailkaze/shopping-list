import React, { useState, useEffect } from 'react'
import {db} from '../firebase'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { setShowForm, setCurrentId, editElement } from '../redux/actions'

const FormStyled = styled.form`
  width: 60vw;
  position: fixed;
  background: #fefae0;
  left: 18vw;
  top: 20vh;
  border-radius: 8px;
  box-shadow: 1px 1px 3px rgba(0,0,0,.6);
  .form-content {
    margin: 3px;
    padding: 26px 20px 14px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .fa-times {
    position: absolute;
    right: 10px;
    top: 5px;
    cursor: pointer;
    font-size: 1.2em;
    z-index: 100;
  }
  #name {
    width: 100%;
    margin-bottom: 5px;
  }
  .down {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .down #price {
    width: 49%;
  }
  .down #save {
    width: 49%;
  }
`

export const Form = () => {
  const dispatch = useDispatch()
  const currentId = useSelector(state => state.currentId)
  const initialElement = {
    name: '',
    price: '',
    marked: false,
    quantity: 1
  }
  const [element, setElement] = useState(initialElement)

  const handleSubmit = async e => {
    e.preventDefault()
    // No puedo crear un nuevo elemento sin conexión porque trabajo con las
    // IDs que crea Firebase automáticamente.
    if (currentId === '') { //crear nuevo elemento
      // try {
      //   await db.collection('shoppingElements').doc().set(element)
      // } catch(e) {
      //   alert('Error de red al intentar crear un elemento')
      // }
        
    } else { // Editar elemento
        dispatch(editElement({...element, id: currentId}))
        // try {
        //   await db.collection('shoppingElements').doc(currentId).update(element)
        // } catch(e) {
        //   alert('Error de red, cambios guardados sólo en local.')
        // }      
    }
    
    dispatch(setCurrentId(''))
    setElement(initialElement)
    dispatch(setShowForm())
  }

  const handleChange = e => {
    setElement({...element, [e.target.name]: e.target.value})
  }

  const getElement = async id => {
    const doc = await db.collection('shoppingElements').doc(id).get()
    setElement({...doc.data()})
  }

  const handleClose = () => {
    dispatch(setCurrentId(''))
    dispatch(setShowForm())
  }

  useEffect(() => {
    if (currentId === '') {
        setElement({...initialElement})
    } else {
        getElement(currentId)
    }
  }, [currentId])

  return (
    <FormStyled onSubmit={handleSubmit}>
      <i className="fas fa-times" onClick={handleClose} ></i>
      <div className="form-content">
        <input 
          id="name"
          type="text"
          name="name"
          onChange={handleChange}
          value={element.name}
          placeholder="Nombre ..."
          className="form-control"
          autoFocus
        />
        <div className="down">
          <input 
            id="price"
            type="number"
            step="0.01"
            name="price"
            className="form-control"
            onChange={handleChange}
            value={element.price}
            placeholder="Precio ..."
          />
          <input 
            type="submit" 
            value="Guardar" 
            id="save"
            className="btn btn-primary"
          />
        </div>
      </div>
    </FormStyled>
  )
}
