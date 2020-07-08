import React from 'react'
import './total.css'

export const Total = props => {

    return (
        <div className="total">
            <p>Total: Bs {Intl.NumberFormat().format(props.total.toFixed(2))}</p>
        </div>
    )
}
