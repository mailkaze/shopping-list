import React from "react";
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { setShowMarked } from '../redux/actions'

const ShowControlStyled = styled.div`
  margin: 10px 0 6px;
  i {
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
      {showMarked ? (
        <i className="fas fa-chevron-down" onClick={() => dispatch(setShowMarked())}></i>
      ) : (
        <i className="fas fa-chevron-right" onClick={() => dispatch(setShowMarked())}></i>
      )}
      <span>Mostrar elementos marcados</span>
    </ShowControlStyled>
  );
};
