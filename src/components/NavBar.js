import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import SignupModal from './signupModal'
import { auth } from '../firebase'

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
    cursor: pointer;
  }
  .logo {
    margin-left: 8px;
    height: 2.8em;
  }
  .profile {
    height: 2.2em;
    border-radius: 50%;
    cursor: auto;
  }
`

export const NavBar = () => {
  const [showSignup, setshowSignup] = useState(false)
  const user = useSelector(state => state.user)
  
  function signOut() {
    auth.signOut()
  }

  function toggleSignupModal() {
    setshowSignup(!showSignup)
  }

  return (
    <NavbarStyled>
      <img className='logo' src="/canasta.png" alt=""/>
      <SignupModal showSignup={showSignup} handleClose={toggleSignupModal} />
      <ul>
        { !user && <li onClick={toggleSignupModal}>Sign in</li> }
        { !user && <li>Log in</li> }
        { user && <li onClick={signOut}>log out</li> }
        <li><img className='profile' src={ user ? user.photoURL : '/profile_placeholder.png' } alt=""/></li>
      </ul>
    </NavbarStyled>
  )
}
