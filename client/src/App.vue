<template>
  <div id="app">
    <div id='game'>
      <Game />
    </div>
    <div id="border" />
    <div id="input">
     <Chat />
    </div>
  </div>
</template>

<script>
import Game from '@/components/Game.vue'
import Chat from '@/components/Chat.vue'

export default {
  name: 'App',
  components: {
    Chat,
    Game }
}
</script>

<style lang="scss">
#app {
  height: 100vh;
  display: flex;
  justify-content: center;
  // align-items: center;
  margin: 0;
}
#game {
  width: 80vw;
  height: 100vh;
}
#input {
  width: 15vw;
  height: 100vh;
}
#border {
  border-style: solid;
  border-width: 2px;
}
</style>
