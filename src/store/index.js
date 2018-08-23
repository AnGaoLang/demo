
import Vue from 'vue'
import vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

import img0 from '@/assets/timg.jpg'
import img1 from '@/assets/timg1.jpg'
// import img2 from '@/assets/timg2.jpg'
// import img3 from '@/assets/timg3.jpg'
// import img4 from '@/assets/timg4.jpg'
// import img5 from '@/assets/timg5.jpg'

Vue.use(vuex)

const state = {
  project: [],
  satge: [
    {label: '背景图1', value: img0},
    {label: '背景图2', value: img1}
    // {label: '背景图3', value: img2},
    // {label: '背景图4', value: img3},
    // {label: '背景图5', value: img4},
    // {label: '背景图6', value: img5}
  ],
  componentRegister: [],
  componentCotainer: {},
  component: [],
  monitorPropreties: {},
  basicsProperties: {}
}

export default new vuex.Store({
  state,
  mutations,
  actions
})
