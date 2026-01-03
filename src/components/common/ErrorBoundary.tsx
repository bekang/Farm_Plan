import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="m-4 rounded-xl border border-red-100 bg-red-50 p-6 text-center shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="mb-2 text-lg font-bold text-red-800">이 기능에 문제가 발생했습니다.</h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-red-600">
            일시적인 오류이거나 작업 중인 내용일 수 있습니다.
            <br />
            다른 메뉴는 정상적으로 이용 가능합니다.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              <RefreshCcw className="h-4 w-4" />
              페이지 새로고침
            </button>
            <button
              onClick={() => {
                if (confirm('모든 저장된 데이터를 삭제하고 초기화하시겠습니까? (복구 불가)')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              <ShieldAlert className="h-4 w-4" />
              데이터 초기화 (복구)
            </button>
          </div>
          {this.state.error && (
            <details className="mt-6 max-h-40 overflow-auto rounded border border-red-100 bg-white p-3 text-left text-xs text-red-400">
              <summary className="mb-1 cursor-pointer font-medium">
                에러 상세 내용 (개발자용)
              </summary>
              {this.state.error.toString()}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
