<template>
  <div>
    <Topbar loggedIn="true"></Topbar>
    <div style="position: relative">
      <transition :name="transitionName">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
  import cTopbar from '@/components/Topbar'

  export default {
    components: {
      'Topbar': cTopbar
    },
    data () {
      return {
        transitionName: 'slide-right'
      }
    },
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth >= fromDepth ? 'slide-right' : 'slide-left'
      }
    }
  }
</script>
<style lang="css">
  .slide-right-enter-active, .slide-right-leave-active {
    transition: transform 0.3s, opacity 0.3s;
  }
  .slide-right-enter {
    transform: translateX(20%);
    opacity: 0;
  }
  .slide-right-leave-to {
    opacity: 0;
  }
  .slide-left-enter-active, .slide-left-leave-active {
    transition: transform 0.3s, opacity 0.3s;
  }
  .slide-left-enter {
    transform: translateX(-20%);
    opacity: 0;
  }
  .slide-left-leave-to {
    opacity: 0;
  }
  .page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: white;
    min-height: calc(100vh - 64px);
    max-width: 960px;
    margin: 0 auto;
  }
</style>
