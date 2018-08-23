<template>
    <div class="monitorcomponent">
        <img :src="monitor.backgroundImage" :style="{width: monitor.properties.style.width + 'px', height: monitor.properties.style.height + 'px'}"/>
    </div>
</template>

<script>
export default {
  name: 'monitorComponent',
  data () {
    return {

    }
  },
  props: ['monitor'],
  component: {

  },
  method () {
  }
}
</script>

<style scoped>
.monitorcomponent{
    width:100%;
    height:100%;
}
</style>
