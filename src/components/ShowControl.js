import React from 'react'

export const ShowControl = props => {
    return (
        <div>
            {
                props.showmarked 
                ? <i 
                className="fas fa-chevron-down"></i>
                : <i className="fas fa-chevron-right"></i>
            }
            <span>Mostrar elementos marcados</span>
        </div>
    )
}
