import { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;
  try {
    const { messageId,data } = body; // 从 req.body 中提取 messageId
    const url=data[0].url;
    await redis.set(messageId, url); // 将 messageId 作为键存储到 Redis 中
    return res.status(200).send(url); // 返回成功响应
  } catch (error) {
    console.error("Error in callback API:", error); // 记录错误日志
    return res.status(500).json({ error: error.message }); // 返回更具体的错误信息
  }
}
