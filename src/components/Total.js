import React, {useEffect} from 'react'

export const Total = props => {
    useEffect(() => {
        props.calculateTotal()
    },[])
    return (
        <div>
            <p>Total: Bs.{props.total}</p>
        </div>
    )
}
