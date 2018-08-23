import Properties from '../basicsProperties/basicsProperties'

export default class component {
  componentId = ''
  // 组件的编码
  code = '123'
  // 组件的类型
  type = '1'
  // 组件的背景图片
  backgroundImage = ''
  // properties类的实例
  properties = new Properties()
  // 组件相对应的html对象
  element = null
  constructor (id, type, imgsrc) {
    this.componentId = id
    this.type = type
    this.backgroundImage = imgsrc
  }
  get style () {
    return this.properties.style
  }
  get componentEditorStyle () {
    let style = this.style
    let resetTranslate = ' translate3d(0, 0, 0)'
    return `
    left:${style.left}px;
    top:${style.top}px;
    width:${style.width}px;
    height:${style.height}px;
    transform:rotateZ(${style.rotate}deg)${resetTranslate};
    -ms-transform:rotateZ(${style.rotate}deg)${resetTranslate};
    -moz-transform:rotateZ(${style.rotate}deg)${resetTranslate};
    -webkit-transform:rotateZ(${style.rotate}deg)${resetTranslate};
    -o-transform:rotateZ(${style.rotate}deg)${resetTranslate};`
  }
  get componentSelectStyle () {
    let style = this.style
    return `
    left:${style.left}px;
    top:${style.top}px;
    width:${style.top}px
    height:${style.height}px`
  }
}
