import React, { useState, useEffect } from "react";
import { Search } from "./components/Search";
import { List } from "./components/List";
import { ShowControl } from "./components/ShowControl";
import { Total } from "./components/Total";
import { Form } from "./components/Form";
import { AddButton } from "./components/AddButton";
import { db } from "./firebase";
import { useSelector, useDispatch} from 'react-redux'
import { setElements, setShowMarked, setTotal } from './redux/actions'

function App() {
  const elements = useSelector(state => state.elements)
  const showMarked = useSelector(state => state.showMarked)
  const currentId = useSelector(state => state.currentId)
  const showForm = useSelector(state => state.showForm)
  const total = useSelector(state => state.total)
  const search = useSelector(state => state.search)
  const dispatch = useDispatch()

  const getElements = () => {
    try {
      db.collection("shoppingElements").onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        dispatch(setElements(docs))
      });
    } catch (error) {
     
      let localElements = localStorage.getItem('shoppingElements')
      if (localElements != null) {
        alert('Error de red, se utilizarán datos locales, puede que no estén actualizados.')
        dispatch(setElements(JSON.parse(localElements)))
      } else {
        alert('Error de red, no se pudo conectar con la base de datos, revise su conexión.')
      }
    }
    
    
  };

  const toggleMarked = async (id) => {
    console.log(id)
    try {
      const res = await db.collection("shoppingElements").doc(id).get();
      const data = res.data();
      await db.collection("shoppingElements").doc(id).update({ ...data, marked: !data.marked });
    } catch (e) {
      console.log('no se pudo cambiar el marcado en la DB, se hará en local')
      let localElements = localStorage.getItem('shoppingElements')
      if (localElements != null) {
        localElements = JSON.parse(localElements)
        const i = localElements.findIndex(e => e.id === id)
        localElements[i].marked = !localElements[i].marked
        localStorage.setItem('shoppingElements', JSON.stringify(localElements))
        dispatch(setElements(localElements))

      }
    }
  };

  const toggleShow = () => {
    dispatch(setShowMarked(!showMarked))
  };

  const deleteElement = async id => {
    await db.collection('shoppingElements').doc(id).delete()
  }

  const updateQuantity = async (num, id) => {
    const doc = await db.collection('shoppingElements').doc(id).get()
    let el = {...doc.data(), quantity: num}
    await db.collection('shoppingElements').doc(id).update(el)
  }

  const calculateTotal = () => {
    let t = 0
    elements
    .filter(e => !e.marked)
    .map(e => t += (parseFloat(e.price) * parseFloat(e.quantity)))
    dispatch(setTotal(t))
  }
  
  useEffect(() => {
    calculateTotal()
    if (elements.length > 0) {
      localStorage.setItem('shoppingElements', JSON.stringify(elements))
    }
  }, [elements])

  useEffect(() => {
    getElements();
  }, []);

  return (
    <>
      <div className="container">
        <Search 
          search={search}
          // setSearch={setSearch}
        />
        <Total total={total}/>
        <List 
          elements={elements} 
          marked={false} 
          toggleMarked={toggleMarked} 
          deleteElement={deleteElement}
          // setCurrentId={setCurrentId}
          // setShowForm={setShowForm}
          updateQuantity={updateQuantity}
          search={search}
        />
        <ShowControl 
          showMarked={showMarked} 
          toggleShow={toggleShow} 
        />
        {showMarked && (
          <List 
            elements={elements} 
            marked={true} 
            toggleMarked={toggleMarked} 
            deleteElement={deleteElement}
            // setCurrentId={setCurrentId}
            // setShowForm={setShowForm}
            updateQuantity={updateQuantity}
            search={search}
          />
        )}
      </div>
      {
        showForm && <Form 
          currentId={currentId} 
          // setCurrentId={setCurrentId}
          // setShowForm={setShowForm} 
        />
      }
      {
        !showForm && <AddButton
          // setShowForm={setShowForm}
        />
      }
    </>
  );
}

export default App;
