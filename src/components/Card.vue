<template>
  <div>
    <Topbar signedIn="true"></Topbar>
    <Cardview :title="card.title" :color="card.color" :front="card.front" :back="card.back"></Cardview>
  </div>
</template>
<script>
  import cTopbar from '@/components/Topbar'
  import cCardview from '@/components/Cardview'

  import {firebaseDb, firebaseStatus, firebaseAuth} from '@/util/firebase'

  export default {
    props: ['deckId', 'cardId'],
    components: {
      'Topbar': cTopbar,
      'Cardview': cCardview
    },
    data () {
      return {
        card: {
          title: 'Loading...',
          front: '',
          back: ''
        }
      }
    },
    mounted () {
      if (firebaseStatus.user != null) {
        this.loadCard(firebaseStatus.user)
      } else {
        const unsub = firebaseAuth.onAuthStateChanged(user => {
          unsub()
          this.loadCard(user)
        })
      }
    },
    methods: {
      loadCard (user) {
        // /users/user.uid/decks/this.deckId/cards/this.cardId
      }
    }
  }
</script>
<style lang="css">
  
</style>
