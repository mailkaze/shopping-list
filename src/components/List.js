import React from 'react'
import {Element} from './Element'

export const List = props => {

  const filterSearch = () => {
    if (props.search) {
      const search = props.search.toLowerCase().trim()
      return props.elements.filter(e => 
        e.name.toLowerCase().includes(search))
    } else {
      return props.elements
    }
  }

  return (
    <>
      {
          // props.elements
          filterSearch()
          .filter(e => e.marked === props.marked)
          .map(element => 
            <Element 
              element={element}  
              key={element.id} 
              toggleMarked={props.toggleMarked}
              deleteElement={props.deleteElement}
              setCurrentId={props.setCurrentId}
              setShowForm={props.setShowForm}
              updateQuantity={props.updateQuantity}
            /> )
      }
    </>
  )
}
