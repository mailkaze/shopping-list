import { createStore } from 'redux'
import reducer from './reducers'

const initialState = {
  elements: [],
  search: '',
  currentId: '',
  showMarked: true,
  showForm: false,
}

export default createStore(reducer, initialState)