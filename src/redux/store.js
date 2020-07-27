import { createStore } from 'redux'
import reducer from './reducers'

const initialState = {
  elements: [],
  showMarked: true,
  currentId: '',
  showForm: false,
  total: 0,
  search: '',
}

export default createStore(reducer, initialState)