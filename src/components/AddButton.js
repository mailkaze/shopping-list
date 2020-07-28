import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { setShowForm } from '../redux/actions'

const ButtonStyled = styled.i`
  border-radius: 50%;
  padding: 22px;
  font-size: 1.4em;
  background: #ff006e;
  color: white;
  position: fixed;
  float: inline-end;
  bottom: 3vh;
  right: 5vw;
  box-shadow: 1.5px 1.5px 3px rgba(2, 2, 5, .6);
  cursor: pointer;
`

export const AddButton = () => {
  const dispatch = useDispatch()

  return (
    <ButtonStyled 
      className="fas fa-plus" 
      onClick={() => dispatch(setShowForm(true)) }
    ></ButtonStyled>
  )
}
