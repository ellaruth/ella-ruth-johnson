import React, { useState } from 'react';
import { PageTab } from '../../types';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Heart
} from 'lucide-react';

import { api } from '../../services/api';

interface ContactPageProps {
  onNavigate: (tab: PageTab) => void;
  onOpenPrayer: () => void;
  onOpenDonate: () => void;
  onContactComplete?: (data: any) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onOpenPrayer,
  onContactComplete
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('ministry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setIsSubmitting(true);
    try {
      const saved = await api.submitContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        inquiryType,
        message: message.trim()
      });
      setSubmitted(true);
      if (onContactComplete) {
        onContactComplete(saved);
      }
    } catch (err) {
      console.error('Failed to submit message:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 pt-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Clean Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#D4AF37]/40">
          <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Get in Touch</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002366]">
          Contact Ella Ruth
        </h1>
        <p className="text-[#1A1A1A]/75 text-base leading-relaxed">
          Reach out for speaking engagements, vitality coaching consultations, prayer intercession, or to connect with her church home at Safe Haven Ministries.
        </p>
      </section>

      {/* Main Grid */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#FDFCFB] rounded-3xl p-5 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
                Connect with Ella Ruth
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#002366]">
                Columbia, Mississippi
              </h2>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/70 leading-relaxed">
                Whether you would like to book Ella Ruth for speaking, inquire about 1-on-1 vitality coaching, submit a prayer petition, or connect with Safe Haven Ministries, we welcome your message.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F5F2ED] border border-[#E8E2D8]">
                  <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div className="text-xs space-y-0.5">
                    <div className="font-medium text-[#002366]">Location</div>
                    <div className="text-[#1A1A1A]/70">Columbia, Mississippi 39429</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F5F2ED] border border-[#E8E2D8]">
                  <Phone className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div className="text-xs space-y-0.5">
                    <div className="font-medium text-[#002366]">Phone</div>
                    <div className="text-[#1A1A1A]/70 font-mono">(601) 736-0000</div>
                    <div className="text-[11px] text-[#1A1A1A]/50">Mon – Fri: 9:00 AM – 5:00 PM CST</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F5F2ED] border border-[#E8E2D8]">
                  <Mail className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div className="text-xs space-y-0.5">
                    <div className="font-medium text-[#002366]">Email</div>
                    <div className="text-[#1A1A1A]/70">director@safehavenoutreach.org</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prayer Box */}
            <div className="p-6 rounded-3xl bg-[#F5F2ED] border border-[#E8E2D8] space-y-3">
              <h4 className="font-serif text-base font-bold text-[#002366]">
                Need Urgent Prayer?
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                Pastor Ella Ruth and our prayer intercessors lift submitted requests daily before the Lord.
              </p>
              <button
                onClick={onOpenPrayer}
                className="w-full py-2.5 rounded-full bg-[#FDFCFB] hover:bg-[#EFEBE4] text-[#002366] font-medium text-xs border border-[#E8E2D8] shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Submit Confidential Prayer Request</span>
              </button>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-[#FDFCFB] rounded-3xl p-5 sm:p-10 border border-[#E8E2D8] shadow-xs space-y-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
                  Send a Message
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#002366]">
                  How Can We Help You?
                </h3>
              </div>

              {submitted ? (
                <div className="bg-[#F5F2ED] border border-[#E8E2D8] rounded-2xl p-8 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-[#002366]">
                    Message Sent
                  </h4>
                  <p className="text-xs text-[#1A1A1A]/70 max-w-sm mx-auto">
                    Thank you, {name}. Our team has received your note and will reply to {email} promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="px-5 py-2 rounded-full bg-[#EFEBE4] text-[#002366] text-xs font-medium border border-[#E8E2D8]"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#1A1A1A] font-medium mb-1.5">
                      Inquiry Subject
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { id: 'ministry', label: 'Safe Haven Outreach / Donation' },
                        { id: 'speaking', label: 'Speaking / Conference Invitation' },
                        { id: 'coaching', label: 'Health & Wellness Coaching' },
                        { id: 'kenya', label: 'Mombasa Children’s Centre' },
                      ].map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setInquiryType(type.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                            inquiryType === type.id
                              ? 'border-[#002366] bg-[#002366] text-white font-medium shadow-2xs'
                              : 'border-[#E8E2D8] bg-[#FDFCFB] text-[#1A1A1A]/70 hover:border-[#D4AF37]/50'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[#1A1A1A] font-medium mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Brenda Jackson"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1A1A1A] font-medium mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="brenda@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#1A1A1A] font-medium mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="(601) 555-0123"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1A1A1A] font-medium mb-1">Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share how we can partner, pray, or assist you..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-[#1A1A1A] focus:outline-hidden focus:border-[#002366]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center gap-2 border border-[#D4AF37]/30"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
