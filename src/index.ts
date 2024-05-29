import { IApi } from "umi";

export default (api: IApi) => {
  console.log("这是我的插件");
  api.describe({
    key: "routePicker",
    config: {
      schema({ zod }) {
        return zod.array(zod.string());
      },
    },
    enableBy: ({ env }) => {
      console.log("插件 enableBy env", env);
      return true;
    },
  });
};
