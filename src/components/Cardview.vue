<template>
  <div class="card-wrapper">
    <section class="card" :class="{'back-visible': viewBack}" :style="{backgroundColor: color}">
      <div class="front">
        <h1>{{title}}</h1>
        <hr>
        <div class="content">
          {{front}}
        </div>
        <div class="flipper" @click="viewBack = !viewBack">
          <div class="in-flipper">Click / Tap to flip!</div>
        </div>
      </div>
      <div class="back">
        <div class="content">
          {{back}}
        </div>
        <div class="flipper" @click="viewBack = !viewBack">
          <div class="in-flipper">Click / Tap to flip!</div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    props: ['title', 'color', 'front', 'back'],
    data () {
      return {
        viewBack: false
      }
    }
  }
</script>
<style lang="css" scoped>
  .card-wrapper {
    perspective: 500px;
    max-width: 500px;
    margin: 24px auto;
  }
  .card {
    min-height: 15rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border-radius: 2px;
    transform-style: preserve-3d;
    transition: transform 0.4s ease;
    position: relative;
  }
  .card.back-visible {
    transform: rotateX(180deg);
    box-shadow: 0 -4px 12px rgba(0,0,0,0.3);
  }
  .front, .back {
    backface-visibility: hidden;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .back {
    transform: rotateX(180deg);
  }
  .front > h1 {
    margin: 16px 16px;
  }
  .front > hr {
    height: 1px;
    border: none;
    background-color: rgba(0,0,0,0.3);
  }
  .content {
    overflow-y: auto;
    padding: 16px;
  }
  .flipper {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 3rem;
    cursor: pointer;
  }
  .flipper > .in-flipper {
    opacity: 0;
    line-height: 3rem;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 100;
    color: white;
    text-transform: uppercase;
  }
  .flipper:hover {
    background: rgba(0,0,0,0.15);
  }
  .flipper:hover > .in-flipper {
    opacity: 1;
  }
  .flipper:active {
    background: rgba(0,0,0,0.3);
  }
</style>
