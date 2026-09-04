import React from 'react';
import { PageTab } from '../../types';
import { LIFE_TIMELINE } from '../../data/initialData';
import { 
  Sparkles, 
  Heart, 
  BookOpen, 
  Plane, 
  ShoppingBag, 
  Utensils, 
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDonate: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenDonate }) => {
  return (
    <div className="space-y-16 sm:space-y-20 pb-20 pt-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Clean, Elegant Header */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] text-xs font-medium border border-[#D4AF37]/40">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>About Ella Ruth</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#002366]">
          An 85-Year Journey of Faith, Vitality & Sacred Purpose
        </h1>
        <p className="text-[#1A1A1A]/75 text-base leading-relaxed">
          Author, speaker, certified vitality coach, and devoted worshipper at Safe Haven Ministries in Columbia, Mississippi.
        </p>
      </section>

      {/* Main Story & Profile */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: In Her Own Words */}
        <div className="lg:col-span-7 bg-[#FDFCFB] rounded-3xl p-8 sm:p-10 border border-[#E8E2D8] shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              In Her Own Words
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366] leading-snug">
              “I refuse to slow down while there are still lives to be touched.”
            </h2>
          </div>

          <div className="text-sm text-[#1A1A1A]/75 leading-relaxed space-y-4">
            <p>
              People look at my birth certificate and see 85 years. But when I wake up before dawn in Columbia, Mississippi, I feel the same burning zeal in my bones that I did four decades ago. Age is not a slow retreat into a rocking chair; for a child of God, it is an accumulation of wisdom, stamina, and sacred purpose.
            </p>

            <p>
              When people ask what I do, I share that I wear three callings in one life: I am an <strong className="text-[#002366] font-semibold">author, faith teacher, and speaker</strong> sharing biblical wholeness through conferences like Divine Transformation; an <strong className="text-[#002366] font-semibold">85-year-young certified vitality and wellness coach</strong> inspiring men and women to nourish their temples with hydration, fresh food, and daily locomotion; and a <strong className="text-[#002366] font-semibold">devoted worshipper and servant at Safe Haven Ministries</strong>, lifting up local families and standing in fervent intercessory prayer.
            </p>

            {/* Sacred Thanksgiving callout */}
            <div className="bg-[#F5F2ED] border-l-4 border-[#D4AF37] p-5 rounded-xl space-y-1.5 my-4">
              <h3 className="font-serif text-sm font-semibold text-[#002366] flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#D4AF37]" />
                <span>Why Thanksgiving is Sacred Ground</span>
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 italic leading-relaxed">
                “Gathering children, grandchildren, seniors who have no one else, and returning inmates around one massive table loaded with turkey, greens, and thanksgiving to the Almighty — that is heaven on earth to me.”
              </p>
            </div>

            <p>
              Safe Haven Ministries has been my spiritual home and church community for decades. As a faithful worshipper there, I have seen God move through grassroots outreach, community feasts, and life-changing prayer across Mississippi and into Kenya.
            </p>
          </div>

          {/* Simple Joy Badges */}
          <div className="pt-4 border-t border-[#E8E2D8]">
            <div className="text-xs font-semibold text-[#1A1A1A]/60 uppercase tracking-wider mb-3">
              Personal Joys & Passions:
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] border border-[#E8E2D8] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                Avid Reader & Bible Student
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] border border-[#E8E2D8] flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-[#D4AF37]" />
                International Missionary (Kenya)
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] border border-[#E8E2D8] flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                Southern Style & Sunday Hats
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#F5F2ED] text-[#002366] border border-[#E8E2D8] flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#D4AF37]" />
                Community Feast Host
              </span>
            </div>
          </div>
        </div>

        {/* Right: Clean Portrait & Foundation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FDFCFB] rounded-3xl p-6 sm:p-7 border border-[#E8E2D8] shadow-xs space-y-5">
            <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-[#F5F2ED]">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=900&auto=format&fit=crop"
                alt="Pastor Ella Ruth Johnson"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#002366]">
                  Ella Ruth
                </h3>
                <span className="px-3 py-1 rounded-full bg-[#F5F2ED] text-[#002366] border border-[#D4AF37]/40 text-xs font-semibold">
                  85 Years Young
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#1A1A1A]/70 divide-y divide-[#E8E2D8]">
                <div className="flex justify-between pt-1">
                  <span className="text-[#1A1A1A]/55">Location:</span>
                  <span className="font-medium text-[#002366]">Columbia, MS (Marion County)</span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-[#1A1A1A]/55">Spiritual Home:</span>
                  <span className="font-medium text-[#002366]">Safe Haven Ministries (Worshipper)</span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-[#1A1A1A]/55">Vocation:</span>
                  <span className="font-medium text-[#002366]">Vitality Coach, Author & Speaker</span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-[#1A1A1A]/55">Mission Heart:</span>
                  <span className="font-medium text-[#002366]">Mombasa, Kenya School Feeding</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('coaching')}
                  className="w-full py-2.5 rounded-full bg-[#002366] hover:bg-[#001a4e] text-white font-medium text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 border border-[#D4AF37]/30"
                >
                  <span>Explore Her Vitality Plan</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
              </div>
            </div>
          </div>

          {/* Scripture Anchor Card */}
          <div className="bg-[#F5F2ED] rounded-2xl p-6 border border-[#E8E2D8] space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              Foundational Scripture
            </div>
            <blockquote className="font-serif italic text-sm text-[#002366] leading-relaxed">
              “Even to your old age and gray hairs I am He, I am He who will sustain you. I have made you and I will carry you; I will sustain you and I will rescue you.”
            </blockquote>
            <p className="text-xs text-[#1A1A1A]/60 font-medium pt-1">— Isaiah 46:4</p>
          </div>
        </div>
      </section>

      {/* Clean Timeline Section */}
      <section className="bg-[#FDFCFB] rounded-3xl p-8 sm:p-12 border border-[#E8E2D8] shadow-xs">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Decades of Faith
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002366]">
              Milestones Along the Way
            </h2>
          </div>

          <div className="space-y-6">
            {LIFE_TIMELINE.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-start gap-4 p-5 rounded-2xl bg-[#F5F2ED] border border-[#E8E2D8]">
                <span className="font-serif text-base font-bold text-[#002366] shrink-0 sm:w-24">
                  {item.year}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-[#002366] text-sm">
                      {item.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFEBE4] text-[#002366] font-medium border border-[#E8E2D8]">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
