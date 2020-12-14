import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import SignupModal from './signupModal'
import { auth } from '../firebase'
import LoginModal from './loginModal'
import { Search } from './Search'

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
    padding: 0;
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
  const [showSignup, setShowSignup] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [profilePic, setProfilePic] = useState('/profile_placeholder.png')
  const user = useSelector(state => state.user)
  
  function signOut() {
    auth.signOut()
  }

  function toggleSignupModal() {
    setShowSignup(!showSignup)
  }

  function toggleLoginModal() {
    setShowLogin(!showLogin)
  }

    // function setProfilePic() {
    //   if (user) {
    //     if (user.photoURL) {
    //       return user.photoURL
    //     }
    //   }
    //   return '/profile_placeholder.png'
    // }

  useEffect(() => {
    setProfilePic('/profile_placeholder.png')
    if (user) {
      if (user.photoURL) {
        setProfilePic(user.photoURL)
      }
    }
    
  }, [user])

  return (
    <NavbarStyled>
      <img className='logo' src="/canasta.png" alt=""/>
      { user && <Search />}
      <SignupModal showSignup={showSignup} handleClose={toggleSignupModal} />
      <LoginModal showLogin={showLogin} handleClose={toggleLoginModal} />
      <ul>
        { !user && <li onClick={toggleSignupModal}>Registrarse</li> }
        { !user && <li onClick={toggleLoginModal}>Entrar</li> }
        { user && <li onClick={signOut}>Salir</li> }
        <li><img className='profile' src={profilePic} alt=""/></li>
      </ul>
    </NavbarStyled>
  )
}
