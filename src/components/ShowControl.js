import React from "react";
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { setShowMarked } from '../redux/actions'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ShowControlStyled = styled.div`
  margin: 10px 0 6px;
  svg {
    font-size: 1.2em;
    cursor: pointer;
    margin-right: 5px;
  }
  span {
    font-weight: 700;
  }
`

export const ShowControl = () => {
  const showMarked = useSelector(state => state.showMarked)
  const dispatch = useDispatch()
  return (
    <ShowControlStyled className="show-control">
      {showMarked 
      ? <FontAwesomeIcon icon={faChevronDown} onClick={() => dispatch(setShowMarked())} />
      : <FontAwesomeIcon icon={faChevronRight} onClick={() => dispatch(setShowMarked())} />
      }
      <span>Mostrar elementos marcados</span>
    </ShowControlStyled>
  );
};
