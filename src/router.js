import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'home',
    meta: {
      icon: 'home', title: 'Home'
    },
    component: () =>
                import(/* webpackChunkName: "home" */ './pages/home/Home')
  },
  {
    path: '/lista-gastos',
    name: 'lista-gastos',
    meta: {
      icon: 'list-ul', title: 'Lista Gastos'
    },
    component: () =>
                import(/* webpackChunkName: "lista-gastos" */ './pages/lista-gastos/listaGastos')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login'
    },
    component: () =>
                import(/* webpackChunkName: "about" */ './pages/login/Login')
  }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Expense`

  if (!window.uid && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
