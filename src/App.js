import React, { useState, useEffect } from 'react';
import {Search} from './components/Search'
import {List} from './components/List'
import {ShowControl} from './components/ShowControl'
import {Total} from './components/Total'
import {Form} from './components/Form'
import {AddButton} from './components/AddButton'
import {db} from './firebase'

function App() {

  const [elements, setElements] = useState([])

  const getElements = () => {
    db.collection('shoppingElements').onSnapshot(querySnapshot => {
      const docs = []  
      querySnapshot.forEach (doc => {
        docs.push({...doc.data(), id: doc.id})
      })
      setElements(docs)
      
    })  
  } 

  const toggleMarked = async id => {
    const res = await db.collection('shoppingElements').doc(id).get()
    const data = res.data()
    await db.collection('shoppingElements').doc(id).update({...data, marked: !data.marked})
  }

  useEffect(() => {
    getElements()
  }, [])
  
  return (
    <>
      <div className="container">
        <Search />
        <List 
          elements={elements} 
          marked={false} 
          toggleMarked={toggleMarked}
        />
        <ShowControl />
        <List 
          elements={elements} 
          marked={true} 
          toggleMarked={toggleMarked}
        />
        <Total />
      </div>
      <Form />
      <AddButton />
    </>
  );
}

export default App;
