import React, { useEffect } from "react";
import { Search } from "./components/Search";
import { List } from "./components/List";
import { ShowControl } from "./components/ShowControl";
import { Total } from "./components/Total";
import { Form } from "./components/Form";
import { AddButton } from "./components/AddButton";
import { db } from "./firebase";
import { useSelector, useDispatch} from 'react-redux'
import { setElements } from './redux/actions'

function App() {
  const elements = useSelector(state => state.elements)
  const showMarked = useSelector(state => state.showMarked)
  const showForm = useSelector(state => state.showForm)
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
      let localElements = localStorage.getItem('mailkaze-shopping-list')
      if (localElements != null) {
        alert('Error de red, se utilizarán datos locales, puede que no estén actualizados.')
        dispatch(setElements(JSON.parse(localElements)))
      } else {
        alert('Error de red, no se pudo conectar con la base de datos, revise su conexión.')
      }
    }
  };
  
  useEffect(() => {
    localStorage.setItem('mailkaze-shopping-list', JSON.stringify(elements))
  }, [elements])

  useEffect(() => {
    getElements();
  }, []);

  return (
    <>
      <div className="container">
        <Search />
        <Total />
        <List marked={false} />
        <ShowControl />
        { showMarked && <List marked={true} /> }
      </div>
      { showForm && <Form /> }
      { !showForm && <AddButton /> }
    </>
  );
}

export default App;
