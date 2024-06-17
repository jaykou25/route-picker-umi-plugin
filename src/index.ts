import { IApi } from "umi";
import { createConfigRoutes, routesByIdFilter } from "./utils";

export default (api: IApi) => {
  api.describe({
    key: "routePicker",
    config: {
      schema({ zod }) {
        return zod.array(zod.string());
      },
    },
    enableBy: () => {
      return api.name === "dev";
    },
  });

  let start;
  let end;

  // 用于计时
  api.register({
    key: "modifyAppData",
    fn: () => {
      start = Date.now();
    },
    stage: -1,
  });

  api.modifyAppData(async (memo) => {
    end = Date.now();
    console.log("[日志]", " 解析路由表花费时间:", (end - start) / 1000, "s");
    console.log("[日志]", " 总的路由数:", Object.keys(memo.routes).length);

    const routePicker = api.config.routePicker;

    // 先对api.appData.routes 进行过滤
    const filtedRoutes = routesByIdFilter(api.config.routePicker, memo.routes);

    if (routePicker && routePicker.length > 0) {
      console.log("[日志]", " routePicker 启用:", routePicker.join(", "));
      console.log(
        "[日志]",
        " routePicker 启用后的路由数:",
        Object.keys(filtedRoutes).length
      );
    }

    memo.routes = filtedRoutes;

    // 把 routes 反转成配置表中的 routes
    const configRoutes = createConfigRoutes({
      routesById: filtedRoutes,
      parentId: undefined,
    });

    // 去掉全局 layout, 因为配置表中的 routes 不需要全局路由, umi 会自已生成的
    const layoutRoute = configRoutes.find((route) => route.isGlobalLayout);

    // 重新赋给 api.config
    api.config.routes = layoutRoute ? layoutRoute.routes : configRoutes;

    return memo;
  });
};
