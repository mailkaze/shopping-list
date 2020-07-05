import React from 'react'

const styles = {
    "borderRadius": "50%",
    "padding": "14px",
    "fontSize": "1.2em",
    "background": "green",
    "color": "white",
    "position": "absolute",
    "bottom": "20px",
    "right": "20px",
    "boxShadow": "1.5px 1.5px 3px grey"
}

export const AddButton = () => {
    return (
        <i className="fas fa-plus" style={styles}></i>
    )
}
