export default {
  // 静态路由
  path: "/dashboard",
  redirect: "/dashboard/index",
  meta: {
    icon: "homeFilled",
    title: "仪表盘",
    rank: 0
  },
  children: [
    {
      path: "/dashboard/index",
      name: "Dashboard",
      component: () => import("@/views/dashboard/index.vue"),
      meta: {
        title: "仪表盘"
      }
    }
  ]
} as RouteConfigsTable;
