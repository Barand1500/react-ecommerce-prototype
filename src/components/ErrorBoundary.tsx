import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  private copyErrorDetails = async () => {
    const { error, errorInfo } = this.state;
    const errorText = `
Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace'}
Component Stack: ${errorInfo?.componentStack || 'No component stack'}
Time: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, showDetails, copied } = this.state;

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="w-full max-w-lg"
          >
            {/* Main Error Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* Error Header */}
              <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center"
                  >
                    <AlertTriangle size={32} />
                  </motion.div>
                  <div>
                    <h1 className="text-2xl font-bold">Bir Sorun Oluştu</h1>
                    <p className="text-white/80 text-sm mt-1">
                      Üzgünüz, beklenmeyen bir hata meydana geldi
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Content */}
              <div className="p-6 space-y-4">
                {/* Error Message */}
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <Bug className="text-red-500 mt-0.5 shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-400">
                        {error?.name || 'Error'}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                        {error?.message || 'Bilinmeyen bir hata oluştu'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={this.handleRetry}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    <RefreshCw size={18} />
                    Tekrar Dene
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={this.handleGoHome}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    <Home size={18} />
                    Ana Sayfa
                  </motion.button>
                </div>

                {/* Technical Details Toggle */}
                <button
                  onClick={this.toggleDetails}
                  className="w-full flex items-center justify-between text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 py-2 px-1 transition-colors"
                >
                  <span className="text-sm font-medium">Teknik Detaylar</span>
                  {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {/* Technical Details Content */}
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {/* Stack Trace */}
                    <div className="bg-slate-950 rounded-xl p-4 overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500 font-mono">Stack Trace</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={this.copyErrorDetails}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        </motion.button>
                      </div>
                      <pre className="text-xs text-red-400 font-mono overflow-x-auto max-h-40 custom-scrollbar">
                        {error?.stack || 'No stack trace available'}
                      </pre>
                    </div>

                    {/* Component Stack */}
                    {errorInfo?.componentStack && (
                      <div className="bg-slate-950 rounded-xl p-4 overflow-hidden">
                        <span className="text-xs text-slate-500 font-mono block mb-2">Component Stack</span>
                        <pre className="text-xs text-amber-400 font-mono overflow-x-auto max-h-32 custom-scrollbar">
                          {errorInfo.componentStack}
                        </pre>
                      </div>
                    )}

                    {/* Debug Info */}
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <p><strong>URL:</strong> {window.location.href}</p>
                      <p><strong>Zaman:</strong> {new Date().toLocaleString('tr-TR')}</p>
                      <p><strong>Tarayıcı:</strong> {navigator.userAgent.slice(0, 100)}...</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Bu hata otomatik olarak kaydedildi. Sorun devam ederse lütfen{' '}
                  <a href="/faq" className="text-blue-600 hover:underline">destek</a> ile iletişime geçin.
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600"
                />
              ))}
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
