import request from "./request";

export const registerApi = (data) => {
  return request("IF_CUS_0002.do", "post", null, data);
};