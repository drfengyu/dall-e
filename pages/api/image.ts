import { NextApiRequest, NextApiResponse } from "next"; // 导入 Next.js API 请求和响应类型
const QSTASH = `https://qstash.upstash.io/v1/publish/`; // QSTASH 服务的 URL
const IMAGE_API = process.env.IMAGE_API_URL; // 新的 API URL
const VERCEL_URL = "https://dalle-2-jade.vercel.app"; // Vercel 部署的 URL

export default async function handler(
  req: NextApiRequest, // 请求对象
  res: NextApiResponse // 响应对象
) {
  const { prompt } = req.query; // 从请求查询参数中获取 prompt
  try {
    const response = await fetch(`${IMAGE_API}/${encodeURIComponent(prompt as string)}`, {
      method: "GET", // 使用 GET 方法
      headers: {
        Authorization: `Bearer ${process.env.QSTASH_TOKEN}`, // QSTASH 的授权令牌
        // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // OpenAI API 的授权令牌（已注释）
        // "upstash-forward-Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // 转发给 OpenAI API 的授权令牌
        "Content-Type": "application/json", // 请求的内容类型
        "Upstash-Callback": `${VERCEL_URL}/api/callback`, // 回调 URL
      },
    });
    const json = await response.json(); // 解析响应的 JSON
    return res.status(202).json({ id: json.messageId }); // 返回响应，状态码 202，包含 messageId
  } catch (error) {
    return res
      .status(500) // 返回错误响应，状态码 500
      .json({ message: error.message, type: "Internal server error" }); // 错误信息
  }
}
