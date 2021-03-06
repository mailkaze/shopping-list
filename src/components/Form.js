import React, { useState, useEffect } from 'react'
import {db} from '../firebase'
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { setShowForm, setCurrentId, editElement } from '../redux/actions'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const FormStyled = styled.form`
  width: 80vw;
  max-width: 500px;
  position: fixed;
  background: #fefae0;
  top: 20vh;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px;
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
    margin-bottom: 10px;
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
  const user =  useSelector(state => state.user)
  const initialElement = {
    name: '',
    price: '',
    marked: false,
    quantity: 1,
    uid: user.uid
  }
  const [element, setElement] = useState(initialElement)

  const handleSubmit = async e => {
    e.preventDefault()
    dispatch(setShowForm())
    if (currentId === '') { //crear nuevo elemento
      await db.collection('shoppingElements').doc().set(element)
    } else { // Editar elemento
      dispatch(editElement({...element, id: currentId}))
      await db.collection('shoppingElements').doc(currentId).update(element)   
    }
    dispatch(setCurrentId(''))
    setElement(initialElement)
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
      <FontAwesomeIcon icon={faTimes} onClick={handleClose} />
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
          required
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
            required
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
