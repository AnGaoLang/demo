<template>
    <div class="select_container" :style="{width: monitor.properties.style.width + 'px', height: monitor.properties.style.height + 'px'}">
      <span class="resize-point n-resize"></span>
      <span class="resize-point ne-resize"></span>
      <span class="resize-point e-resize"></span>
      <span class="resize-point se-resize"></span>
      <span class="resize-point s-resize"></span>
      <span class="resize-point sw-resize"></span>
      <span class="resize-point w-resize"></span>
      <span class="resize-point nw-resize"></span>
      <!-- <span class="rotate-point"></span>
      <span class="component-editor-line"></span> -->
    </div>
</template>

<script>
export default {
  name: 'monitorComponentSelect',
  data () {
    return {

    }
  },
  props: ['monitor'],
  components: {
  },
  method () {

  }
}
</script>

<style scoped>
.select_container{
  position:absolute;
  left: 0;
  top: 0;
  width:100%;
  height:100%;
  box-sizing:border-box;
  border:1px solid red;
  cursor:move;
}
.resize-point {
  display: inline-block;
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  background-color: #fff;
  border: 1px solid #08a1ef;
  border-radius: 12px;
  z-index: 4;
  transform-origin: 50% 50%;
  position: absolute;
}
.resize-point.n-resize {
  top: -5px;
  left: 50%;
  margin-left: -6px;
  cursor: n-resize;
}
.resize-point.ne-resize {
  top: -5px;
  right: -5px;
  cursor: ne-resize;
}
.resize-point.e-resize {
  top: 50%;
  right: -5px;
  margin-top: -6px;
  cursor: e-resize;
}
.resize-point.se-resize {
  right: -5px;
  bottom: -5px;
  cursor: se-resize;
}
.resize-point.s-resize {
  left: 50%;
  bottom: -5px;
  margin-left: -6px;
  cursor: s-resize;
}
.resize-point.sw-resize {
  left: -5px;
  bottom: -5px;
  cursor: sw-resize;
}
.resize-point.w-resize {
  left: -5px;
  top: 50%;
  margin-top: -6px;
  cursor: w-resize;
}
.resize-point.nw-resize {
  left: -5px;
  top: -5px;
  cursor: nw-resize;
}
.rotate-point {
  width: 12px;
  height: 12px;
  background-color: #44cb83;
  margin-left: -6px;
  position: absolute;
  left: 50%;
  top: -25px;
  border-radius: 12px;
  z-index: 4;
  cursor: url('./rotate_cursor.png'), default;
}
.component-editor-line {
  height: 20px;
  border-left: solid 1px #44cb83;
  left: 50%;
  position: absolute;
  z-index: 3;
  top: -20px;
}
</style>
