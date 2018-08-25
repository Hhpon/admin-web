import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/views/index/index'
import Goods from '@/views/goods/goods'
import addGoods from '@/views/addgoods/addgoods'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      redirect: '/addgoods',
      children: [
        { path: '/goods', name: 'Goods', component: Goods },
        { path: '/addgoods', name: 'addGoods', component: addGoods },
      ]
    }
  ]
})
