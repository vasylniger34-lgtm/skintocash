import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';
import { REVIEWS_DATA } from '../data/reviewsData';
import { useLanguage } from '../context/LanguageContext';

export const TrustpilotReviews: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="reviews-section" className="py-24 sm:py-32 bg-[#070A0E] border-t border-white/[0.06] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-['JetBrains_Mono'] font-bold mb-3">
              <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              {t('reviews.badge')}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight mb-2">
              {t('reviews.title')}
            </h2>
            <p className="text-sm text-slate-300">
              {t('reviews.subtitle')}
            </p>
          </div>

          {/* Trustpilot Score Badge */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] self-start md:self-auto">
            <div className="text-center pr-4 border-r border-white/[0.08]">
              <div className="text-2xl font-black font-['Space_Grotesk'] text-white">4.9 / 5</div>
              <div className="flex text-emerald-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                ))}
              </div>
            </div>

            <div className="text-left font-['JetBrains_Mono'] text-xs">
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('reviews.excellent')}
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">{t('reviews.basedOn')}</div>
            </div>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS_DATA.map((rev) => (
            <motion.div
              key={rev.id}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-5 bg-white/[0.02] border border-white/[0.07] hover:border-emerald-500/30 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Author row & rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="w-8 h-8 rounded-full object-cover border border-white/[0.1]"
                    />
                    <div>
                      <div className="text-xs font-bold font-['Space_Grotesk'] text-white">
                        {rev.author}
                      </div>
                      <div className="text-[10px] text-slate-400 font-['JetBrains_Mono']">
                        {rev.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex text-emerald-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    ))}
                  </div>
                </div>

                <h4 className="text-sm font-bold font-['Space_Grotesk'] text-slate-100 mb-1.5">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {rev.comment}
                </p>
              </div>

              {/* Verified transaction footer */}
              <div className="pt-3 border-t border-white/[0.06] font-['JetBrains_Mono'] text-[11px]">
                <div className="flex justify-between items-center text-slate-400 mb-1">
                  <span>{t('reviews.sold')}</span>
                  <span className="text-slate-200 font-bold truncate max-w-[130px]">{rev.skinSold}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{rev.payoutMethod}:</span>
                  <span className="text-emerald-400 font-bold">{rev.payoutAmount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
