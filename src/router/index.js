import Vue from 'vue'
import Router from 'vue-router'

import store from '@/state/store'
import {USER_STATES} from '@/state/user'

import Frontpage from '@/components/Frontpage'
import Signin from '@/components/Signin'
import Signup from '@/components/Signup'
import Home from '@/components/Home'
// import Deck from '@/components/Deck'
// import Card from '@/components/Card'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Frontpage',
      component: Frontpage,
      meta: {needAuth: false, noAuthRedirect: true}
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      meta: {needAuth: false}
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin,
      meta: {needAuth: false}
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {needAuth: true}
    } // ,
    /* {
      path: '/deck/:deckId',
      name: 'deck',
      props: true,
      component: Deck,
      meta: {needAuth: true}
    },
    {
      path: '/deck/:deckId/:cardId',
      name: 'card',
      props: true,
      component: Card,
      meta: {needAuth: true}
    } */
  ]
})

export default router

router.beforeResolve((to, from, next) => {
  if (to.meta.needAuth && store.state.user.status !== USER_STATES.SIGNED_IN) {
    next('/')
  } else if (!to.meta.needAuth && store.state.user.status === USER_STATES.SIGNED_IN) {
    next('/home')
  } else {
    next()
  }
})
