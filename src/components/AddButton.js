import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { setShowForm } from '../redux/actions'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ButtonStyled = styled.i`
  border-radius: 50%;
  padding: 14.6px 22px;
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
    <ButtonStyled onClick={() => dispatch(setShowForm(true))} >
      <FontAwesomeIcon icon={faPlus} />
    </ButtonStyled>
  )
}
