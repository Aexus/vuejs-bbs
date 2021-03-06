export default [
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('@/views/auth/Register')
  },
  // 首页路由配置
  {
    path: '/',
    name: 'Home',
    alias: '/topics',
    component: () => import('@/views/Home')
  },
  // 其它未配置的路由都跳转到首页
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/auth/Login')
  },
  // 编辑资料
  {
    path: '/users/1/edit',
    name: 'EditUsers',
    component: () => import('@/views/users/Edit'),
    children: [
      // 个人信息
      {
        path: '',
        name: 'EditProfile',
        component: () => import('@/views/users/Profile'),
        meta: { auth: true }
      },
      // 修改头像
      {
        path: '/users/1/edit_avatar',
        name: 'EditAvatar',
        component: () => import('@/views/users/Avatar'),
        meta: { auth: true }
      },
      // 修改密码
      {
        path: '/users/1/edit_password',
        name: 'EditPassword',
        component: () => import('@/views/users/Password'),
        meta: { auth: true }
      }
    ]
  },
  // 新建文章
  {
    path: '/articles/create',
    name: 'Create',
    component: () => import('@/views/articles/Create'),
    meta: { auth: true }
  },
  // 编辑文章
  {
    path: '/articles/:articleId/edit',
    name: 'Edit',
    component: () => import('@/views/articles/Create'),
    meta: { auth: true }
  },
  // 搜索框
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search')
  },
  {
    path: '/:user',
    name: 'Column',
    component: () => import('@/views/articles/Column'),
    children: [
      {
        path: '',
        name: 'Column',
        component: () => import('@/views/articles/List')
      },
      {
        path: '/articles/:articleId/content',
        name: 'Content',
        component: () => import('@/views/articles/Content')
      },
    ]
  }
]
