import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { auth } from '../firebase'
import firebase from 'firebase/app'

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
  const user = useSelector(state => state.user)

  function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  
  function signOut() {
    auth.signOut()
  }

  return (
    <NavbarStyled>
      <img className='logo' src="/canasta.png" alt=""/>
      <ul>
        { !user && <li onClick={signIn}>Sign in</li> }
        { !user && <li>Log in</li> }
        { user && <li onClick={signOut}>log out</li> }
        <li><img className='profile' src={ user ? user.photoURL : '/profile_placeholder.png' } alt=""/></li>
      </ul>
    </NavbarStyled>
  )
}
