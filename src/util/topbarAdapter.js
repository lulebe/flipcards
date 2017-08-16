let tbListener = null
let pListener = null

export function bindToTopbar (o) {
  tbListener = o
  return {
    unbind () { tbListener = null },
    backPressed () { pListener && pListener.backPressed && pListener.backPressed() },
    buttonPressed (btnId) { pListener && pListener.buttonPressed && pListener.buttonPressed(btnId) }
  }
}

export function bindToPage (o) {
  pListener = o
  return {
    unbind () { pListener = null },
    setItems (items) { tbListener && tbListener.items(items) },
    setBackEnabled (enabled) { tbListener && tbListener.backEnabled(enabled) }
  }
}

// topbar binding
/* {items(array), backEnabled(bool)} => {unbind(), backPressed(), buttonPressed(id)} */
// page binding
/* {backPressed(), buttonPressed(id)} => {unbind(), setItems(array), setBackEnabled(bool)} */
