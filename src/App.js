import React, { useEffect } from "react";
import { Search } from "./components/Search";
import { List } from "./components/List";
import { ShowControl } from "./components/ShowControl";
import { Total } from "./components/Total";
import { Form } from "./components/Form";
import { AddButton } from "./components/AddButton";
import { db } from "./firebase";
import { useSelector, useDispatch} from 'react-redux'
import { setElements, setColumns } from './redux/actions'
import { DragDropContext} from 'react-beautiful-dnd'

function App() {
  const elements = useSelector(state => state.elements)
  const showMarked = useSelector(state => state.showMarked)
  const showForm = useSelector(state => state.showForm)
  const columns = useSelector(state => state.columns)
  const dispatch = useDispatch()

  const getElements = () => {
    let localElements = localStorage.getItem('mailkaze-shopping-list')
    if (localElements != null) {
      dispatch(setElements(JSON.parse(localElements)))
    }
    db.collection("shoppingElements").onSnapshot((querySnapshot) => {
      const docs = []; 
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      if (docs.length > 0) {
        dispatch(setElements(docs))
      }
    });
  };

  function setListsOrder() {
    const elementIdsNoMarked = elements
    .filter(e => !e.marked)
    .map(e => e.id)
    const elementIdsMarked = elements
    .filter(e => e.marked)
    .map(e => e.id)
    const columnNoMarked = {...columns["no-marked"], elementIds: elementIdsNoMarked}
    const columnMarked = {...columns["marked"], elementIds: elementIdsMarked}
    const newColumns = {...columns, "no-marked": columnNoMarked, "marked": columnMarked}
    dispatch(setColumns(newColumns))
  }
  
  useEffect(() => {
    if (elements.length > 0){
      localStorage.setItem('mailkaze-shopping-list', JSON.stringify(elements))
    }  
    setListsOrder()
  }, [elements])

  useEffect(() => {
    getElements();
  }, []);

  function onDragEnd(result) {
    const { destination, source, draggableId } = result
    if (!destination) {
      return
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    } // No permitimos que se crucen elementos entre listas:
    if (destination.droppableId !== source.droppableId) {
      return
    }
    const column = columns[source.droppableId]
    const newElementIds =  Array.from(column.elementIds)
    newElementIds.splice(source.index, 1)
    newElementIds.splice(destination.index, 0, draggableId)

    const newColumn = {...column, elementIds: newElementIds}
    const newColumns = {...columns, [newColumn.id]: newColumn}

    dispatch(setColumns(newColumns))
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} >
      <div className="container">
        <Search />
        <Total />
        <List marked={false} 
          orderedElements={ columns['no-marked'].elementIds.map(id => elements.filter(e => e.id === id)[0]) }
        />
        <ShowControl />
        { showMarked && <List marked={true} 
          orderedElements={ columns['marked'].elementIds.map(id => elements.filter(e => e.id === id)[0]) }
        /> }
      </div>
      { showForm && <Form /> }
      { !showForm && <AddButton /> }
    </DragDropContext>
  );
}

export default App;
