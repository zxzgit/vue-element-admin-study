
/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
 **/
let asyncRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },
  
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },
  
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },
  
  {
    path: '/user',
    component: Layout,
    meta: { title: 'user', icon: 'link' },
    redirect: '/nested/menu1',
    name: 'userList',
    children: [
      {
        path: ':id/profile',
        meta: { title: '用户信息信息', icon: 'link' },
        hidden: true
      },
      {
        path: '1/profile',
        meta: { title: '用户1', icon: 'link' },
      },
      {
        path: '2/profile',
        meta: { title: '用户2', icon: 'link' },
      }
    ]
  },
  
  {
    path: '/admin',
    component: Layout,
    meta: { title: '管理员', icon: 'link' },
    redirect: '/nested/menu1',
    name: 'userList',
    children: [
      {
        path: 'users',
        meta: { title: '用户信息信息', icon: 'link' },
        hidden: true
      },
      {
        path: 'roles',
        meta: { title: '后台用户', icon: 'link' },
      },
      {
        path: 'pages',
        meta: { title: '后台角色', icon: 'link' },
      }
    ]
  },
  
  { path: '*', redirect: '/404', hidden: true }
]


/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(permissionList, route,basePath) {
  console.log(basePath+route.path);
  if (route.path) {
    let result = permissionList.some(page => page.path == (basePath + route.path))
    console.log(result);
    return result;
  } else {
    return false
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, permissionList, basePath = '') {
  const res = []
  
  routes.forEach(route => {
    
    const tmp = { ...route }
    if (hasPermission(permissionList, tmp, basePath)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, permissionList, basePath + tmp.path + '/')
      }
      res.push(tmp)
    }
  })
  
  return res
}

let remotePermission = [{"id":1,"title":"\u540e\u53f0\u7cfb\u7edf\u7ba1\u7406","path":"\/admin","pid":0,"created_at":null,"updated_at":null},{"id":2,"title":"\u540e\u53f0\u7528\u6237","path":"\/admin\/users","pid":1,"created_at":null,"updated_at":null},{"id":3,"title":"\u540e\u53f0\u89d2\u8272","path":"\/admin\/roles","pid":1,"created_at":null,"updated_at":null},{"id":4,"title":"\u540e\u53f0\u9875\u9762","path":"\/admin\/pages","pid":1,"created_at":null,"updated_at":null},{"id":5,"title":"\u8ba2\u5355\u7ba1\u7406","path":"\/order","pid":0,"created_at":null,"updated_at":null},{"id":6,"title":"\u7b49\u5f85\u4e2d\u7684\u8ba2\u5355","path":"\/waitOrder","pid":5,"created_at":null,"updated_at":null},{"id":7,"title":"\u670d\u52a1\u4e2d\u7684\u8ba2\u5355","path":"\/serviceOrder","pid":5,"created_at":null,"updated_at":null}];

let asyncRouter = filterAsyncRouter(asyncRouterMap,remotePermission);

export default asyncRouter
