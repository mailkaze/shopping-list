import React, { useState, useEffect } from "react";
import { Search } from "./components/Search";
import { List } from "./components/List";
import { ShowControl } from "./components/ShowControl";
import { Total } from "./components/Total";
import { Form } from "./components/Form";
import { AddButton } from "./components/AddButton";
import { db } from "./firebase";

function App() {
  const [elements, setElements] = useState([]);
  const [showMarked, setShowMarked] = useState(true);
  const [currentId, setCurrentId] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [total, setTotal] = useState(0)


  const getElements = () => {
    db.collection("shoppingElements").onSnapshot((querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setElements(docs);
    });
    
  };

  const toggleMarked = async (id) => {
    const res = await db.collection("shoppingElements").doc(id).get();
    const data = res.data();
    await db
      .collection("shoppingElements")
      .doc(id)
      .update({ ...data, marked: !data.marked });
  };

  const toggleShow = () => {
    setShowMarked(!showMarked);
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
    console.log(t)
    setTotal(t)
  }

  useEffect(() => {
    getElements();
  }, []);

  return (
    <>
      <div className="container">
        <Search />
        <List 
          elements={elements} 
          marked={false} 
          toggleMarked={toggleMarked} 
          deleteElement={deleteElement}
          setCurrentId={setCurrentId}
          setShowForm={setShowForm}
          updateQuantity={updateQuantity}
          calculateTotal={calculateTotal}
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
            setCurrentId={setCurrentId}
            setShowForm={setShowForm}
            updateQuantity={updateQuantity}
            calculateTotal={calculateTotal}
          />
        )}
        <Total total={total} calculateTotal={calculateTotal} />
      </div>
      {
        showForm && <Form 
          currentId={currentId} 
          setCurrentId={setCurrentId}
          setShowForm={setShowForm} 
        />
      }
      {
        !showForm && <AddButton setShowForm={setShowForm}/>
      }
    </>
  );
}

export default App;
