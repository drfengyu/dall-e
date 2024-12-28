import cn from "classnames"; // 导入 classnames 库，用于动态生成 class 名称
import Head from "next/head"; // 导入 Next.js 的 Head 组件，用于修改页面头部信息
import Image from "next/image"; // 导入 Next.js 的 Image 组件，用于优化图片加载
import { useState } from "react"; // 导入 React 的 useState 钩子
import { toast, Toaster } from "react-hot-toast"; // 导入 react-hot-toast 库，用于显示通知
import { useInterval } from "../utils/use-interval"; // 导入自定义的 useInterval 钩子

export default function Home() {
  // 定义组件状态
  const [prompt, setPrompt] = useState(""); // 用于存储用户输入的提示词
  const [loading, setLoading] = useState(false); // 用于指示是否正在加载
  const [messageId, setMessageId] = useState(""); // 用于存储生成图片的消息 ID
  const [image, setImage] = useState(null); // 用于存储生成的图片
  const [canShowImage, setCanShowImage] = useState(false); // 用于指示是否可以显示图片

  // 使用自定义的 useInterval 钩子定期轮询生成图片的状态
  useInterval(
    async () => {
      const res = await fetch(`/api/poll?id=${messageId}`); // 发送请求获取图片生成状态
      const json = await res.json(); // 解析响应 JSON
      if (res.status === 200) { // 如果请求成功
        setLoading(false); // 停止加载
        setImage(json.data[0].url); // 设置图片 URL
      }
    },
    loading ? 5000 : null // 如果正在加载，每秒轮询一次
  );

  // 处理表单提交
  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // 阻止默认表单提交行为
    setLoading(true); // 设置加载状态
    toast("Generating your image...", { position: "top-center" }); // 显示通知
    const response = await fetch(`/api/image?prompt=${prompt}`); // 发送请求生成图片
    const json = await response.json(); // 解析响应 JSON
    setMessageId(json.id); // 设置消息 ID
  }

  const showLoadingState = loading || (image && !canShowImage); // 判断是否显示加载状态

  console.log(image); // 输出图片 URL 到控制台

  // 渲染组件
  return (
    <>
      <Head>
        <title>Dall-E 2 AI Image Generator</title> {/* 设置页面标题 */}
      </Head>
      <div className="antialiased mx-auto px-4 py-20 h-screen bg-gray-100">
        <Toaster /> {/* 渲染通知容器 */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl tracking-tighter pb-10 font-bold text-gray-800">
            Dall-E 2 image generator
          </h1> {/* 标题 */}
          <form
            className="flex w-full sm:w-auto flex-col sm:flex-row mb-10"
            onSubmit={submitForm} // 处理表单提交
          >
            <input
              className="shadow-sm text-gray-700 rounded-sm px-3 py-2 mb-4 sm:mb-0 sm:min-w-[600px]"
              type="text"
              placeholder="Prompt for DALL-E"
              onChange={(e) => setPrompt(e.target.value)} // 更新提示词
            />
            <button
              className="min-h-[40px] shadow-sm sm:w-[100px] py-2 inline-flex justify-center font-medium items-center px-4 bg-green-600 text-gray-100 sm:ml-2 rounded-md hover:bg-green-700"
              type="submit"
            >
              {showLoadingState && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle> {/* 加载动画 */}
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {!showLoadingState ? "Generate" : ""} {/* 按钮文本 */}
            </button>
          </form>
          <div className="relative flex w-full items-center justify-center">
            <div className="w-full sm:w-[400px] h-[400px] rounded-md shadow-md relative">
              <img
                alt={`Dall-E representation of: ${prompt}`}
                className={cn("rounded-md shadow-md h-full object-cover", {
                  "opacity-100": canShowImage,
                })}
                // src={image}
                src={`data:image/png;base64,${image}`}
              />
            </div>
9
            <div
              className={cn(
                "w-full sm:w-[400px] absolute top-0.5 overflow-hidden rounded-2xl bg-white/5 shadow-xl shadow-black/5",
                {
                  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-500/10 before:to-transpa[...]":
                    showLoadingState,
                  "opacity-0 shadow-none": canShowImage,
                }
              )}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
