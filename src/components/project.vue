<template>
  <div class="project">
    <iheader :project="project" @changemap="changIndex"></iheader>
    <div class="editor_container" v-if="!!project">
      <div class="attribute_container">
        <div v-if="monitor"  @mousedown.stop>
          <iattribute v-if="monitor.properties.selected" :monitor="monitor"></iattribute>
          <div v-else style="margin-top:50px;">请选择摄像头</div>
        </div>
      </div>
      <router-view @iselected="showIattribute" :currentmap="project.maps[mapIndex]"></router-view>
      <!-- <imap @iselected="showIattribute" :currentmap="project.maps[mapIndex]"></imap> -->
    </div>
    <!-- <div v-if="monitor" @mousedown.stop>
      <iattribute v-show="monitor.properties.selected" :monitor="monitor"></iattribute>
    </div> -->
  </div>
</template>

<script>
import img0 from '@/assets/timg.jpg'
import img1 from '@/assets/timg1.jpg'
import img2 from '@/assets/timg2.jpg'

import iheader from './iheader/iheader'
import imap from './map/map'
import iattribute from './addAttribute/addAttribute'
import Project from '@/module/project/project'

export default {
  name: 'project',
  components: {
    iheader,
    imap,
    iattribute
  },
  data () {
    return {
      project: '',
      monitor: '',
      mapIndex: 0
    }
  },
  mounted () {
    let imagesrc = [
      {id: 'map0', label: '地图1', src: img0},
      {id: 'map1', label: '地图2', src: img1},
      {id: 'map2', label: '地图3', src: img2}
    ]
    let that = this
    that.project = new Project(imagesrc)
  },
  methods: {
    changIndex (index) {
      this.mapIndex = index
    },
    showIattribute (item) {
      this.monitor = item
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.project{
  position:relative;
}
.editor_container{
  padding:0 50px;
  position:relative;
  height:700px;
}
.editor_container:after{
  content:"";
  display:block;
  clear:both;
  overflow:hidden;
}
.attribute_container{
  float:left;
  width:10%;
  height:100%;
  background:#fafafa;
}
.right{
  float:left;
}
</style>
