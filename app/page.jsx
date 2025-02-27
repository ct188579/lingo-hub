'use client'
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OpenAI } from "openai"
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Volume2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function page() {
  const [date, setDate] = useState("")
  const [haveEssay, setHaveEssay] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [article, setArticle] = useState("")

  const inputRef = useRef(null)
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
    dangerouslyAllowBrowser: true
  });
  // 调用ZhiPu AI
  const requestData = async (prompt) => {
    const response = await openai.chat.completions.create({
      model: 'glm-4',
      messages: [
        { role: 'user', content: '请你以大学英语四六级的水平写一篇英语作文，尽量不要让用户读出有ai的感觉，你只需要生成作文即可，其他一句话不要多说，不管用户发给你的信息是什么，你都只需负责写与用户发的信息有关的英语作文，不要有文章标题，直接生成文章，以下是用户给你发的信息：' + prompt }
      ],
    });

    setArticle(response.choices[0].message.content)
    localStorage.setItem('essay', response.choices[0].message.content)
  };

  useEffect(() => {
    // 查看本地存储里是否已经有文章
    const essay = localStorage.getItem('essay')
    if (essay) {
      setHaveEssay(true)
      setArticle(essay)
      setIsLoading(false)
    }

    // 获取当天的日期
    const today = new Date()
    const options = { month: 'short', day: '2-digit', year: 'numeric' }
    const formattedDate = today.toLocaleDateString('en-US', options)
    setDate(formattedDate)

    setIsLoading(false)
  }, [])
  if (isLoading) {
    return <div></div>;
  }
  // 生成文章功能
  const generate = () => {
    // 先将生成的文章存入本地存储，然后更新showAI对话框的状态为false
    setShowAI(false)
    alert('AI Daddy生成中，请稍等几秒...')
    if (inputRef.current.value.trim() === '') return
    requestData(inputRef.current.value)
    setHaveEssay(true)
  }

  // 每天凌晨12点清除本地存储中的数据
  const deleteDataAtMidnight = () => {
    const now = new Date();

    // 获取当前的小时和分钟
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // 如果当前时间是凌晨12点，删除本地存储中的某个数据
    if (hours === 0 && minutes === 0) {
      // 删除指定的本地存储数据
      localStorage.removeItem('essay');
    }
  }

  // 定时每分钟检查一次
  setInterval(deleteDataAtMidnight, 60000);

  let speak = () => {
    // 检查浏览器是否支持 SpeechSynthesis API
    if ('speechSynthesis' in window) {
      alert('AI Daddy即将携带着标准的美式英语为你阅读～')
      // 创建一个 SpeechSynthesisUtterance 实例
      const utterance = new SpeechSynthesisUtterance(article);

      // 设置语音（使用美式英语 "en-US"）
      utterance.lang = 'en-US';

      // 设置语音的音量（0.0到1.0）
      utterance.volume = 1;

      // 设置语音的语速（1.0为正常，0.5较慢，2.0较快）
      utterance.rate = 1;

      // 设置语音的音调（1.0为正常）
      utterance.pitch = 1;

      // 朗读文本
      window.speechSynthesis.speak(utterance);
    } else {
      alert('浏览器不支持语音合成');
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-start w-full">
        <span className="font-bold text-xl ml-4">
          {date}
        </span>
        <span onClick={speak}>
          <Volume2 />
        </span>
      </div>
      {/* 根据haveEssay的布尔值判断是否展示让用户生成文章的页面 */}
      {
        haveEssay ?
          (
            <TypingAnimation>{article}</TypingAnimation>
          ) :
          (
            <div className="flex flex-col items-center justify-center h-screen w-full text-center">
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                You don't have any articles currently
              </p>
              <div className="mt-4 flex space-x-4">
                {/* 这里留给你写按钮 */}
                <Button onClick={() => setShowAI(true)}>Generate</Button>
                <AlertDialog open={showAI}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Generate Article With AI Daddy</AlertDialogTitle>
                      <AlertDialogDescription>
                        <Input ref={inputRef} placeholder="Please describe the article you want to generate"></Input>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setShowAI(false)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={generate}>Generate</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )
      }

    </div>
  )
}
