<template>
  <span class="md-tooltip" :class="classes" :style="style">
    <slot></slot>
  </span>
</template>
<script>
  const transitionEndEventName = (function () {
    const el = document.createElement('span')
    const transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    }
    for (let transition in transitions) {
      if (el.style[transition] !== undefined) {
        return transitions[transition]
      }
    }
  })()

  export default {
    name: 'md-tooltip',
    props: {
      mdDirection: {
        type: String,
        default: 'bottom'
      },
      mdDelay: {
        type: String,
        default: '0'
      }
    },
    data: () => ({
      active: false,
      parentClass: null,
      transitionOff: false,
      topPosition: false,
      leftPosition: false
    }),
    computed: {
      classes () {
        const cssClasses = {
          'md-active': this.active,
          'md-transition-off': this.transitionOff,
          'md-tooltip-top': this.mdDirection === 'top',
          'md-tooltip-right': this.mdDirection === 'right',
          'md-tooltip-bottom': this.mdDirection === 'bottom',
          'md-tooltip-left': this.mdDirection === 'left'
        }
        if (this.parentClass) {
          cssClasses[this.parentClass] = true
        }
        return cssClasses
      },
      style () {
        return {
          'transition-delay': this.mdDelay + 'ms',
          top: this.topPosition + 'px',
          left: this.leftPosition + 'px'
        }
      }
    },
    watch: {
      mdDirection () {
        this.calculateTooltipPosition()
      }
    },
    methods: {
      removeTooltips () {
        if (this.tooltipElement.parentNode) {
          this.tooltipElement.removeEventListener(transitionEndEventName, this.removeTooltips)
          this.tooltipElement.parentNode.removeChild(this.tooltipElement)
        }
      },
      calculateTooltipPosition () {
        let position = this.parentElement.getBoundingClientRect()
        let cssPosition = {}
        switch (this.mdDirection) {
          case 'top':
            cssPosition.top = position.top - this.$el.offsetHeight
            cssPosition.left = position.left + position.width / 2
            break
          case 'right':
            cssPosition.top = position.top
            cssPosition.left = position.left + position.width
            break
          case 'bottom':
            cssPosition.top = position.bottom
            cssPosition.left = position.left + position.width / 2
            break
          case 'left':
            cssPosition.top = position.top
            cssPosition.left = position.left - this.$el.offsetWidth
            break
          default:
            console.warn(`Invalid ${this.mdDirection} option to md-direction option`)
        }
        this.topPosition = cssPosition.top
        this.leftPosition = cssPosition.left
      },
      generateTooltipClasses () {
        let classes = []
        this.parentElement.classList.forEach((cssClass) => {
          if (cssClass.indexOf('md-') >= 0 && cssClass !== 'md-active') {
            classes.push(cssClass + '-tooltip')
          }
        })
        this.parentClass = classes.join(' ')
      },
      open () {
        this.removeTooltips()
        this.$nextTick(() => {
          document.body.appendChild(this.tooltipElement)
          getComputedStyle(this.tooltipElement).top
          this.transitionOff = true
          this.generateTooltipClasses()
          this.calculateTooltipPosition()
          window.setTimeout(() => {
            this.transitionOff = false
            this.active = true
          }, 10)
        })
      },
      close () {
        this.active = false
        this.tooltipElement.removeEventListener(transitionEndEventName, this.removeTooltips)
        this.tooltipElement.addEventListener(transitionEndEventName, this.removeTooltips)
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.tooltipElement = this.$el
        this.parentElement = this.tooltipElement.parentNode
        this.$el.parentNode.removeChild(this.$el)
        this.parentElement.addEventListener('mouseenter', this.open)
        this.parentElement.addEventListener('focus', this.open)
        this.parentElement.addEventListener('mouseleave', this.close)
        this.parentElement.addEventListener('blur', this.close)
      })
    },
    beforeDestroy () {
      this.active = false
      this.removeTooltips()
      if (this.parentElement) {
        this.parentElement.removeEventListener('mouseenter', this.open)
        this.parentElement.removeEventListener('focus', this.open)
        this.parentElement.removeEventListener('mouseleave', this.close)
        this.parentElement.removeEventListener('blur', this.close)
      }
    }
  }
</script>
<style lang="css">
.md-tooltip {
  height: 20px;
  padding: 9px 10px 10px 10px;
  position: fixed;
  z-index: 200;
  pointer-events: none;
  background-color: rgba(97, 97, 97, .87);
  border-radius: 2px;
  opacity: 0;
  transform-origin: center top;
  transition: opacity 0.3s, transform 0.3s;
  transition-duration: .3s;
  transition-delay: 0s;
  color: #fff;
  font-size: 0.7rem;
  line-height: 2px;
  text-transform: none;
  white-space: nowrap;
}
.md-tooltip.md-active {
  opacity: 1;
  transition: opacity 0.3s, transform 0.3s;
}

.md-tooltip:not(.md-active) {
  transition-delay: 0s !important;
}

.md-tooltip.md-transition-off {
  transition: none !important;
}

.md-tooltip.md-tooltip-top {
  margin-top: -14px;
  transform: translate(-50%, 8px);
}
.md-tooltip.md-tooltip-top.md-active {
  transform: translate(-50%, 0);
}

.md-tooltip.md-tooltip-right {
  margin-left: 14px;
  transform: translate(-8px, 50%);
}
.md-tooltip.md-tooltip-right.md-active {
  transform: translate(0, 50%);
}

.md-tooltip.md-tooltip-bottom {
  margin-top: 14px;
  transform: translate(-50%, -8px);
}
.md-tooltip.md-tooltip-bottom.md-active {
  transform: translate(-50%, 0);
}

.md-tooltip.md-tooltip-left {
  margin-left: -14px;
  transform: translate(8px, 50%);
}
.md-tooltip.md-tooltip-left.md-active {
  transform: translate(0, 50%);
}
</style>
