<template>
   <div id="app">
        <div id="game">
            <Game />
        </div>
        <div id="border" />
        <div id="input">
            <Chat />
        </div>
    </div>
</template>

<script>
import Game from '@/components/Game'
import Chat from '@/components/Chat.vue';

export default {
  name: 'App',
  components: { Chat, Game }
}
</script>

<style lang="scss">
 #app {
        font-family: 'Trebuchet MS';
        text-align: left;
        display: flex;
    }
    #game {
        width: 80vw;
        height: 100vh;
    }
    #input {
        width: 20vw;
        height: 100vh;
    }
    #border {
        border-right: 2px solid black;
    }
</style>
