import { FormEvent, RefObject, useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ChatCompletionResponseMessage } from "openai";

import MarkdownProvider from "../components/MarkdownProvider";
import { UserButton, useAuth, useUser } from "@clerk/clerk-react";

const useScrollToBottom = (ref: RefObject<any>, ...deps: any[]) => {
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [...deps]);
};

const ChatPage = () => {
  const [value, setValue] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<ChatCompletionResponseMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isToggle, setIsToggle] = useState(false);

  const { user } = useUser();

  const { getToken } = useAuth();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useScrollToBottom(messagesEndRef, value, isProcessing);

  useEffect(() => {
    if (currentMessage === "") return;
    setIsProcessing(false);
    setMessages((prevState) => [
      ...prevState,
      { role: "assistant", content: currentMessage },
    ]);
    setCurrentMessage("");
  }, [isToggle]);

  const handleChatCompletion = async (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() == "") {
      return;
    }
    setValue("");
    setIsProcessing(true);
    setMessages((prevState) => [
      ...prevState,
      { role: "user", content: value },
    ]);
    const data = {
      model: "gpt-3.5-turbo",
      messages: [...messages, { role: "user", content: value }],
      stream: true,
    };
    await fetchEventSource(`https://proxy.dcopa.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
      body: JSON.stringify(data),
      onopen: async () => {
        setCurrentMessage("");
      },
      onmessage: (event) => {
        if (event.data === "[DONE]") {
          setIsToggle((pre) => !pre);
          return;
        }
        const response = JSON.parse(event.data);
        const token = response.choices[0].delta.content || "";
        setCurrentMessage((prevState) => prevState.concat(token));
      },
      onerror: (err) => {
        setIsProcessing(false);
        throw err;
      },
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="fixed bg-blue-500 w-full h-16 top-0 flex items-center justify-between px-4">
        <img className="w-10 h-10" src="/favicon.ico" alt="logo" />
        <h1 className="text-xl font-bold">NEAI</h1>
        <UserButton />
      </div>
      <div className="flex-1 overflow-y-auto py-16">
        {messages.map((message, index) => (
          <div
            key={index}
            className={classnames("w-full  items-start  py-3", {
              "bg-gray-200": message.role === "assistant",
              "bg-gray-100": message.role === "user",
            })}
          >
            <div className="flex flex-row gap-5 p-3">
              <img
                className="h-7 w-7 flex-none rounded-sm"
                src={
                  message.role === "assistant"
                    ? "/favicon.ico"
                    : user?.profileImageUrl
                }
                alt={message.role}
                draggable={false}
              />
              <div className="overflow-auto rounded-md">
                <MarkdownProvider content={message.content} />
              </div>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="w-full  items-start  bg-gray-200 py-3">
            <div className="flex flex-row gap-5 p-3">
              <img
                className="h-7 w-7 flex-none rounded-sm"
                src="/favicon.ico"
                alt="assistants"
                draggable={false}
              />
              <div className="overflow-auto rounded-md">
                <MarkdownProvider content={currentMessage} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleChatCompletion}
        className="fixed bg-gray-600 w-full bottom-0 flex h-16 items-center justify-between px-4"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mr-4 w-full rounded-lg bg-slate-200 p-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2  font-semibold transition-colors duration-200 ease-in-out hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
