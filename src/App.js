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

  async function setListsOrder() {
    // sacamos el orden de las listas del localStorage:
    const localColumnsString = localStorage.getItem('mailkaze-shopping-columns')
    if (localColumnsString != null) {
      const localColumns = JSON.parse(localColumnsString)
      // si las listas no están vacías:
      if (localColumns["no-marked"].elementIds.length > 0 && localColumns["marked"].elementIds.length > 0) {
        dispatch(setColumns(localColumns))
      } else { // si las listas están vacías las creamos desde cero
        if (elements.length > 0) {
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
      }  
    } 

    // traemos el orden de las listas de internet si se puede:
    const noMarked = await db.collection('columns').doc('no-marked').get()
    const marked = await db.collection('columns').doc('marked').get()
    const tempColumns = {
      "no-marked": {...noMarked.data()},
      "marked": {...marked.data()}
    } // si el orden en Firebase no está vacío lo traemos al state:
    if (tempColumns["no-marked"].elementIds.length > 0 && tempColumns["marked"].elementIds.length > 0) {
      dispatch(setColumns(tempColumns))
    } 
  }

  function updateColumns() {
    let eleNoMarked = elements.filter(e => !e.marked)
    let eleMarked = elements.filter(e => e.marked) 
    let colNoMarked = columns['no-marked'].elementIds
    let colMarked = columns['marked'].elementIds
    // si hay un marcado que no estaba en la lista del columns, lo añadimos al final y lo borramos de la otra lista
    eleNoMarked.map(e => {
      if(!colNoMarked.includes(e.id)) {
        colNoMarked.push(e.id)
        colMarked = colMarked.filter(id => id !== e.id)    
      }
    })
    // vicebersa
    eleMarked.map(e => {
      if(!colMarked.includes(e.id)) {
        colMarked.unshift(e.id)
        colNoMarked = colNoMarked.filter(id => id !== e.id) 
      }
    })
    const newColumns = {
      'no-marked': {...columns['no-marked'], elementIds: colNoMarked},
      'marked': {...columns['marked'], elementIds: colMarked},
    }
    // actualizamos el state columns
    dispatch(setColumns(newColumns))
  }
  
  useEffect(() => {
    if (elements.length > 0){
      localStorage.setItem('mailkaze-shopping-list', JSON.stringify(elements))
    }  
    // TODO: aquí debemos actualizar las columnas
    updateColumns()
  }, [elements])

  useEffect(() => {
    if (columns["no-marked"].elementIds.length > 0 && columns["marked"].elementIds.length > 0){
      localStorage.setItem('mailkaze-shopping-columns', JSON.stringify(columns))
      db.collection('columns').doc('no-marked').set(columns['no-marked'])
      db.collection('columns').doc('marked').set(columns['marked'])
    }
  }, [columns])

  useEffect(() => {
    getElements();
    setListsOrder()
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
    // onDragEnd actualiza el orden de las listas en el state:
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
