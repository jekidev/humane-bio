import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const hasVerified = localStorage.getItem('ageVerified');
    if (!hasVerified) {
      setIsOpen(true);
    }
  }, []);

  const handleAgree = () => {
    if (isAgreed) {
      localStorage.setItem('ageVerified', 'true');
      setIsOpen(false);
    }
  };

  const handleDisagree = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="w-8 h-8 text-black" />
          <h2 className="text-2xl font-bold text-black">Age Verification</h2>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <p className="text-gray-700">
            HumaneBio contains information about research chemicals and nootropics. This content is intended for adults only.
          </p>
          <p className="text-gray-700">
            By entering this site, you confirm that you are:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-black font-bold mt-1">•</span>
              <span>At least 18 years of age</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black font-bold mt-1">•</span>
              <span>Legally permitted to access this content in your jurisdiction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black font-bold mt-1">•</span>
              <span>Responsible for your own health and legal compliance</span>
            </li>
          </ul>
        </div>

        {/* Agreement Checkbox */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            onClick={() => setIsAgreed(!isAgreed)}
          >
            <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
              isAgreed 
                ? 'bg-black border-black' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              {isAgreed && <CheckCircle2 className="w-5 h-5 text-white" />}
            </div>
            <span className="text-sm font-medium text-gray-700">
              I confirm that I am 18 years or older and agree to the terms above
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleDisagree}
            variant="outline"
            className="flex-1 border-gray-300 text-black hover:bg-gray-100"
          >
            I Disagree
          </Button>
          <Button
            onClick={handleAgree}
            disabled={!isAgreed}
            className="flex-1 bg-black text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            I Agree & Enter
          </Button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mt-6 text-center">
          This site is for informational purposes only. Always consult with healthcare professionals before using any supplements or research chemicals.
        </p>
      </div>
    </div>
  );
}
