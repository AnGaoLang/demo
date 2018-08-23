<template>
  <!-- 最外层的包裹层用于实现拖拽 -->
  <!-- <div class="dialog" ref='dialog' :style="{left:left+'px',top:top+'px',transform:`translate3d(${move.x}px,${move.y}px,0)`}" @mousedown="idown($event)" @mousemove="imove" @mouseup="iup"> -->
  <div>
    <div class="dialog_header">添加组件相关属性</div>
    <div class="dialog_container">
      <div class="dialog_box">
        <label>设备编号：</label>
        <input type="text" v-model="monitor.code">
      </div>
      <div class="dialog_box">
        <label>设备类型：</label>
        <select v-model="monitor.type">
          <option value="1" label="摄像头"></option>
          <option value="2" label="枪机"></option>
          <option value="3" label="塔吊"></option>
        </select>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import imgsrc from '@/assets/monitor.jpg'
import imgsrc1 from '@/assets/monitor1.jpg'
import imgsrc2 from '@/assets/monitor2.jpg'

export default {
  name: 'addAttribute',
  components: {},
  props: ['monitor'],
  data () {
    return {
      isDown: false,
      element: null,
      left: -40,
      top: 0,
      downX: 0,
      downY: 0,
      move: {x: 0, y: 0}
    }
  },
  methods: {
    findClassElement (target, className) {
      if (!target || !className) {
        return
      }
      if (target && target.classList && target.classList.contains(className)) {
        return target
      } else {
        return this.findClassElement(target.parentNode, className)
      }
    },
    idown (event) {
      this.isDown = true
      this.element = this.findClassElement(event.target, 'dialog')
      this.downX = event.pageX
      this.downY = event.pageY
    },
    imove () {
      if (!this.isDown) return
      let currentX = event.pageX
      let currentY = event.pageY
      this.move.x = currentX - this.downX
      this.move.y = currentY - this.downY
    },
    iup () {
      this.isDown = false
      this.element = null
      this.downX = 0
      this.downY = 0
      this.left += this.move.x
      this.top += this.move.y
      this.move = {x: 0, y: 0}
    }
  },
  watch: {
    monitor: {
      handler: function (newMonitor) {
        if (newMonitor.type === '1') {
          this.monitor.backgroundImage = imgsrc
        } else if (newMonitor.type === '2') {
          this.monitor.backgroundImage = imgsrc1
        } else if (newMonitor.type === '3') {
          this.monitor.backgroundImage = imgsrc2
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.dialog{
  position:absolute;
  width:150px;
  height:200px;
  background:#f0f3f4;
  box-shadow:2px 2px 2px 2px rgba(50, 50, 101, 0.3);
}
.dialog_header{
  padding:10px;
  background:#09f;
  font-size:16px;
  color:#fff;
  text-align:center;
  cursor:move;
}
.dialog_container{
  padding:5px;
  text-align:left;
}
.dialog_box{
  margin-bottom:20px;
}
.dialog_box>label{
  font-size:12px;
}
.dialog_box>input{
  margin:5px 0;
  width:90%;
}
.dialog_box>a{
  margin-top:5px;
  padding:5px;
  background:#666;
  font-size:12px;
  color:#fff;
  cursor:pointer;
  border-radius:5px;
}
</style>
