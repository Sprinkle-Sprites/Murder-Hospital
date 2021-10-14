<template>
<<<<<<< HEAD
   <div :id="containerId" v-if="downloaded" />
    <div class="placeholder" v-else>
        Downloading...
    </div>
</template>

<script>

export default {
=======
  <div :id="containerId" v-if="downloaded" />
  <!-- <div class="placeholder" v-else>
    Downloading ...
  </div> -->
</template>

<script>
export default {
  name: 'Game',
>>>>>>> 26e717fc3a5ad0ef02b9ab82fd57d3437a231842
  data() {
    return {
      downloaded: false,
      gameInstance: null,
      containerId: 'game-container'
    }
  },
  async mounted() {
    const game = await import('@/game/game')
    this.downloaded = true
    this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId)
    })
  },
  destroyed() {
    this.gameInstance.destroy(false)
  }
}
</script>

<<<<<<< HEAD
<style lang="scss" scoped>
.placeholder {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}
=======
// <style lang="scss" scoped>
// .placeholder {
//   font-size: 2rem;
//   font-family: 'Courier New', Courier, monospace;
//

>>>>>>> 26e717fc3a5ad0ef02b9ab82fd57d3437a231842
</style>
