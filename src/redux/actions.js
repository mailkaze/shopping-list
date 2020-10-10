export function setElements(elements) {
  return {
    type: 'SET_ELEMENTS',
    payload: elements
  }
}

export function setShowMarked() {
  return {
    type: 'SET_SHOW_MARKED',
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
  }
}

export function setSearch(search) {
  return {
    type: 'SET_SEARCH',
    payload: search
  }
}

export function editElement(element) {
  return {
    type: 'EDIT_ELEMENT',
    payload: element
  }
}

export function deleteElement(id) {
  return {
    type: 'DELETE_ELEMENT',
    payload: id
  }
}

export function setColumns(columns) {
  return {
    type: 'SET_COLUMNS',
    payload: columns
  }
}

export function setUser(user) {
  return {
    type: 'SET_USER',
    payload: user
  }
}
