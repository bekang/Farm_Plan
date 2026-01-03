import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sprout } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { QnaService } from '@/services/qnaService';
import type { ChatMessage } from '@/types';

interface QnaChatProps {
  hideHeader?: boolean;
  className?: string;
}

export function QnaChat({ hideHeader = false, className }: QnaChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'system',
      text: '안녕하세요! 농부님의 비서입니다. 무엇을 도와드릴까요?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const qnaService = useRef(new QnaService());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await qnaService.current.ask(userMsg.text);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'system',
          text: '죄송합니다. 오류가 발생했습니다.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card
      className={`flex h-[600px] flex-col ${hideHeader ? 'h-full border-0 shadow-none' : ''} ${className}`}
    >
      {/* Header Only if not hidden */}
      {!hideHeader && (
        <CardHeader className="border-b pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            농부의 비서
            <Badge variant="secondary" className="ml-auto text-xs">
              Beta
            </Badge>
          </CardTitle>
        </CardHeader>
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {/* ... existing code ... */}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={msg.role === 'user' ? '' : '/bot-avatar.png'} />
                <AvatarFallback className={msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}>
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Bot className="h-4 w-4 text-green-600" />
                  )}
                </AvatarFallback>
              </Avatar>

              {/* ... content ... */}
              <div className={`max-w-[80%] space-y-2`}>
                <div
                  className={`rounded-lg p-3 text-sm ${
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className="min-h-[1.2em]">
                      {line}
                    </p>
                  ))}
                </div>

                {/* Evidence Card */}
                {msg.data && msg.data.result && (
                  <div className="space-y-2 rounded-md border bg-card p-3 text-xs shadow-sm">
                    {/* ... evidence details ... */}
                    <div className="flex items-center gap-1 font-semibold">
                      <Sprout className="h-3 w-3" /> 근거 데이터
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded bg-slate-50 p-2">
                        <span className="text-muted-foreground">작물</span>
                        <div className="font-medium">{msg.data.field.crop}</div>
                      </div>
                      <div className="rounded bg-slate-50 p-2">
                        <span className="text-muted-foreground">면적</span>
                        <div className="font-medium">{msg.data.field.area}평</div>
                      </div>
                    </div>
                    <div className="mt-2 border-t pt-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span>질소(N)</span>
                        <span className="font-bold text-blue-600">{msg.data.result.n}kg</span>
                      </div>
                      <div className="mb-1 flex items-center justify-between">
                        <span>인산(P)</span>
                        <span className="font-bold text-orange-600">{msg.data.result.p}kg</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>칼륨(K)</span>
                        <span className="font-bold text-purple-600">{msg.data.result.k}kg</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-100">
                  <Bot className="h-4 w-4 text-green-600" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
                <span className="animate-pulse">답변 생성 중...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-background p-3">
        <form
          className="flex gap-2"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            placeholder="예: 내 고추밭 비료 얼마나 줘야 해?"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-slate-100"
            onClick={() => setInput('내 고추밭 비료 추천해줘')}
          >
            💊 비료 추천
          </Badge>
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-slate-100"
            onClick={() => setInput('전체 농지 요약해줘')}
          >
            🏡 농지 상태
          </Badge>
        </div>
      </div>
    </Card>
  );
}
