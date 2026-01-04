import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, ShieldCheck, MapPin, Smartphone, Mail, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [googleUser, setGoogleUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '', // Pre-fill
    email: '', // Pre-fill, Read-only
    phone: '',
    address: '',
    nickname: '',
  });
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load Google User Data
  useEffect(() => {
      const storedUser = localStorage.getItem('googleUser');
      if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setGoogleUser(parsed);
          setFormData(prev => ({
              ...prev,
              name: parsed.name || '',
              email: parsed.email || '',
              nickname: parsed.name || ''
          }));
      } else {
          // No google user? Redirect to login
          navigate('/login');
      }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    setError('');
  };

  const handleVerification = () => {
      if (!formData.phone) {
          setError('휴대전화 번호를 입력해주세요.');
          return;
      }
      setIsVerifying(true);
      // Mock Verification
      setTimeout(() => {
          setIsVerifying(false);
          setIsVerified(true);
          alert('휴대전화 본인 인증이 완료되었습니다.');
      }, 1500);
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field Validation
    if (!formData.phone || !formData.address) {
        setError('필수 정보를 모두 입력해주세요.');
        return;
    }

    if (!isVerified) {
        setError('휴대전화 본인 인증을 완료해주세요.');
        return;
    }

    if (!agreeTerms || !agreePrivacy) {
        setError('필수 약관에 모두 동의해야 합니다.');
        return;
    }

    setIsLoading(true);

    const finalNickname = formData.nickname.trim() === '' ? formData.name : formData.nickname;

    // Mock Save Logic
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('hasCompletedOnboarding', 'true');
      alert(`환영합니다, ${finalNickname}님! 가입이 완료되었습니다.`);
      navigate('/dashboard');
    }, 1500);
  };

  if (!googleUser) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-8 font-sans">
      <Card className="w-full max-w-lg shadow-xl border-slate-200">
        <CardHeader className="space-y-1 bg-white rounded-t-xl border-b pb-6">
          <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20 border-4 border-green-50">
                  <AvatarImage src={googleUser.photoUrl} alt="Google Profile" />
                  <AvatarFallback>{googleUser.name?.[0]}</AvatarFallback>
              </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-slate-800">추가 정보 입력</CardTitle>
          <CardDescription className="text-center">
            원활한 서비스 이용을 위해 필수 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleComplete} className="grid gap-6">
            
            {/* 1. Basic Info (Read Only + Editable Nickname) */}
            <div className="grid gap-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-500">이름 (Google)</Label>
                        <Input id="name" value={formData.name} disabled className="bg-slate-50 text-slate-500" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-500">이메일 (Google)</Label>
                        <Input id="email" value={formData.email} disabled className="bg-slate-50 text-slate-500" />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <Label htmlFor="nickname">닉네임</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input id="nickname" placeholder={formData.name} className="pl-9" value={formData.nickname} onChange={handleChange} />
                    </div>
                    <p className="text-[11px] text-slate-400">커뮤니티 활동 시 사용될 이름입니다.</p>
                 </div>
            </div>

            {/* 2. Verification */}
            <div className="space-y-4 border-y py-6 border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-indigo-600" /> 본인 인증 (필수)
                </h3>
                
                <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                         <Label htmlFor="phone">휴대전화 번호 <span className="text-red-500">*</span></Label>
                         <div className="relative">
                            <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input 
                                id="phone" 
                                placeholder="010-0000-0000" 
                                className="pl-9"
                                value={formData.phone} 
                                onChange={handleChange}
                                disabled={isVerified} 
                            />
                         </div>
                    </div>
                    <Button 
                        type="button" 
                        variant={isVerified ? "outline" : "secondary"}
                        className={`min-w-[80px] ${isVerified ? 'border-green-500 text-green-600 bg-green-50' : ''}`}
                        onClick={handleVerification}
                        disabled={isVerified || isVerifying}
                    >
                        {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : isVerified ? <CheckCircle2 className="h-4 w-4" /> : '인증요청'}
                    </Button>
                </div>
                {isVerified && <p className="text-xs text-green-600 font-medium">✨ 본인 인증이 완료되었습니다.</p>}
            </div>

            {/* 3. Address */}
            <div className="space-y-2">
                <Label htmlFor="address">농장 주소 / 거주지 <span className="text-red-500">*</span></Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input id="address" placeholder="시/군/구 동/읍/면 까지 입력" className="pl-9" value={formData.address} onChange={handleChange} />
                </div>
            </div>

            {/* 4. Terms */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                    <Checkbox id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                    <div className="flex items-center flex-1 justify-between">
                         <Label htmlFor="terms" className="text-sm font-medium text-slate-700 cursor-pointer">이용약관 동의 (필수)</Label>
                         <Dialog>
                            <DialogTrigger asChild>
                                <button type="button" className="text-xs text-slate-500 underline">내용보기</button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[80vh]">
                                <DialogHeader>
                                    <DialogTitle>서비스 이용약관</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[300px] w-full rounded-md border p-4 text-sm text-slate-600">
                                    <p className="mb-4">제 1 조 (목적)... (Google 계정 연동 포함)...</p>
                                </ScrollArea>
                            </DialogContent>
                         </Dialog>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="privacy" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} />
                     <div className="flex items-center flex-1 justify-between">
                         <Label htmlFor="privacy" className="text-sm font-medium text-slate-700 cursor-pointer">개인정보 수집 및 이용 동의 (필수)</Label>
                         <Dialog>
                            <DialogTrigger asChild>
                                <button type="button" className="text-xs text-slate-500 underline">내용보기</button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[80vh]">
                                <DialogHeader>
                                    <DialogTitle>개인정보 처리방침</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-[300px] w-full rounded-md border p-4 text-sm text-slate-600">
                                    <p className="mb-4">수집 항목: Google 프로필 정보(이름, 이메일, 프로필 사진), 전화번호, 주소...</p>
                                </ScrollArea>
                            </DialogContent>
                         </Dialog>
                    </div>
                </div>
            </div>

            {error && <p className="text-sm text-red-500 font-medium text-center bg-red-50 p-2 rounded">{error}</p>}

            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-base font-bold shadow-md" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              설정 완료 및 시작하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
