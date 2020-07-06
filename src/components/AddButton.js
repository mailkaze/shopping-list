import React from 'react'
import './addButton.css'

export const AddButton = props => {
    return (
        <i 
            className="fas fa-plus" 
            onClick={() => props.setShowForm(true)}
        ></i>
    )
}
