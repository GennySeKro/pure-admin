// 根据角色动态生成路由
import { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: "/flow-capture",
    method: "post",
    response: ({ query }) => {
      if (query.action == "start") {
        return {
          code: 200,
          data: {
            msg: "服务器端收到了开始抓包的指令"
          }
        };
      } else {
        return {
          code: 401,
          data: {
            msg: "请求参数错误"
          }
        };
      }
    }
  },
  {
    url: "/flow-capture",
    method: "get",
    response: ({ query }) => {
      if (query.action == "terminate") {
        return {
          code: 200,
          data: {
            msg: "服务器端收到了停止抓包的指令"
          }
        };
      } else {
        return {
          code: 401,
          data: {
            msg: "请求参数错误"
          }
        };
      }
    }
  }
] as MockMethod[];
