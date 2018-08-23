<template>
     <div class="map_image1" :style="'background:url('+currentmap.backgroundImage+');'">
      <component-editor v-for="item in currentmap.components" :key="item.componentId" :monitor="item" @click.native="aa(item)"></component-editor>
    </div>
</template>

<script>
import componentEditor from '../monitorComponentEditor/monitorComponentEditor'

export default{
  name: 'idisplayPage',
  data () {
    return {
    }
  },
  components: {
    componentEditor
  },
  props: ['currentmap'],
  mounted () {
  },
  methods: {
    aa (component) {
      console.log(component)
    }
  }
}
</script>

<style scoped>
.map_image1{
  position:relative;
  height:700px;
}
</style>
