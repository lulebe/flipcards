import Vue from 'vue'
import Router from 'vue-router'

import store from '@/state/store'
import {USER_STATES} from '@/state/user'

import Frontpage from '@/components/Frontpage'
import Signin from '@/components/Signin'
import Signup from '@/components/Signup'
import PWReset from '@/components/PWReset'

import Shell from '@/components/Shell'
import Home from '@/components/Home'
import Settings from '@/components/Settings'
import Deck from '@/components/Deck'
import Card from '@/components/Card'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'frontpage',
      component: Frontpage,
      meta: {needAuth: false, noAuthRedirect: true}
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {needAuth: false}
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin,
      meta: {needAuth: false}
    },
    {
      path: '/pwreset',
      name: 'pwreset',
      component: PWReset,
      meta: {needAuth: false}
    },
    {
      path: '/app',
      name: 'app',
      component: Shell,
      meta: {needAuth: true},
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home,
          meta: {needAuth: true}
        },
        {
          path: 'settings',
          name: 'settings',
          component: Settings,
          meta: {needAuth: true}
        },
        {
          path: 'deck/:deckId',
          name: 'deck',
          props: true,
          component: Deck,
          meta: {needAuth: true}
        },
        {
          path: 'deck/:deckId/:cardId',
          name: 'card',
          props: true,
          component: Card,
          meta: {needAuth: true}
        }
      ]
    },
    {
      path: '*',
      name: 'fallback',
      component: Frontpage,
      meta: {needAuth: false}
    }
  ]
})

export default router

var originalRoute = null

router.beforeResolve((to, from, next) => {
  if (to.meta.needAuth && store.state.user.status !== USER_STATES.SIGNED_IN) {
    originalRoute = {path: to.path}
    next({name: 'frontpage'})
  } else if (!to.meta.needAuth && store.state.user.status === USER_STATES.SIGNED_IN) {
    next(originalRoute || {name: 'home'})
  } else {
    next()
  }
})

store.watch(state => state.user.status, status => {
  if (status === USER_STATES.SIGNED_IN && !router.currentRoute.meta.needAuth) {
    router.replace(originalRoute || {name: 'home'})
  } else if (status !== USER_STATES.SIGNED_IN && router.currentRoute.meta.needAuth) {
    router.replace({name: 'frontpage'})
  }
  if (status !== USER_STATES.SIGNED_IN) {
    originalRoute = null
  }
})
