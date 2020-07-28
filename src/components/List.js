import React from 'react'
import {Element} from './Element'
import { useSelector } from 'react-redux'


export const List = ({ marked }) => {
  const elements = useSelector(state => state.elements)
  const search = useSelector(state => state.search)

  const filterSearch = () => {
    if (search) {
      return elements.filter(e => 
        e.name.toLowerCase().includes(search.toLowerCase().trim()))
    } else {
      return elements
    }
  }

  return (
    <>
      {
        filterSearch()
        .filter(e => e.marked === marked)
        .map(element => 
          <Element 
            element={element}  
            key={element.id} 
          /> 
        )
      }
    </>
  )
}
