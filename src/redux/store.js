import { createStore } from 'redux'
import reducer from './reducers'

const initialState = {
  elements: [],
  columns: {
    'no-marked': {
      id: 'no-marked',
      title: 'unchecked',
      elementIds: []
    },
    'marked': {
      id: 'marked',
      title: 'checked',
      elementIds: []
    }
  },
  search: '',
  currentId: '',
  showMarked: true,
  showForm: false,
  user: null,
}

export default createStore(reducer, initialState)