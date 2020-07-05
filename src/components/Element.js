import React from 'react'

export const Element = props => {

    const handleChange = id => {
        props.toggleMarked(id)
    }

    return (
        <div className="card">
            <input 
                type="checkbox"
                checked={props.element.marked}
                onChange={() => handleChange(props.element.id)}
            />
            <p>{props.element.name}</p>
            <p>Bs.{Intl.NumberFormat().format(props.element.price)}</p>
        </div>
    )
}
