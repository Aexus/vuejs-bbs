import Vue from 'vue'
import Router from 'vue-router'
// 引入 ./routes.js 的默认值
import routes from './routes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'active',
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // 有锚点时，滚动到锚点
      return {
        selector: to.hash
      }
    } else if (savedPosition) {
      // 有保存位置时，滚动到保存位置
      return savedPosition
    } else {
      // 默认滚动到页面顶端
      return {x: 0, y: 0}
    }
  },
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 获取仓库里的登录信息
  const app = router.app
  const store = app.$options.store
  const auth = store.state.auth
  const articleId = to.params.articleId

  const user = store.state.user && store.state.user.name
  const paramUser = to.params.user

  app.$message.hide()

  if ((auth && to.path.indexOf('/auth/') !== -1) || (!auth && to.meta.auth) || (articleId && !store.getters.getArticleById(articleId)) || (paramUser && paramUser !== user && !store.getters.getArticleById(null, paramUser).length)) {
    // 如果当前用户已登录，且目标路由包含 /auth/ 或 有 articleId 且不能找到与其对应的文章时 ，就跳转到首页
    next('/')
  } else {
    next()
  }
})

// 注册全局后置钩子
router.afterEach((to, from) => {
  const app = router.app
  const store = app.$options.store
  // 获取目标页面路由参数里的 showMsg
  const showMsg = to.params.showMsg

  if (showMsg) {
    // showMsg 是一个字符时，使用它作为消息内容
    if (typeof showMsg === 'string') {
      app.$message.show(showMsg)
    } else {
      app.$message.show('操作成功')
    }
  }
})

export default router
