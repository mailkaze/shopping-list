import React, {useState} from 'react'
import {db} from '../firebase'

export const Form = props => {

    const [element, setElement] = useState({})

    const handleSubmit = async e => {
        e.preventDefault()
        console.log('enviar:', element)
        await db.collection('shoppingElements').doc().set({...element, marked: false})
    }

    const handleChange = e => {
        setElement({...element, [e.target.name]: e.target.value})
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                name="name"
                onChange={handleChange}
            />
            <input 
                type="number"
                name="price"
                onChange={handleChange}
            />
            <input type="submit" value="Save"/>
        </form>
    )
}
