import Vue from 'vue'

const keyEventHub = new Vue()

export default keyEventHub

window.addEventListener('keyup', event => {
  if ((event.which === 115 && event.ctrlKey) || event.which === 19) {
    keyEventHub.$emit('save')
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
