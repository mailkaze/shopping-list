import React from "react";
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { setSearch } from '../redux/actions'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SearchStyled = styled.div`
  position: relative;
  width: 80%;
  #search {
    width: 100%;
    margin-top: 12px;
    border-style: none;
    padding: 4px 14px;
    font-size: 1em;
    border-radius: 18px;
    height: 38px;
    background: #fcc266;
  }
  .fa-times {
    position: absolute;
    top: 23px;
    right: 11px;
    cursor: pointer;
  }
`

export const Search = () => {
  const search = useSelector(state => state.search)
  const dispatch = useDispatch()
  
  const handleChange = (e) => {
    dispatch(setSearch(e.target.value))
  };

  const clearSearch = () => {
    dispatch(setSearch(''))
  }

  return (
    <SearchStyled className="search">
      <input
        id="search"
        type="text"
        onChange={handleChange}
        placeholder="Buscar ..."
        value={search}
        autoFocus
      />
      {search && <FontAwesomeIcon icon={faTimes} onClick={clearSearch} />}
    </SearchStyled>
  );
};
