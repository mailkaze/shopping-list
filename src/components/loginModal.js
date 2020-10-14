import React, { useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons'
import { auth } from '../firebase'

const LoginModalStyled = styled.div`
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
export default function LoginModal({ handleClose, showLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onChange(e) {
    switch (e.target.id) {
      case 'email':
        setEmail(e.target.value)
        break
      case 'password':
        setPassword(e.target.value)
        break
      default: break
    }
  }

  function emailLogin(e) {

  }

  function googleLogin() {

  }

  return (
    <>
      { showLogin && (
        <LoginModalStyled onClick={handleClose}>
          <div className="modal-main" onClick={(e) => e.stopPropagation()}>
              <FontAwesomeIcon className='equis' icon={faTimes} onClick={handleClose} />
              <form onSubmit={emailLogin} >
                <h5>Login with email:</h5>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder="e-Mail ..." 
                  onChange={onChange}
                  value={email}
                  required 
                />
                <input 
                  type="password" 
                  name="password" 
                  id="password1" 
                  placeholder="Password ..." 
                  onChange={onChange}
                  value={password}
                  required 
                />
                <button type="submit">Entra con tu Email</button>
              <h5>Or ...</h5>
              <button onClick={googleLogin} ><FontAwesomeIcon icon={faGoogle} />   Entra con Google</button>
              <button  ><FontAwesomeIcon icon={faFacebookF} />   Entra con Facebook</button>
            </form>
          </div>
        </LoginModalStyled>
      )}
    </>
  )
}