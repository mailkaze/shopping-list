import React from 'react'
import {Element} from './Element'
import { useSelector } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'

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
    <Droppable droppableId={!marked ? "list1" : "list2"} >
      {
        provided => (
          <div ref={provided.innerRef} {...provided.droppableProps} >
            {
              filterSearch()
              .filter(e => e.marked === marked)
              .map((element, index) => 
                <Element 
                  element={element}  
                  key={element.id} 
                  index={index}
                /> 
              )
            }
            {provided.placeholder} 
          </div>
        )
      }
      
    </Droppable>
  )
}
