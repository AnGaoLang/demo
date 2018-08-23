import Map from '../map/map'

export default class project {
    id = '1'
    name = '1'
    maps = []
    // 初始化maps数组
    constructor (imagesrc) {
      let array = []
      let that = this
      array = imagesrc
      array.forEach(function (target) {
        that.maps.push(new Map(target.id, target.src))
      })
    }
}
