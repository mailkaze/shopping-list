import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

const TotalStyled = styled.div`
  p {
    font-weight: 700;
    margin: 10px 0 0;
    line-height: initial;
    font-size: 1.4em;
  }
`

export const Total = () => {
  const elements = useSelector(state => state.elements)

  const calculateTotal = () => {
    let t = 0
    if (elements.length > 0) {
      elements
      .filter(e => !e.marked)
      .map(e => t += (parseFloat(e.price) * parseFloat(e.quantity)))
    }
    return t
  }

    
  useEffect(() => {
    calculateTotal()
  }, [elements])

  return (
    <TotalStyled className="total">
      <p>Total: Bs {Intl.NumberFormat().format(calculateTotal().toFixed(2))}</p>
    </TotalStyled>
  )
}
