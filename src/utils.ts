// 过滤 api.appData.routes
export function routesByIdFilter(pathArr, routes) {
  if (!pathArr) return routes;

  if (!Array.isArray(pathArr)) return routes;

  if (pathArr.length < 1) return routes;

  // 去掉字符串前面的 /
  function stripSlash(str: string) {
    return str.replace(/^\/+/, "");
  }

  // 输出结果
  const ret: any = {};

  // routes 是一个对象, 键是一个 id, 值是一个 route 对象
  Object.keys(routes).forEach((id) => {
    const route = routes[id];

    if (
      id === "@@/global-layout" ||
      route.path === "/" ||
      pathArr.some((userPath) =>
        stripSlash(route.path).startsWith(stripSlash(userPath))
      )
    ) {
      ret[id] = route;
    }
  });

  return ret;
}

// 把 api.appData.routes 转化成配置表中的 routes
// 参考 umi renderer-react 中 createClientRoutes 方法
export function createConfigRoutes({ routesById, parentId }) {
  return Object.keys(routesById)
    .filter((id) => routesById[id].parentId === parentId)
    .map((id) => {
      const route: any = createConfigRoute(routesById[id]);

      const children = createConfigRoutes({
        routesById,
        parentId: id,
      });

      if (children.length > 0) {
        route.routes = children;
      }

      return route;
    });
}

function createConfigRoute(route) {
  return {
    path: route.path,
    component: route.id === "@@/global-layout" ? "@/layouts/index" : route.id,
    isGlobalLayout: route.id === "@@/global-layout",
  };
}
