<template>
  <div class="outer">
  <div class="card-wrapper" :class="{'invisible': viewBack, 'visible': !viewBack}">
    <section class="front card" :style="{backgroundColor: color}">
      <div class="front">
        <slot name="header"></slot>
        <hr>
        <div class="content">
          <slot name="frontContent"></slot>
        </div>
        <div class="flipper no-select" @click="viewBack = !viewBack">
          <div class="in-flipper">Click / Tap to flip!</div>
        </div>
      </div>
    </section>
  </div>
  <div class="card-wrapper" :class="{'visible': viewBack, 'invisible': !viewBack}">
    <section class="back card" :style="{backgroundColor: color}">
      <div class="back">
        <div class="content">
          <slot name="backContent"></slot>
        </div>
        <div class="flipper no-select" @click="viewBack = !viewBack">
          <div class="in-flipper">Click / Tap to flip!</div>
        </div>
      </div>
    </section>
  </div>
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
  .outer {
    max-width: 500px;
    margin: 24px auto;
    position: relative;
  }
  .card-wrapper {
    width: 100%;
    perspective: 500px;
    position: absolute;
  }
  .card-wrapper.visible {
    z-index: 2;
  }
  .card-wrapper.invisible {
    z-index: 1;
  }
  .card {
    min-height: 20rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border-radius: 2px;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    width: 100%;
    margin: 0;
  }
  .card.front {
    float: left;
  }
  .card.back {
    float: right;
  }
  .card-wrapper.visible .card.front {
    animation: flip-front-in 0.35s forwards;
    animation-timing-function: ease;
  }
  .card-wrapper.invisible .card.front {
    animation: flip-front-out 0.35s forwards;
    animation-timing-function: ease;
  }
  .card-wrapper.invisible .card.back {
    animation: flip-back-out 0.35s forwards;
    animation-timing-function: ease;
  }
  .card-wrapper.visible .card.back {
    animation: flip-back-in 0.35s forwards;
    animation-timing-function: ease;
  }
  .front > hr {
    height: 1px;
    border: none;
    background-color: rgba(0,0,0,0.3);
    margin: 0;
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

  @keyframes flip-front-out {
    0% {
      transform: rotateX(0deg);
    }
    50% {
      transform: rotateX(90deg);
    }
    100% {
      transform: rotateX(90deg);
    }
  }

  @keyframes flip-front-in {
    0% {
      transform: rotateX(90deg);
    }
    50% {
      transform: rotateX(90deg);
    }
    100% {
      transform: rotateX(0deg);
    }
  }

  @keyframes flip-back-in {
    0% {
      transform: rotateX(-90deg);
    }
    50% {
      transform: rotateX(-90deg);
    }
    100% {
      transform: rotateX(0deg);
    }
  }

  @keyframes flip-back-out {
    0% {
      transform: rotateX(0deg);
    }
    50% {
      transform: rotateX(-90deg);
    }
    100% {
      transform: rotateX(-90deg);
    }
  }
</style>
