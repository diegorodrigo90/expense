<template>
  <div class="base-spinner fa-3x" v-if="visible">
    <i class="fas fa-circle-notch fa-spin"></i>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: true
    }
  },
 created() {
   this.$root.$on('Spinner::show', () => {this.visible = true})

this.$root.$on('Spinner::hide', () => {this.visible = false})

 },
 methods: {
   alternarspinner () {
     this.visible = !this.visible
   },
   mostrarSpinner () {
     this.$root.$emit('Spinner::show')
   }
 }

}
</script>

<style lang="scss" scoped>
.base-spinner{
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--featured);
  z-index: 1000000000;
  background-color: var(--dark-medium);

}
</style>
