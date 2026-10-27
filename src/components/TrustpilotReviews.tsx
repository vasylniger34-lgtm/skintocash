import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink, MessageSquare } from 'lucide-react';
import { STEAM_REVIEWS_DATA, type SteamReview } from '../data/steamReviewsData';
import { useLanguage } from '../context/LanguageContext';

interface TrustpilotReviewsProps {
  onNavigateReviews?: () => void;
}

export const TrustpilotReviews: React.FC<TrustpilotReviewsProps> = ({ onNavigateReviews }) => {
  const { t, language } = useLanguage();

  // Pick top authentic diverse reviews from real Steam players
  const featuredReviews: SteamReview[] = [
    STEAM_REVIEWS_DATA[1],  // шоумен saiylyndi (10/10): Четко
    STEAM_REVIEWS_DATA[5],  // Elektrod (9/10): Красавцы
    STEAM_REVIEWS_DATA[7],  // matr1x (10/10): top
    STEAM_REVIEWS_DATA[9],  // mrak (9/10): Все швiдко
  ].filter(Boolean);

  const handleGoToReviews = () => {
    if (onNavigateReviews) {
      onNavigateReviews();
    } else {
      window.history.pushState({}, '', '/reviews');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section id="reviews-section" className="py-24 sm:py-32 bg-[#070A0E] border-t border-white/[0.06] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-['JetBrains_Mono'] font-bold mb-3">
              <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>
                {language === 'EN' 
                  ? 'VERIFIED STEAM REVIEWS' 
                  : (language === 'RU' ? 'ПРОВЕРЕННЫЕ ОТЗЫВЫ STEAM' : 'ВЕРИФІКОВАНІ ВІДГУКИ STEAM')}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight mb-2">
              {language === 'EN' ? (
                <>Trusted by <span className="text-emerald-400">299+ CS2 Traders</span></>
              ) : language === 'RU' ? (
                <>Выбор более <span className="text-emerald-400">299+ трейдеров CS2</span></>
              ) : (
                <>Вибір понад <span className="text-emerald-400">299+ трейдерів CS2</span></>
              )}
            </h2>
            <p className="text-sm text-slate-300">
              {language === 'EN' 
                ? 'Direct feedback from real Steam Community profiles with confirmed Trade URL transactions.' 
                : (language === 'RU' ? 'Реальные отзывы игроков Steam с подтвержденными сделками и моментальными выплатами.' : 'Справжні відгуки гравців Steam із підтвердженими угодами та миттєвими виплатами.')}
            </p>
          </div>

          {/* Steam Score Badge */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] self-start md:self-auto">
            <div className="text-center pr-4 border-r border-white/[0.08]">
              <div className="text-2xl font-black font-['Space_Grotesk'] text-white">9.7 / 10</div>
              <div className="flex text-emerald-400 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                ))}
              </div>
            </div>

            <div className="text-left font-['JetBrains_Mono'] text-xs">
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'EN' ? 'Steam Verified' : (language === 'RU' ? 'Проверено в Steam' : 'Перевірено в Steam')}</span>
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                {language === 'EN' ? 'Based on 299+ trades' : (language === 'RU' ? 'На основе 299+ сделок' : 'На основі 299+ угод')}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredReviews.map((rev) => (
            <motion.div
              key={rev.id}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-5 bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.07] hover:border-emerald-500/35 transition-all flex flex-col justify-between shadow-lg relative group"
            >
              <div>
                {/* Author row & rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://avatars.fastly.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg';
                      }}
                      className="w-9 h-9 rounded-full object-cover border border-emerald-500/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold font-['Space_Grotesk'] text-white truncate max-w-[110px]">
                        {rev.author}
                      </div>
                      <a
                        href={rev.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-emerald-400 font-['JetBrains_Mono'] transition-colors"
                      >
                        <span>Steam Profile</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  <div className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-['JetBrains_Mono'] font-bold flex items-center gap-1 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{rev.rating}/10</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-['JetBrains_Mono'] mb-2">
                  {rev.date}
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans mb-4 min-h-[42px]">
                  "{rev.text}"
                </p>
              </div>

              {/* Verified transaction footer */}
              <div className="pt-3 border-t border-white/[0.06] font-['JetBrains_Mono'] text-[11px] space-y-1">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px]">{language === 'EN' ? 'Item:' : 'Скін:'}</span>
                  <span className="text-slate-200 font-semibold truncate max-w-[130px]">{rev.skinSold}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">{rev.payoutMethod}:</span>
                  <span className="text-emerald-400 font-bold">{rev.payoutAmount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Reviews Banner CTA */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold font-['Space_Grotesk'] text-white">
                {language === 'EN' ? 'Want to read all 299+ Steam reviews or leave your own?' : (language === 'RU' ? 'Хотите прочитать все 299+ отзывов Steam или оставить свой?' : 'Бажаєте переглянути всі 299+ відгуків Steam або залишити свій?')}
              </div>
              <div className="text-xs text-slate-400">
                {language === 'EN' ? 'All reviews include verified Steam Community profile links and transaction details.' : (language === 'RU' ? 'Все отзывы содержат прямые ссылки на профили Steam и подтвержденные сделки.' : 'Усі відгуки містять прямі посилання на профілі Steam та підтверджені угоди.')}
              </div>
            </div>
          </div>

          <button
            onClick={handleGoToReviews}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs font-['Space_Grotesk'] shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>
              {language === 'EN' 
                ? 'View All 299+ Reviews' 
                : (language === 'RU' ? 'Все 299+ отзывов Steam' : 'Всі 299+ відгуків Steam')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
