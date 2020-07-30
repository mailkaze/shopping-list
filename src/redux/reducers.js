export default function reducer(state, action) {
  switch(action.type) {
    case 'SET_ELEMENTS':
      return {...state, elements: action.payload}
    case 'SET_SHOW_MARKED':
      return {...state, showMarked: !state.showMarked}
    case 'SET_CURRENT_ID':
      return {...state, currentId: action.payload}
    case 'SET_SHOW_FORM':
      return {...state, showForm: !state.showForm}
    case 'SET_SEARCH':
      return {...state, search: action.payload}
    case 'EDIT_ELEMENT':
      const tempElements = state.elements
      .map(e => e.id === action.payload.id ? action.payload : e)
      return {...state, elements: tempElements}
    default:
      return state
  }
}