import React, { useState } from 'react';
import { X, HandHeart, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface VolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVolunteerComplete?: (data: any) => void;
}

export const VolunteerModal: React.FC<VolunteerModalProps> = ({ isOpen, onClose, onVolunteerComplete }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Columbia, MS',
    interests: [] as string[],
    availability: 'Weekends',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const roles = [
    { id: 'prison', label: 'Prison & Reentry Mentorship', desc: 'Visiting facilities and supporting returning citizens' },
    { id: 'banquet', label: 'Community Dinners & Meal Prep', desc: 'Cooking, table dressing, and serving meals' },
    { id: 'youth', label: 'Youth Program Mentoring', desc: 'Tutoring and mentoring youth in Marion County' },
    { id: 'mombasa', label: 'Kenya Mission Supply Packs', desc: 'Sorting school supplies & hygiene packs' },
    { id: 'prayer', label: 'Intercessory Prayer Team', desc: 'Praying over community petitions' }
  ];

  const toggleInterest = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(item => item !== id)
        : [...prev.interests, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setSubmitting(true);
    try {
      const saved = await api.submitVolunteer({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        interests: formData.interests,
        availability: formData.availability,
        notes: formData.notes
      });
      setSubmitted(true);
      if (onVolunteerComplete) {
        onVolunteerComplete(saved);
      }
    } catch (err) {
      console.error('Failed to submit volunteer application:', err);
      setSubmitted(true); // Graceful fallback
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      city: 'Columbia, MS',
      interests: [],
      availability: 'Weekends',
      notes: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#FDFCFB] rounded-3xl shadow-xl border border-[#E8E2D8] overflow-hidden my-8">
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#E8E2D8]">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#002366]">Volunteer with Safe Haven</h3>
            <p className="text-xs text-[#1A1A1A]/60">Columbia, MS & Outreach Programs</p>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-full text-[#1A1A1A]/40 hover:text-[#1A1A1A] hover:bg-[#F5F2ED] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#002366]">
                Thank You for Serving!
              </h4>
              <p className="text-xs text-[#1A1A1A]/70 max-w-md mx-auto leading-relaxed">
                Thank you, {formData.fullName}. Our outreach team will reach out to you at {formData.phone || formData.email} shortly.
              </p>
              <div className="bg-[#F5F2ED] border border-[#E8E2D8] p-4 rounded-2xl text-left text-xs">
                <p className="font-serif italic text-[#1A1A1A]/80">
                  “When you give your time to lift the lowest, God elevates your territory. We cannot wait to serve beside you.”
                </p>
                <p className="font-semibold text-[#002366] mt-1">— Ella Ruth Johnson</p>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white text-xs font-medium transition-colors border border-[#D4AF37]/30"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sister Angela"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                  />
                </div>
                <div>
                  <label className="block text-[#1A1A1A] font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(601) 555-0199"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="angela@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                />
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-medium mb-1.5">Where would you love to help?</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {roles.map(role => {
                    const isChecked = formData.interests.includes(role.id);
                    return (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => toggleInterest(role.id)}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                          isChecked
                            ? 'border-[#002366] bg-[#F5F2ED]'
                            : 'border-[#E8E2D8] bg-white hover:bg-[#F5F2ED]/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="mt-0.5 rounded text-[#002366] focus:ring-[#002366]"
                        />
                        <div>
                          <div className="font-semibold text-[#002366]">{role.label}</div>
                          <div className="text-[11px] text-[#1A1A1A]/60">{role.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[#1A1A1A] font-medium mb-1">Availability</label>
                <select
                  value={formData.availability}
                  onChange={e => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8E2D8] text-[#1A1A1A] bg-white focus:outline-hidden focus:border-[#002366]"
                >
                  <option value="Weekends">Weekends (Community Dinners & Events)</option>
                  <option value="Weekdays">Weekdays (Pantry & Administrative)</option>
                  <option value="Evenings">Evenings (Tutoring & Prayer Line)</option>
                  <option value="Flexible">Flexible / On-Call As Needed</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-6 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center gap-2 border border-[#D4AF37]/30"
                >
                  <HandHeart className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Submit Volunteer Interest</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
