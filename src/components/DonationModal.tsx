import React, { useState, useEffect } from 'react';
import { DONATION_FUNDS } from '../data/initialData';
import { 
  X, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Sparkles,
  Lock
} from 'lucide-react';

import { api } from '../services/api';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFundId?: string;
  onDonationComplete?: (receipt: any) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  initialFundId,
  onDonationComplete
}) => {
  const [selectedFundId, setSelectedFundId] = useState(initialFundId || 'fund-general');
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [dedicationNote, setDedicationNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedReceipt, setCompletedReceipt] = useState<{
    receiptId: string;
    amount: number;
    fundName: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    if (initialFundId) {
      setSelectedFundId(initialFundId);
    }
  }, [initialFundId]);

  if (!isOpen) return null;

  const currentFund = DONATION_FUNDS.find(f => f.id === selectedFundId) || DONATION_FUNDS[0];
  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount <= 0) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const result = await api.submitDonation({
        fundId: currentFund.id,
        fundName: currentFund.name,
        amount: effectiveAmount,
        frequency,
        donorName: donorName.trim() || 'Generous Supporter',
        donorEmail: donorEmail.trim() || 'donor@safehaven.org',
        dedicationNote: dedicationNote.trim()
      });

      setCompletedReceipt({
        receiptId: result.receiptId,
        amount: result.amount,
        fundName: result.fundName,
        date: result.dateStr
      });

      if (onDonationComplete) {
        onDonationComplete(result);
      }
    } catch (err: any) {
      console.error('Donation processing error:', err);
      setErrorMessage(err.message || 'Error processing gift. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setCompletedReceipt(null);
    setDonorName('');
    setDonorEmail('');
    setCustomAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#FDFCFB] rounded-3xl shadow-xl border border-[#E8E2D8] overflow-hidden my-8">
        {/* Modal Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#E8E2D8]">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#002366]">
              Support Safe Haven Ministries
            </h3>
            <p className="text-xs text-[#1A1A1A]/60">
              501(c)(3) Tax-Deductible Donation • Columbia, MS
            </p>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#F5F2ED] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {completedReceipt ? (
            /* Success Receipt Screen */
            <div className="text-center py-2 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-serif text-2xl font-bold text-[#002366]">
                  Thank You for Your Support!
                </h4>
                <p className="text-xs text-[#1A1A1A]/70 mt-1">
                  Ella Ruth and our community outreach partners are grateful for your generosity.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-[#F5F2ED] border border-[#E8E2D8] rounded-2xl p-5 text-left space-y-2 text-xs">
                <div className="flex justify-between pb-2 border-b border-[#E8E2D8]">
                  <span className="text-[#1A1A1A]/60">Receipt Number</span>
                  <span className="font-mono font-bold text-[#002366]">{completedReceipt.receiptId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/60">Amount:</span>
                  <span className="font-bold text-[#002366]">${completedReceipt.amount.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/60">Designated Fund:</span>
                  <span className="font-medium text-[#1A1A1A] text-right max-w-[220px]">{completedReceipt.fundName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1A1A1A]/60">Frequency:</span>
                  <span className="font-medium text-[#1A1A1A] capitalize">{frequency === 'monthly' ? 'Monthly Partner' : 'One-Time Gift'}</span>
                </div>
              </div>

              <div className="bg-[#F5F2ED] border border-[#E8E2D8] rounded-2xl p-4 text-left">
                <p className="font-serif italic text-[#1A1A1A]/80 text-xs leading-relaxed">
                  “May God multiply every seed sown back into your household. You are helping us keep hope alive!”
                </p>
                <p className="text-xs text-[#002366] font-semibold mt-1">
                  — Pastor Ella Ruth Johnson
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={resetForm}
                  className="w-full py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white text-xs font-medium transition-colors border border-[#D4AF37]/30"
                >
                  Return to Website
                </button>
              </div>
            </div>
          ) : (
            /* Donation Input Form */
            <form onSubmit={handleDonate} className="space-y-4 text-xs">
              {/* Frequency Toggle */}
              <div className="flex bg-[#F5F2ED] p-1 rounded-full border border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setFrequency('once')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all ${
                    frequency === 'once'
                      ? 'bg-[#002366] text-white shadow-xs'
                      : 'text-[#1A1A1A]/70 hover:text-[#002366]'
                  }`}
                >
                  One-Time Gift
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-full transition-all flex items-center justify-center gap-1.5 ${
                    frequency === 'monthly'
                      ? 'bg-[#002366] text-white shadow-xs'
                      : 'text-[#1A1A1A]/70 hover:text-[#002366]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Monthly Partner</span>
                </button>
              </div>

              {/* Fund Designation Selector */}
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                  Designate Your Gift:
                </label>
                <select
                  value={selectedFundId}
                  onChange={(e) => {
                    setSelectedFundId(e.target.value);
                    const found = DONATION_FUNDS.find(f => f.id === e.target.value);
                    if (found) setSelectedAmount(found.defaultAmount);
                  }}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#002366] bg-white"
                >
                  {DONATION_FUNDS.map((fund) => (
                    <option key={fund.id} value={fund.id}>
                      {fund.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-[#1A1A1A]/60">
                  {currentFund.impactQuote}
                </p>
              </div>

              {/* Amount Presets */}
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A] mb-1">
                  Select Amount:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {currentFund.suggestedAmounts.map((amt) => {
                    const isSelected = selectedAmount === amt && !customAmount;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#002366] text-white shadow-2xs'
                            : 'bg-[#F5F2ED] border border-[#E8E2D8] text-[#002366] hover:bg-[#EFEBE4]'
                        }`}
                      >
                        ${amt}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input */}
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1A1A1A]/40">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="number"
                    min="5"
                    step="1"
                    placeholder="Other dollar amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-hidden focus:border-[#002366] bg-white"
                  />
                </div>
              </div>

              {/* Donor Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Joyce Daniels"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-hidden focus:border-[#002366] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">
                    Email for Receipt:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="joyce@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-hidden focus:border-[#002366] bg-white"
                  />
                </div>
              </div>

              {/* Dedication Note */}
              <div>
                <label className="block text-[#1A1A1A] font-medium mb-1">
                  Dedication or Prayer Note (Optional):
                </label>
                <input
                  type="text"
                  placeholder="In honor of..., or prayer request"
                  value={dedicationNote}
                  onChange={(e) => setDedicationNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D8] text-xs text-[#1A1A1A] placeholder-[#1A1A1A]/40 focus:outline-hidden focus:border-[#002366] bg-white"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || effectiveAmount <= 0}
                  className="w-full py-3 px-6 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-[#D4AF37]/30"
                >
                  {isProcessing ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      <span>
                        Give ${effectiveAmount} {frequency === 'monthly' ? '/ month' : ''}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-3 text-[11px] text-[#1A1A1A]/50 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Tax-Deductible 501(c)(3)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#1A1A1A]/40" />
                  Secure
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
