import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('age-verified');
    if (verified === 'true') {
      setIsVerified(true);
    } else {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('age-verified', 'true');
    setIsVerified(true);
    setIsOpen(false);
  };

  const handleDecline = () => {
    window.location.href = 'https://www.google.com';
  };

  if (isVerified || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 p-8 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-cyan-500/20">
            <AlertCircle className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-cyan-300">Age Verification</h1>
        </div>

        {/* Content */}
        <div className="mb-8 space-y-4">
          <p className="text-gray-300">
            HumaneBio sells research chemicals and supplements that are intended for adults only.
          </p>
          <p className="text-gray-400 text-sm">
            By entering this site, you confirm that you are at least 18 years old and agree to our terms of service.
          </p>
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <p className="text-orange-300 text-sm font-semibold">
              ⚠️ These products are for research purposes only and not intended for human consumption.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={handleDecline}
          >
            I'm Under 18
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-900 font-semibold"
            onClick={handleConfirm}
          >
            I'm 18+
          </Button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
        </p>
      </div>
    </div>
  );
}
