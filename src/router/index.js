import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/views/index/index'
import Goods from '@/views/goods/goods'
import addGoods from '@/views/addgoods/addgoods'
import Orders from '@/views/orders/orders'
import OrderDetail from '@/views/orderDetail/orderDetail'



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
        { path: '/orders', name: 'Orders', component: Orders },
        { path: '/orderDetail', name: 'OrderDetail', component: OrderDetail }
      ]
    }
  ]
})
