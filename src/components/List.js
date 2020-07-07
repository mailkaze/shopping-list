import React from 'react'
import {Element} from './Element'

export const List = props => {
  return (
    <>
      {
          props.elements
          .filter(element => element.marked === props.marked)
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
