<template>
  <div class="iheader">
    <div class="iheader_container">
      <ul class="header_list">
        <li class="map">
          <span class="iconfont icon-ditu"></span>
          <div>地图</div>
          <div class="popover_container">
            <div class="triangle"></div>
            <div class="popover_content">
              <ul class="switch_map">
                <li v-if="editShow">
                  上传地图
                  <input class="upload_input" type="file" accept="image/*" ref="upload" @change="upload">
                </li>
                <li v-if="project.maps" v-for="(item, index) in project.maps" :key="item.mapsId" @click="changeMap(index, item)">{{item.mapsId}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="monitor" v-if="editShow">
          <span class="iconfont icon-shexiangtou1"></span>
          <div>视频</div>
          <div class="popover_container">
            <div class="triangle"></div>
            <div class="popover_content">
              <ul class="switch_component">
                <li >摄像头类型</li>
                <li @click="addComponent(1)"><span class="iconfont icon-ball-camera-c"></span>摄像头</li>
                <li @click="addComponent(2)"><span class="iconfont icon-qiangji"></span>枪机</li>
                <li @click="addComponent(3)"><span class="iconfont icon-tadiaobj"></span>塔吊</li>
              </ul>
            </div>
          </div>
        </li>
        <li @click="display">
          <span class="iconfont icon-yulan"></span>
          <div>预览</div>
        </li>
        <li @click="edit">
          <span class="iconfont icon-bianji"></span>
          <div>编辑</div>
        </li>
      </ul>
      <div class="button_container">
        <a class="save" @click="submit" v-if="editShow">保存</a>
        <a class="delete" @mousedown.stop @click.stop="deleteComponent" v-if="editShow">删除</a>
      </div>
    </div>
  </div>
</template>

<script>
import Component from '@/module/component/component'
import imgsrc from '@/assets/monitor.jpg'
import imgsrc1 from '@/assets/monitor1.jpg'
import imgsrc2 from '@/assets/monitor2.jpg'
import Map from '@/module/map/map'

export default {
  name: 'iheader',
  components: {
  },
  data () {
    return {
      currentMap: '',
      uuid: 0,
      editShow: true,
      index: 3
    }
  },
  props: ['project'],
  methods: {
    changeMap (index, item) {
      this.$emit('changemap', index)
      this.currentMap = item
    },
    upload () {
      // 获取input(type=file)文件上传返回的file对象
      let file = this.$refs.upload.files[0]
      // FileReader对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容（包括input上传的内容）
      let reader = new FileReader()
      let that = this
      // FileReader.readAsDataURL()读取指定Blob中的内容，其result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容。
      reader.readAsDataURL(file)
      // onloadend事件在读取操作结束时（要么成功，要么失败）触发。
      reader.onloadend = function (e) {
        // 上述result属性中包含的一个data: URL格式的字符串
        let imagedata = e.target.result
        let mapId = 'map' + that.index++
        let map = new Map(mapId, imagedata)
        that.project.maps.push(map)
      }
    },
    edit () {
      this.editShow = true
      this.$router.push({path: '/edit'})
    },
    display () {
      this.editShow = false
      this.$router.push({path: '/display'})
    },
    addComponent (type) {
      if (type === 1) {
        let id = Math.random() + this.uuid++
        let newComponent = new Component(id, type, imgsrc)
        this.currentMap.components.push(newComponent)
      } else if (type === 2) {
        let id = Math.random() + this.uuid++
        let newComponent = new Component(id, type, imgsrc1)
        this.currentMap.components.push(newComponent)
      } else if (type === 3) {
        let id = Math.random() + this.uuid++
        let newComponent = new Component(id, type, imgsrc2)
        this.currentMap.components.push(newComponent)
      }
    },
    submit () {
      console.log(JSON.stringify(this.currentMap.components))
    },
    // 从当前地图中删除组件
    deleteComponent () {
      let that = this
      this.currentMap.components.forEach((item, index) => {
        if (item.properties.selected) {
          that.currentMap.components.splice(index, 1)
        }
      })
    }
  },
  mounted () {
    console.log(this.project)
    // let item = this.project.maps[0];
    // this.changeMap(0, item);
    // console.log(item)
  }
}
</script>

<style scoped>
  .iheader{
    background-color:#fafafa;
    border-bottom:1px solid #ccd5db;
  }
  .iheader_container{
    position:relative;
    margin:0 auto;
  }
  .header_list{
    margin:0 auto;
    padding:0;
    width:520px;
    list-style:none;
  }
  .header_list>li{
    position: relative;
    display:inline-block;
    padding-top:8px;
    height: 56px;
    width: 60px;
    cursor: pointer;
    font-size:12px;
    text-align: center;
    color:#76838f;
  }
  .header_list>li:hover{
    color:#fff;
    background:#09f;
  }
  
  .header_list>li:hover .popover_content{
    color:#76838f;
  }
  .header_list .iconfont{
    font-size:25px;
  }
  .iheader a{
    display:inline-block;
    margin-right:10px;
    padding:10px;
    color:#2c3e50;
    cursor:pointer;
  }
  .button_container{
    position:absolute;
    top:50%;
    right:110px;
    transform:translate3d(0,-50%,0);
  }
  .button_container>a{
    padding:8px 10px;
    font-size:12px;
    color:#fff;
    background:#09f;
    border-radius:5px;
  }
  .iheader .upload{
    position:relative;
    margin-right:0;
  }
  .upload_input{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    cursor:pointer;
    opacity:0;
  }
  .map:hover>.popover_container,.monitor:hover>.popover_container{
    display:block;
  }
  .popover_container{
    display:none;
    position:absolute;
    top:62px;
    left:50%;
    transform:translate3d(-50%,0,0);
    z-index:100;
    width:500px;
  }
  .popover_content{
    margin-top:10px;
    width:100%;
    background:#fff;
    border:1px solid rgba(0,0,0,.2);
    border-radius:5px;
    box-shadow:0 0 10px rgba(0,0,0,.2);
  }
  .triangle:before{
    content:"";
    position:absolute;
    top:5px;
    right:48%;
    box-shadow:2px -2px 5px rgba(0,0,0,.2);
    border-width:7px;
    border-style:solid;
    border-color:#fff #fff transparent transparent;
    transform:rotate(-45deg);
  }
  .switch_component,.switch_map{
    padding:0;
    text-align:left;
    list-style:none;
    word-spacing:-4px;
  }
  .switch_component>li,.switch_map>li{
    position:relative;
    display:inline-block;
    width:25%;
    padding:5px 0;
    font-size:14px;
    line-height:30px;
    text-align:center;
  }
  .switch_component>li:first-child{
    border-right:1px solid #dadada;
    background:#fafafa;
  }
  .switch_component>li:hover,.switch_map>li:hover{
    color:#09f;
  }
  .switch_component>li:hover:first-child{
    color:#76838f;
  }
  .switch_component .iconfont{
    margin-right:5px;
    font-size:15px;
  }
  /* .switch_map{
    display:inline-block;
    padding:0;
    list-style-type:none;
  }
  .switch_map>li{
    display:inline-block;
    padding:10px;
    margin-right:5px;
    text-align:center;
    border:1px solid #666;
    cursor:pointer;
  }
  .switch_component{
    position:relative;
    color:#2c3e50;
  }
  .switch_component>span{
    display:inline-block;
    padding:10px;
    margin-right:5px;
    text-align:center;
    border:1px solid #999;
    cursor:pointer;
  }
  .switch_component>ul{
    display:none;
    position:absolute;
    z-index:10;
    left:0;
    top:12px;
    padding:0;
    width:85px;
    background:#fff;
    text-align:center;
    border:1px solid #999;
    list-style:none;
  }
  .switch_component>ul>li{
    display:block;
    padding:5px 0;
    border:1px solid #666;
    cursor:pointer;
  }
  .switch_component:hover>ul{
    display:block;
  } */
</style>
