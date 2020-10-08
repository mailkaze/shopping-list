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
import { NavBar } from "./components/NavBar";

function App() {
  const elements = useSelector(state => state.elements)
  const showMarked = useSelector(state => state.showMarked)
  const showForm = useSelector(state => state.showForm)
  const columns = useSelector(state => state.columns)
  const dispatch = useDispatch()

  const getElements = () => {
    // Vamos a intentar hacer el trabajo local con la cache offline que crea Firestore:
    // TODO: debería hacer su trabajo aunque no encuentre la colección o ésta esté vacía
    db.collection("shoppingElements").onSnapshot((querySnapshot) => {
      const docs = []; 
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      if (docs.length > 0) {
        console.log('traigo los elementos de Firebase')
        dispatch(setElements(docs))
      }
    });
  };

  async function setListsOrder() {
    // Vamos a trabajar 'columns' también con la caché de firebase, sin localstorage:

    // traemos el orden de las listas de internet si se puede:
    // TODO: debería hacer su trabajo aunque no encuentre columns o éste esté vacío
    const noMarked = await db.collection('columns').doc('no-marked').get()
    const marked = await db.collection('columns').doc('marked').get()

    const tempColumns = {
      "no-marked": {...noMarked.data()},
      "marked": {...marked.data()}
    }
    
    // si el orden en Firebase no está vacío lo traemos al state:
    if (tempColumns["no-marked"].elementIds.length > 0 && tempColumns["marked"].elementIds.length > 0) {
      console.log('traigo el orden de listas desde Firebase')
      dispatch(setColumns(tempColumns))
    } else { 
      // si las listas están vacías las creamos desde cero:
      // primero comprobamos que 'elements no esté vacío:
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
        console.log('Creo el orden de listas porque estaba vacío en Firebase')
        dispatch(setColumns(newColumns))
      }
    } 
  }

  function updateColumns() {
    let eleNoMarked = elements.filter(e => !e.marked)
    let eleMarked = elements.filter(e => e.marked) 
    let colNoMarked = columns['no-marked'].elementIds
    let colMarked = columns['marked'].elementIds
    // Si 'noMarked' no incluye un ID no marcado de 'elements', lo añade al final y lo borra de 'marked'
    // Si un elemento se añadió, aparecerá en la lista de noMarked y no se borrará de ningún sitio
    // TODO: esto debería ser un ForEach porque no devuelve nada:
    eleNoMarked.map(e => {
      if(!colNoMarked.includes(e.id)) {
        colNoMarked.push(e.id)
        colMarked = colMarked.filter(id => id !== e.id)    
      }
    })
    // Si 'marked' no incluye un ID marcado de 'elements', lo añade al principio y lo borra de 'noMarked'
    eleMarked.map(e => {
      if(!colMarked.includes(e.id)) {
        colMarked.unshift(e.id)
        colNoMarked = colNoMarked.filter(id => id !== e.id) 
      }
    })

    // Si un elemento se borró no estará en elements, lo borramos de columns aquí:
    const elementIDs = elements.map(e => e.id)
    colMarked = colMarked.filter(id => elementIDs.includes(id))
    colNoMarked = colNoMarked.filter(id => elementIDs.includes(id))
    console.log('si sobraba un ID en columns se borró aquí')

    const newColumns = {
      'no-marked': {...columns['no-marked'], elementIds: colNoMarked},
      'marked': {...columns['marked'], elementIds: colMarked},
    }
    // actualizamos el state columns
    dispatch(setColumns(newColumns))
  }
  
  useEffect(() => {
    // Intentamos trabajar con la cache de Firestore, anulamos el localstorage: 
    updateColumns()
  }, [elements])

  useEffect(() => {
    // Cuando cambia 'columns' actualizamos su estado a firestore
    // comprobamos que las listas no estén vacías:
    if (columns["no-marked"].elementIds.length > 0 && columns["marked"].elementIds.length > 0){
      db.collection('columns').doc('no-marked').set(columns['no-marked'])
      db.collection('columns').doc('marked').set(columns['marked'])
      console.log('Actualizo columns en la base de datos')
    }
  }, [columns])

  useEffect(() => {
    // Lo primero que se ejecuta:
    // Activamos el almacenamiento de los datos en cache para esta app
    // y le asignamos una cache de tamaño ilimitado para que no borre cosas:
    db.settings({
      cacheSizeBytes: db.CACHE_SIZE_UNLIMITED
    });
    db.enablePersistence()
    getElements();
    setListsOrder()
  }, []);

  function onDragEnd(result) {
    const { destination, source, draggableId } = result
    // si no se suelta en ningún sitio válido:
    if (!destination) {
      return
    }
    // Si se suelta donde estaba:
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    } 
    // No permitimos que se crucen elementos entre listas:
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
    <>
      <NavBar />
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
    </>
    
  );
}

export default App;
