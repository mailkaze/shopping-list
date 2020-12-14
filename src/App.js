import React, { useState, useEffect } from "react";
import { List } from "./components/List";
import { ShowControl } from "./components/ShowControl";
import { Total } from "./components/Total";
import { Form } from "./components/Form";
import { AddButton } from "./components/AddButton";
import { db, auth } from "./firebase";
import { useSelector, useDispatch} from 'react-redux'
import { setElements, setColumns, setUser } from './redux/actions'
import { DragDropContext} from 'react-beautiful-dnd'
import { NavBar } from "./components/NavBar";

function App() {
  const elements = useSelector(state => state.elements)
  const showMarked = useSelector(state => state.showMarked)
  const showForm = useSelector(state => state.showForm)
  const columns = useSelector(state => state.columns)
  const user = useSelector(state => state.user)
  const [colsReceived, setColsReceived] = useState(false)
  const dispatch = useDispatch()

  const getElements = () => {
    // Sólo se trae los elementos del usuario actual:
    db.collection("shoppingElements").where("uid", "==", user.uid)
    .onSnapshot((querySnapshot) => {
      const docs = []; 
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      if (docs.length > 0) {
        dispatch(setElements(docs))
      }
    })
  }

  async function createColumns() {
    // Crea el documento de columns para un usuario nuevo. Tiene algunas líneas extra para
    // ayudar a recrearlas despues de un error en desarrollo
    const elementIdsNoMarked = elements.filter(e => !e.marked).map(e => e.id)
    const elementIdsMarked = elements.filter(e => e.marked).map(e => e.id)
    console.log('Estos elementos entrarán en columns:', elements)
    const columnNoMarked = {...columns["no-marked"], elementIds: elementIdsNoMarked}
    const columnMarked = {...columns["marked"], elementIds: elementIdsMarked}
    const newColumns = {...columns, "no-marked": columnNoMarked, "marked": columnMarked}
    dispatch(setColumns(newColumns))
    await db.collection('columns').doc(user.uid).set(newColumns)
  }

  async function setListsOrder() {
    // si no recibe nada en 2,5 segundos activa la funcionalidad de updateColumns
    // para poder trabajar offline
    setTimeout(() => { 
      setColsReceived(true)
    }, 2500)
    // traemos el orden de las listas de internet si se puede:
    const colsFromDB = await db.collection('columns').doc(user.uid).get()
    
    const tempColumns = colsFromDB.data()
    if (tempColumns) {
      dispatch(setColumns(tempColumns))
    } else {
      await createColumns()
    }
    //recibió las columnas del servidor y activa la funcionalidad de uptadeColumns
    setColsReceived(true) 
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

    const newColumns = {
      'no-marked': {...columns['no-marked'], elementIds: colNoMarked},
      'marked': {...columns['marked'], elementIds: colMarked},
    }
    // actualizamos el state columns
    dispatch(setColumns(newColumns))
  }

  function authStateListener(){
    auth.onAuthStateChanged(function(userData) {
      dispatch(setUser(userData))
    })
  }
  
  useEffect(() => {
    updateColumns()
  }, [elements])

  useEffect(() => {
    // Cuando cambia 'columns' actualizamos su estado a firestore
    if (colsReceived) {
      db.collection('columns').doc(user.uid).set(columns)
    }
  }, [columns])

  useEffect(() => {
    console.log('user:', user)
    if (user) {
      // Sólo cuando el usuario esté logueado traemos los datos:
      getElements()
      setListsOrder()
    }
  }, [user])

  useEffect(() => {
    // Lo primero que se ejecuta:
    // Activamos el almacenamiento de los datos en cache para esta app
    // y le asignamos una cache de tamaño ilimitado para que no borre cosas:
    db.settings({
      cacheSizeBytes: db.CACHE_SIZE_UNLIMITED
    });
    db.enablePersistence()
    //Activamos el escuchador de cambios en el estado de autorizacion:
    authStateListener()
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
      {
        user ? (
          <DragDropContext onDragEnd={onDragEnd} >
            <div className="container">
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
        )
        : <p className='login-message'>Regístrate para empezar ;)</p>
      }
      <footer> <a href="https://github.com/mailkaze" target="_blank" rel="noopener noreferrer">By mailkaze</a> || v3.4</footer>
    </>
    
  );
}

export default App;
