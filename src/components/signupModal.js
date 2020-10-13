import React from 'react'
import styled from 'styled-components'
import { auth } from '../firebase'
import firebase from 'firebase/app'

const SignupModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .4);
 
 .modal-main {
   position: fixed;
   background: white;
   width: 80%;
   height: auto;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%)
 }
`

export default function SignupModal({ handleClose, showSignup}) {
  function EmailSignup() {

  }

  function GoogleSignUp() {
    var provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
    handleClose()
  }
  return (
    <>
      { showSignup && (
        <SignupModalStyled onClick={handleClose}>
          <div className="modal-main" onClick={(e) => e.stopPropagation()}>
            <h3>Registro</h3>
            <button onClick={handleClose} >cerrar</button>
            <input type="text" placeholder="email"/>
            <input type="password" placeholder="password"/>
            <input type="password" placeholder="prepite el password"/>
            <button onClick={EmailSignup} >Registrarse con email</button>
            <button onClick={GoogleSignUp} >Ristrarse con Google</button>
          </div>
        </SignupModalStyled>
      ) }
    </>
  )
}
