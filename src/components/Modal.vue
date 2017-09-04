<template>
  <transition name="modal">
    <div class="background-fill" @click="$emit('cancel')" v-if="open">
      <div class="modal" @click.stop="">
        <h3>{{title}}</h3>
        <slot></slot>
        <div class="buttons">
          <button class="button" @click="$emit('cancel')">{{cancelText}}</button>
          <button class="button acc" @click="$emit('ok')">{{okText}}</button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    props: [
      'open',
      'title',
      'cancelText',
      'okText'
    ]
  }
</script>
<style lang="css" scoped>
  .background-fill {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.4);
    z-index: 100;
  }
  .modal {
    max-width: 500px;
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 80px;
    max-height: 60%;
    overflow-y: auto;
    background: #f3f3f3;
    box-shadow: 0 10px 50px 10px rgba(0,0,0,0.5);
    border-radius: 4px;
    padding: 16px;
  }
  .buttons {
    border-top: 1px solid lightgrey;
    margin-top: 8px;
    padding-top: 8px;
    text-align: right;
  }
  .buttons > button {
    margin-top: 8px;
    margin-left: 8px;
  }
  .modal-enter-active, .modal-leave-active {
    transition: transform 0.3s, opacity 0.3s;
    transform-origin: 50% 0%;
  }
  .modal-enter, .modal-leave-to {
    transform: scale(1.3);
    opacity: 0;
  }
</style>
