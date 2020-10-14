import React, { useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons'
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
   transform: translate(-50%, -50%);
   margin-top: 10px;
   border-radius: 8px;
   box-shadow: 1px 1px 2px rgba(0, 0, 0, .3);
   padding: 12px 20px;
 }
 form {
    margin: auto;
    display: flex;
    flex-direction: column;
    width: 80%;
  }
  .equis {
    float: right;
    cursor: pointer;
  }
  h5 {
    margin: 20px 0 0 0;
  }
  input {
    height: 1.8em;
    margin-top: 7px;
    border-style: none;
    border: 1px solid grey;
    border-radius: 3px;
    padding: 8px 14px;
  }
  button {
    border-style: none;
    background: #0097e6;
    color: white;
    padding: 10px 0;
    margin-top: 7px;
    border-radius: 3px;
    cursor: pointer;
  }
`

export default function SignupModal({ handleClose, showSignup}) {
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState(false)

  function onChange(e) {
    switch (e.target.id) {
      case 'email':
        setEmail(e.target.value)
        break
      case 'password1':
        setPassword1(e.target.value)
        break
      case 'password2':
        setPassword2(e.target.value)
        break
      default: break
    }
  }

  function emailSignup(e) {
    e.preventDefault()
    if (password1 === password2) {
    auth.createUserWithEmailAndPassword(email, password1)
    .then( async userCredential => {
      setError(false) 
      setEmail('')
      setPassword1('')
      setPassword2('')
      handleClose()
    })
    } else {
      setError(true)
    }
  }

  function googleSignUp() {
    var provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
    handleClose()
  }
  return (
    <>
      { showSignup && (
        <SignupModalStyled onClick={handleClose}>
          <div className="modal-main" onClick={(e) => e.stopPropagation()}>
          <FontAwesomeIcon className='equis' icon={faTimes} onClick={handleClose} />
          <form onSubmit={emailSignup} >
            <h5>Regístrate con tu email:</h5>
              <input 
                type="email" 
                name="email" 
                id="email" 
                placeholder="E-mail ..." 
                onChange={onChange}
                value={email}
                required 
              />
              <input 
                type="password" 
                name="password1" 
                id="password1" 
                placeholder="Password ..." 
                onChange={onChange}
                value={password1}
                required 
              />
              <input 
                type="password" 
                name="password2" 
                id="password2" 
                placeholder="Repeat your password ..." 
                onChange={onChange}
                value={password2}
                required 
              />
              <button type="submit">Regístrate con tu Email</button>
              {
              error && <p>*debes escribir el mismo password en ambos campos.</p>
            }
            <h5>O también ...</h5>
            <button onClick={googleSignUp} ><FontAwesomeIcon icon={faGoogle} />   Regístrate con Google</button>
            <button  ><FontAwesomeIcon icon={faFacebookF} />   Regístrate con Facebook</button>

            </form>
          </div>
        </SignupModalStyled>
      ) }
    </>
  )
}
