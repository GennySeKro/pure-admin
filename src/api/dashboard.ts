import { http } from "@/utils/http";
import { baseUrlApi, userSetApi } from "./utils";

export type FlowRequest = {
  nic: String;
  src_ip: String;
  dst_ip: String;
  src_port: Number;
  dst_port: Number;
};

export type FlowResult = {
  success: boolean;
  data: {
    msg: string;
  };
};

export type NicResult = {
  success: boolean;
  data: {
    nicList: string[];
  };
};

export type IpResult = {
  success: boolean;
  data: {
    ipList: string[];
  };
};

export function flowStart(data: FlowRequest) {
  return http.request<FlowResult>("post", baseUrlApi("flow-capture"), {
    params: {
      action: "start"
    },
    data
  });
}

export function flowTerminate() {
  return http.request<FlowResult>("get", baseUrlApi("flow-capture"), {
    params: {
      action: "terminate"
    }
  });
}

export function getNicList() {
  return http.request<NicResult>("get", userSetApi("locinfo"), {
    params: {
      info: "nic"
    }
  });
}

export function getIpList() {
  return http.request<IpResult>("get", userSetApi("locinfo"), {
    params: {
      info: "ipaddr"
    }
  });
}
