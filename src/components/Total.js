import React from 'react'
import './total.css'

export const Total = props => {

    return (
        <div className="total">
            <p>Total: Bs {props.total}</p>
        </div>
    )
}
