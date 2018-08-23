<template>
    <div class="map_image" ref="drapContainer" :style="'float:left;width:90%;background:url('+currentmap.backgroundImage+');'">
      <component-editor :data-index="index" v-for="(item, index) in currentmap.components" :key="item.componentId" :monitor="item"></component-editor>
    </div>
</template>

<script>
import componentEditor from '../monitorComponentEditor/monitorComponentEditor'

export default{
  name: 'imap',
  data () {
    return {
      mouseDownRecycle: null,
      mouseMoveRecycle: null,
      mouseUpRecycle: null,
      mouseDownX: null,
      mouseDownY: null,
      // 鼠标移动了多少
      mouseMove: {x: 0, y: 0},
      // 是否按下鼠标
      isMouseDown: false,
      // 缩放点html对象和该对象的class
      resizePoint: null,
      pointClass: '',
      // 鼠标按下时组件的位置，大小
      mouseDownElementLeft: null,
      mouseDownElementTop: null,
      mouseDownElementWidth: null,
      mouseDownElementHeight: null,
      // 鼠标按下时的组件html对象(事件对象只会获取嵌套最深的元素，须网上遍历到整个组件)
      mouseDownElement: null,
      // 当前组件类
      mouseDownComponent: null,
      // 组件原始的宽高比例
      ratio: null,
      // 鼠标按下时组件初始化高
      initHeight: null
    }
  },
  components: {
    componentEditor
  },
  props: ['currentmap'],
  mounted () {
    document.addEventListener('mousedown', this.dragStart)
    document.addEventListener('mousemove', this.dragMove)
    document.addEventListener('mouseup', this.dragEnd)
    // this.drag()
  },
  // 销毁挂载的该组件时，移除document上的拖拽事件，防止多次mounted后document上多次绑定拖拽事件（为什么在mounted上init()无效？）
  destroyed () {
    this.init()
  },
  methods: {
    // 从事件目标往上遍历查询目标classname的元素
    findComponentEditor (evevtTarget, className) {
      if (!evevtTarget || !className) {
        return
      }
      if (evevtTarget && evevtTarget.classList && evevtTarget.classList.contains(className)) {
        return evevtTarget
      } else {
        return this.findComponentEditor(evevtTarget.parentNode, className)
      }
    },
    init () {
      document.removeEventListener('mousedown', this.dragStart)
      document.removeEventListener('mousemove', this.dragMove)
      document.removeEventListener('mouseup', this.dragEnd)
    },
    dragStart (event) {
      let target = event.target
      if (!this.findComponentEditor(target, 'map_image')) {
        this.currentmap.components.forEach((item) => {
          item.properties.selected = false
        })
        return
      }
      // 是否按下鼠标
      this.isMouseDown = true
      // 获取整个组件对象
      this.mouseDownElement = this.findComponentEditor(target, 'component_editor')
      // 如果点击对象不是组件对象则取消选中
      if (!this.mouseDownElement) {
        this.currentmap.components.forEach((item) => {
          item.properties.selected = false
        })
      } else {
        // 鼠标按下时，相对于整个文档左上角的位置
        this.mouseDownX = event.pageX
        this.mouseDownY = event.pageY
        // 如果点击对象是组件对象，则选中组件
        let index = this.mouseDownElement.getAttribute('data-index')
        this.currentmap.components.forEach((item) => {
          item.properties.selected = false
        })
        // 当前鼠标按下时的组件类
        this.mouseDownComponent = this.currentmap.components[index]
        // 组件宽高比例
        this.ratio = this.mouseDownComponent.properties.style.width / this.mouseDownComponent.properties.style.height
        // 鼠标按下时组件初始化高
        this.initHeight = this.mouseDownComponent.properties.style.height
        // 状态设为被选择
        this.mouseDownComponent.properties.selected = true
        // 将被点击的组件类传递给project组件
        this.$emit('iselected', this.mouseDownComponent)
        // 获取resizePoint的html对象(该对象为最底层html对象，故从target往上查找会找到自身)
        this.resizePoint = this.findComponentEditor(target, 'resize-point')
        // 若点击了改变大小的操作点
        if (this.resizePoint) {
          this.pointClass = this.resizePoint.className.replace('resize-point ', '')
          // 记录按下时组件类的大小和位置
          let style = this.mouseDownComponent.properties.style
          // let style = mouseDownElement.style
          this.mouseDownElementTop = style.top
          this.mouseDownElementLeft = style.left
          this.mouseDownElementWidth = style.width
          this.mouseDownElementHeight = style.height
        }
      }
    },
    dragMove (event) {
      if (!this.isMouseDown || !this.mouseDownElement) return
      // 当前鼠标位置
      let currentX = event.pageX
      let currentY = event.pageY
      // 组件旋转的角度
      let rotate = this.mouseDownComponent.properties.style.rotate
      // 移动的相对位置的数值
      this.mouseMove.x = currentX - this.mouseDownX
      this.mouseMove.y = currentY - this.mouseDownY
      // 若点中的是缩放的操作点,渲染组件的缩放
      if (this.resizePoint) {
        // 获取组件的style数据
        let elementStyle = this.mouseDownComponent.properties.style
        // 依据不同的操作点，进行不同放大缩小的赋值操作
        switch (this.pointClass) {
          case 'n-resize':
            // 向上增加高度，只需要同时改变top和高度即可（top减少，高度增加），左右同理
            // 限制压缩至0高度后造成的位移操作
            if (elementStyle.height > 0) {
              elementStyle.top = this.mouseDownElementTop + this.mouseMove.y
            }
            elementStyle.height = this.mouseDownElementHeight - this.mouseMove.y
            break
          case 'ne-resize':
            if (elementStyle.height > 1) {
              elementStyle.top = this.mouseDownElementTop + this.mouseMove.y
            }
            // 限制最小高度为1,不然ratio为NaN
            elementStyle.height = this.mouseDownElementHeight - this.mouseMove.y > 0 ? this.mouseDownElementHeight - this.mouseMove.y : 1
            // 依据宽高比得出宽
            elementStyle.width = elementStyle.height * this.ratio
            break
          case 'e-resize':
            elementStyle.width = this.mouseDownElementWidth + this.mouseMove.x
            break
          case 'se-resize':
            elementStyle.height = this.mouseDownElementHeight + this.mouseMove.y > 0 ? this.mouseDownElementHeight + this.mouseMove.y : 1
            elementStyle.width = elementStyle.height * this.ratio
            break
          case 's-resize':
            elementStyle.height = this.mouseDownElementHeight + this.mouseMove.y
            break
          case 'sw-resize':
            if (elementStyle.width > 1) {
              elementStyle.left = this.mouseDownElementLeft + this.mouseMove.x
            }
            elementStyle.width = this.mouseDownElementWidth - this.mouseMove.x > 0 ? this.mouseDownElementWidth - this.mouseMove.x : 1
            elementStyle.height = elementStyle.width / this.ratio
            break
          case 'w-resize':
            if (elementStyle.width > 0) {
              elementStyle.left = this.mouseDownElementLeft + this.mouseMove.x
            }
            elementStyle.width = this.mouseDownElementWidth - this.mouseMove.x
            break
          case 'nw-resize':
            if (elementStyle.width > 1) {
              elementStyle.left = this.mouseDownElementLeft + this.mouseMove.x
            }
            elementStyle.width = this.mouseDownElementWidth - this.mouseMove.x > 0 ? this.mouseDownElementWidth - this.mouseMove.x : 1
            elementStyle.height = elementStyle.width / this.ratio
            // 需放在height赋值操作的后面执行，依据height实际数值而不是鼠标移动的变化，对top进行赋值，以右下角为固定点伸缩
            if (elementStyle.height > 1) {
              elementStyle.top = this.mouseDownElementTop - (elementStyle.height - this.initHeight)
            }
            break
        }
        return
      }
      // 渲染组件的移动
      let moveTransform = `rotateZ(${rotate}deg) translate3d(${this.mouseMove.x}px,${this.mouseMove.y}px,0)`
      this.mouseDownElement.style.transform = moveTransform
    },
    dragEnd (event) {
      let target = event.target
      if (!this.findComponentEditor(target, 'map_image')) return
      if (!this.mouseDownElement) return
      // 还原鼠标按下的状态为false(首先还原鼠标按下的状态)1
      this.isMouseDown = false
      // 还原rotate
      let rotate = this.mouseDownComponent.properties.style.rotate
      // 还原transfrom
      this.mouseDownElement.style.transform = `rotateZ(${rotate}deg) translate3d(0,0,0)`
      if (this.resizePoint) {
        // 清空
        this.mouseDownElement = null
        // 还原mouseMove的值
        this.mouseMove = {x: 0, y: 0}
        // 还原缩放点html对象和该对象的class
        this.resizePoint = null
        this.pointClass = null
      } else {
        // 组件类的style数据1
        let style = this.mouseDownComponent.properties.style
        let maxLeft
        let maxTop
        // 拖拽限制的范围容器:宽高减去组件宽高
        maxLeft = document.querySelector('.map_image').offsetWidth - style.width
        maxTop = document.querySelector('.map_image').offsetHeight - style.height
        // 为什么用$refs会报错，maxTop = that.$refs.drapContainer.offsetHeight - style.height
        // 组件当前的位置信息
        let currentLeft = style.left
        let currentTop = style.top
        // 写入组件的位置
        style.left += this.mouseMove.x
        style.top += this.mouseMove.y
        // 清空
        this.mouseDownElement = null
        // 还原mouseMove的值
        this.mouseMove = {x: 0, y: 0}
        // 限制拖拽的范围
        if (style.left < 0 || style.left > maxLeft || style.top < 0 || style.top > maxTop) {
          style.left = currentLeft
          style.top = currentTop
        }
      }
    }
    // 拖拽
    // drag () {
    //   let that = this
    //   let mouseDownX
    //   let mouseDownY
    //   // 鼠标移动了多少
    //   let mouseMove = {x: 0, y: 0}
    //   // 是否按下鼠标
    //   let isMouseDown = false
    //   // 缩放点html对象和该对象的class
    //   let resizePoint
    //   let pointClass
    //   // 鼠标按下时组件的位置，大小
    //   let mouseDownElementLeft
    //   let mouseDownElementTop
    //   let mouseDownElementWidth
    //   let mouseDownElementHeight
    //   // 鼠标按下时的组件html对象(事件对象只会获取嵌套最深的元素，须网上遍历到整个组件)
    //   let mouseDownElement
    //   // 鼠标按下时位置信息
    //   // mouseDownCenter,
    //   // 当前组件类
    //   let mouseDownComponent
    //   // 组件原始的宽高比例
    //   let ratio
    //   // 鼠标按下时组件初始化高
    //   let initHeight
    //   // 鼠标按下
    //   // this.mouseDownRecycle = document.addEventListener('mousedown', (event) => {
    //   //   let target = event.target
    //   //   if (!that.findComponentEditor(target, 'map_image')) {
    //   //     that.currentmap.components.forEach((item) => {
    //   //       item.properties.selected = false
    //   //     })
    //   //     return
    //   //   }
    //   //   // 是否按下鼠标
    //   //   isMouseDown = true
    //   //   // 获取整个组件对象
    //   //   mouseDownElement = that.findComponentEditor(target, 'component_editor')
    //   //   // 如果点击对象不是组件对象则取消选中
    //   //   if (!mouseDownElement) {
    //   //     that.currentmap.components.forEach((item) => {
    //   //       item.properties.selected = false
    //   //     })
    //   //   } else {
    //   //     // 鼠标按下时，相对于整个文档左上角的位置
    //   //     mouseDownX = event.pageX
    //   //     mouseDownY = event.pageY
    //   //     // 如果点击对象是组件对象，则选中组件
    //   //     let index = mouseDownElement.getAttribute('data-index')
    //   //     that.currentmap.components.forEach((item) => {
    //   //       item.properties.selected = false
    //   //     })
    //   //     // 当前鼠标按下时的组件类
    //   //     mouseDownComponent = that.currentmap.components[index]
    //   //     // 组件宽高比例
    //   //     ratio = mouseDownComponent.properties.style.width / mouseDownComponent.properties.style.height
    //   //     // 鼠标按下时组件初始化高
    //   //     initHeight = mouseDownComponent.properties.style.height
    //   //     // 状态设为被选择
    //   //     mouseDownComponent.properties.selected = true
    //   //     // 将被点击的组件类传递给project组件
    //   //     that.$emit('iselected', mouseDownComponent)
    //   //     // 获取resizePoint的html对象(该对象为最底层html对象，故从target往上查找会找到自身)
    //   //     resizePoint = that.findComponentEditor(target, 'resize-point')
    //   //     // 若点击了改变大小的操作点
    //   //     if (resizePoint) {
    //   //       pointClass = resizePoint.className.replace('resize-point ', '')
    //   //       // 记录按下时组件类的大小和位置
    //   //       let style = mouseDownComponent.properties.style
    //   //       // let style = mouseDownElement.style
    //   //       mouseDownElementTop = style.top
    //   //       mouseDownElementLeft = style.left
    //   //       mouseDownElementWidth = style.width
    //   //       mouseDownElementHeight = style.height
    //   //     }
    //   //   }
    //   // })
    //   // 鼠标移动中
    //   this.mouseMoveRecycle = document.addEventListener('mousemove', (event) => {
    //     if (!isMouseDown || !mouseDownElement) return
    //     // 当前鼠标位置
    //     let currentX = event.pageX
    //     let currentY = event.pageY
    //     // 组件旋转的角度
    //     let rotate = mouseDownComponent.properties.style.rotate
    //     // 移动的相对位置的数值
    //     mouseMove.x = currentX - mouseDownX
    //     mouseMove.y = currentY - mouseDownY
    //     // 若点中的是缩放的操作点,渲染组件的缩放
    //     if (resizePoint) {
    //       // 获取组件的style数据
    //       let elementStyle = mouseDownComponent.properties.style
    //       // 依据不同的操作点，进行不同放大缩小的赋值操作
    //       switch (pointClass) {
    //         case 'n-resize':
    //           // 向上增加高度，只需要同时改变top和高度即可（top减少，高度增加），左右同理
    //           // 限制压缩至0高度后造成的位移操作
    //           if (elementStyle.height > 0) {
    //             elementStyle.top = mouseDownElementTop + mouseMove.y
    //           }
    //           elementStyle.height = mouseDownElementHeight - mouseMove.y
    //           break
    //         case 'ne-resize':
    //           if (elementStyle.height > 1) {
    //             elementStyle.top = mouseDownElementTop + mouseMove.y
    //           }
    //           // 限制最小高度为1,不然ratio为NaN
    //           elementStyle.height = mouseDownElementHeight - mouseMove.y > 0 ? mouseDownElementHeight - mouseMove.y : 1
    //           // 依据宽高比得出宽
    //           elementStyle.width = elementStyle.height * ratio
    //           break
    //         case 'e-resize':
    //           elementStyle.width = mouseDownElementWidth + mouseMove.x
    //           break
    //         case 'se-resize':
    //           elementStyle.height = mouseDownElementHeight + mouseMove.y > 0 ? mouseDownElementHeight + mouseMove.y : 1
    //           elementStyle.width = elementStyle.height * ratio
    //           break
    //         case 's-resize':
    //           elementStyle.height = mouseDownElementHeight + mouseMove.y
    //           break
    //         case 'sw-resize':
    //           if (elementStyle.width > 1) {
    //             elementStyle.left = mouseDownElementLeft + mouseMove.x
    //           }
    //           elementStyle.width = mouseDownElementWidth - mouseMove.x > 0 ? mouseDownElementWidth - mouseMove.x : 1
    //           elementStyle.height = elementStyle.width / ratio
    //           break
    //         case 'w-resize':
    //           if (elementStyle.width > 0) {
    //             elementStyle.left = mouseDownElementLeft + mouseMove.x
    //           }
    //           elementStyle.width = mouseDownElementWidth - mouseMove.x
    //           break
    //         case 'nw-resize':
    //           if (elementStyle.width > 1) {
    //             elementStyle.left = mouseDownElementLeft + mouseMove.x
    //           }
    //           elementStyle.width = mouseDownElementWidth - mouseMove.x > 0 ? mouseDownElementWidth - mouseMove.x : 1
    //           elementStyle.height = elementStyle.width / ratio
    //           // 需放在height赋值操作的后面执行，依据height实际数值而不是鼠标移动的变化，对top进行赋值，以右下角为固定点伸缩
    //           if (elementStyle.height > 1) {
    //             elementStyle.top = mouseDownElementTop - (elementStyle.height - initHeight)
    //           }
    //           break
    //       }
    //       return
    //     }
    //     // 渲染组件的移动
    //     let moveTransform = `rotateZ(${rotate}deg) translate3d(${mouseMove.x}px,${mouseMove.y}px,0)`
    //     mouseDownElement.style.transform = moveTransform
    //   })
    //   // 鼠标放开
    //   this.mouseUpRecycle = document.addEventListener('mouseup', (event) => {
    //     let target = event.target
    //     if (!that.findComponentEditor(target, 'map_image')) return
    //     if (!mouseDownElement) return
    //     // 还原鼠标按下的状态为false(首先还原鼠标按下的状态)1
    //     isMouseDown = false
    //     // 还原rotate
    //     let rotate = mouseDownComponent.properties.style.rotate
    //     // 还原transfrom
    //     mouseDownElement.style.transform = `rotateZ(${rotate}deg) translate3d(0,0,0)`
    //     if (resizePoint) {
    //       // 清空
    //       mouseDownElement = null
    //       // 还原mouseMove的值
    //       mouseMove = {x: 0, y: 0}
    //       // 还原缩放点html对象和该对象的class
    //       resizePoint = null
    //       pointClass = null
    //     } else {
    //       // 组件类的style数据1
    //       let style = mouseDownComponent.properties.style
    //       let maxLeft
    //       let maxTop
    //       // 拖拽限制的范围容器:宽高减去组件宽高
    //       maxLeft = document.querySelector('.map_image').offsetWidth - style.width
    //       maxTop = document.querySelector('.map_image').offsetHeight - style.height
    //       // 为什么用$refs会报错，maxTop = that.$refs.drapContainer.offsetHeight - style.height
    //       // 组件当前的位置信息
    //       let currentLeft = style.left
    //       let currentTop = style.top
    //       // 写入组件的位置
    //       style.left += mouseMove.x
    //       style.top += mouseMove.y
    //       // 清空
    //       mouseDownElement = null
    //       // 还原mouseMove的值
    //       mouseMove = {x: 0, y: 0}
    //       // 限制拖拽的范围
    //       if (style.left < 0 || style.left > maxLeft || style.top < 0 || style.top > maxTop) {
    //         style.left = currentLeft
    //         style.top = currentTop
    //       }
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>
.map_image{
  position:relative;
  height:700px;
}
</style>
