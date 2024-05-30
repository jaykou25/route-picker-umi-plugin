import { IApi } from "umi";

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

  api.modifyRoutes((routes) => {
    const { routePicker: pathArr } = api.config;
    if (!pathArr) return;

    if (!Array.isArray(pathArr)) return;

    if (pathArr.length < 1) return;

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
  });
};
