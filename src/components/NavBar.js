import React from 'react'
import styled from 'styled-components'

const NavbarStyled = styled.nav`
  display: flex;
  background: #fca311;
  height: 3em;
  width: 100%;
  box-shadow: 0 3px 3px rgba(0,0,0,.2); 
  justify-content: space-between;
  align-items: center;
  ul {
    list-style: none;
    margin: 0;
  }
  li {
    display: inline-block;
    margin-right: 8px;
  }
  .logo {
    margin-left: 8px;
  }
`

export const NavBar = () => {
  return (
    <NavbarStyled>
      <span className='logo'>logo</span>
      <ul>
        <li>Sign in</li>
        <li>Log in</li>
        <li>log out</li>
      </ul>
    </NavbarStyled>
  )
}
