export function setElements(elements) {
  return {
    type: 'SET_ELEMENTS',
    payload: elements
  }
}

export function setShowMarked(showMarked) {
  return {
    type: 'SET_SHOW_MARKED',
    payload: showMarked
  }
}
export function setCurrentId(currentId) {
  return {
    type: 'SET_CURRENT_ID',
    payload: currentId
  }
}

export function setShowForm(showForm) {
  return {
    type: 'SET_SHOW_FORM',
    payload: showForm
  }
}

export function setTotal(total) {
  return {
    type: 'SET_TOTAL',
    payload: total
  }
}

export function setSearch(search) {
  return {
    type: 'SET_SEARCH',
    payload: search
  }
}
