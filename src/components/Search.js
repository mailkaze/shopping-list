import React, {useEffect} from "react";
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux'
import { setSearch } from '../redux/actions'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SearchStyled = styled.div`
  width: 58%;
  #search {
    width: 100%;
    border-style: none;
    padding: 4px 14px;
    font-size: 1em;
    border-radius: 18px;
    height: 34px;
    background: #fcc266;
  }
`

export const Search = () => {
  const search = useSelector(state => state.search)
  const dispatch = useDispatch()
  
  const handleChange = (e) => {
    dispatch(setSearch(e.target.value))
  };

  useEffect(() => {
    console.log(`la búsqueda es ${search}`)
  }, [search])

  return (
    <SearchStyled className="search">
      <input
        id="search"
        type="search"
        onChange={handleChange}
        placeholder="Buscar ..."
        value={search}
      />
    </SearchStyled>
  );
};
