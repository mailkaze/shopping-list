export default function reducer(state, action) {
  switch(action.type) {
    case 'SET_ELEMENTS':
      return {...state, elements: action.payload}
    case 'SET_SHOW_MARKED':
      return {...state, showMarked: action.payload}
    case 'SET_CURRENT_ID':
      return {...state, currentId: action.payload}
    case 'SET_SHOW_FORM':
      return {...state, showForm: action.payload}
    case 'SET_TOTAL':
      return {...state, total: action.payload}
    case 'SET_SEARCH':
      return {...state, search: action.payload}
    default:
      return state
  }
}