import React from 'react'
import {Element} from './Element'
import { useSelector } from 'react-redux'
import { Droppable } from 'react-beautiful-dnd'

export const List = ({ marked, orderedElements }) => {
  const search = useSelector(state => state.search)
  
  const filterSearch = () => {
    if (search) {
      return orderedElements.filter(e => 
        e.name.toLowerCase().includes(search.toLowerCase().trim()))
    } else {
      return orderedElements
    }
  }

  return (
    <Droppable droppableId={!marked ? "no-marked" : "marked"} >
      {
        provided => (
          <div className="list-container" ref={provided.innerRef} {...provided.droppableProps} >
            {
              filterSearch()
              .filter(e => e.marked === marked)
              .map((element, index) => <Element element={element} key={element.id} index={index} />)
            }
            {provided.placeholder} 
          </div>
        )
      }
    </Droppable>
  )
}
