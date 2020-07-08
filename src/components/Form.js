import React, { useState, useEffect } from 'react'
import {db} from '../firebase'
import './form.css'

export const Form = props => {
    const initialElement = {
        name: '',
        price: '',
        marked: false,
        quantity: 1
    }
    const [element, setElement] = useState(initialElement)

    const handleSubmit = async e => {
        e.preventDefault()
        if (props.currentId === '') { //crear nuevo elemento
            await db.collection('shoppingElements').doc().set(element)
        } else { // Editar elemento
            await db.collection('shoppingElements').doc(props.currentId).update(element)
        }
        
        props.setCurrentId('')
        setElement(initialElement)
        props.setShowForm(false)
    }

    const handleChange = e => {
        setElement({...element, [e.target.name]: e.target.value})
    }

    const getElement = async id => {
        const doc = await db.collection('shoppingElements').doc(id).get()
        setElement({...doc.data()})
    }

    const handleClose = () => {
        props.setCurrentId('');
        props.setShowForm(false)
    }

    useEffect(() => {
        if (props.currentId === '') {
            setElement({...initialElement})
        } else {
            getElement(props.currentId)
        }
        
    }, [props.currentId])

    return (
        <form onSubmit={handleSubmit}>
             <i className="fas fa-times" onClick={handleClose} ></i>
            <div className="form-content">
                <input 
                    id="name"
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={element.name}
                    placeholder="Nombre ..."
                    className="form-control"
                    autoFocus
                />
                <div className="down">
                    <input 
                        id="price"
                        type="number"
                        step="0.01"
                        name="price"
                        className="form-control"
                        onChange={handleChange}
                        value={element.price}
                        placeholder="Precio ..."
                    />
                    <input 
                        type="submit" 
                        value="Guardar" 
                        id="save"
                        className="btn btn-primary"
                    />
                </div>
            </div>
            
            
        </form>
    )
}
