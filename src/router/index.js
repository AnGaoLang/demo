import Vue from 'vue'
import Router from 'vue-router'
import project from '@/components/project'
import imap from '@/components/map/map'
import displayPage from '@/components/displayPage/displayPage'
import other from '@/components/other'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'project',
      component: project,
      children: [
        {path: '/edit', name: 'imap', component: imap},
        {path: '/display', name: 'displayPage', component: displayPage},
        {path: '/other', name: 'other', component: other}
      ]
    }
  ]
})
