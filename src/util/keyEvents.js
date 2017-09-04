import Vue from 'vue'

const keyEventHub = new Vue()

export default keyEventHub

window.addEventListener('keydown', event => {
  if ((event.which === 83 && (navigator.platform.match('Mac') ? event.metaKey : event.ctrlKey)) || event.which === 19) {
    keyEventHub.$emit('save')
    event.preventDefault()
    return false
  } else if (event.which === 38 || event.which === 40) {
    keyEventHub.$emit('flip')
    event.preventDefault()
    return false
  } else if (event.which === 69 && (navigator.platform.match('Mac') ? event.metaKey : event.ctrlKey)) {
    keyEventHub.$emit('edit')
    event.preventDefault()
    return false
  } else if (event.which === 37) {
    keyEventHub.$emit('prev')
    event.preventDefault()
    return false
  } else if (event.which === 39) {
    keyEventHub.$emit('next')
    event.preventDefault()
    return false
  } else {
    return true
  }
})
