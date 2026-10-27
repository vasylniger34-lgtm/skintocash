import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink, MessageSquare } from 'lucide-react';
import { STEAM_REVIEWS_DATA, type SteamReview } from '../data/steamReviewsData';
import { useLanguage } from '../context/LanguageContext';

interface TrustpilotReviewsProps {
  onNavigateReviews?: () => void;
}

const TRUSTPILOT_I18N: Record<string, Record<string, string>> = {
  EN: {
    badge: 'VERIFIED STEAM REVIEWS',
    titlePrefix: 'Trusted by',
    titleHighlight: '299+ CS2 Traders',
    desc: 'Direct feedback from real Steam Community profiles with confirmed Trade URL transactions.',
    verified: 'Steam Verified',
    basedOn: 'Based on 299+ trades',
    item: 'Item:',
    ctaTitle: 'Want to read all 299+ Steam reviews or leave your own?',
    ctaDesc: 'All reviews include verified Steam Community profile links and transaction details.',
    ctaBtn: 'View All 299+ Reviews',
  },
  UA: {
    badge: 'ВЕРИФІКОВАНІ ВІДГУКИ STEAM',
    titlePrefix: 'Вибір понад',
    titleHighlight: '299+ трейдерів CS2',
    desc: 'Справжні відгуки гравців Steam із підтвердженими угодами та миттєвими виплатами.',
    verified: 'Перевірено в Steam',
    basedOn: 'На основі 299+ угод',
    item: 'Скін:',
    ctaTitle: 'Бажаєте переглянути всі 299+ відгуків Steam або залишити свій?',
    ctaDesc: 'Усі відгуки містять прямі посилання на профілі Steam та підтверджені угоди.',
    ctaBtn: 'Всі 299+ відгуків Steam',
  },
  RU: {
    badge: 'ПРОВЕРЕННЫЕ ОТЗЫВЫ STEAM',
    titlePrefix: 'Выбор более',
    titleHighlight: '299+ трейдеров CS2',
    desc: 'Реальные отзывы игроков Steam с подтвержденными сделками и моментальными выплатами.',
    verified: 'Проверено в Steam',
    basedOn: 'На основе 299+ сделок',
    item: 'Скин:',
    ctaTitle: 'Хотите прочитать все 299+ отзывов Steam или оставить свой?',
    ctaDesc: 'Все отзывы содержат прямые ссылки на профили Steam и подтвержденные сделки.',
    ctaBtn: 'Все 299+ отзывов Steam',
  },
  PL: {
    badge: 'ZWERYFIKOWANE OPINIE STEAM',
    titlePrefix: 'Zaufanie ponad',
    titleHighlight: '299+ graczy CS2',
    desc: 'Bezpośrednie opinie z prawdziwych profili Steam Community z potwierdzonymi transakcjami wypłat.',
    verified: 'Zweryfikowano w Steam',
    basedOn: 'Na podstawie 299+ transakcji',
    item: 'Przedmiot:',
    ctaTitle: 'Chcesz przeczytać wszystkie 299+ opinii Steam lub zostawić własną?',
    ctaDesc: 'Wszystkie opinie zawierają bezpośrednie linki do profili Steam i szczegóły transakcji.',
    ctaBtn: 'Zobacz wszystkie 299+ opinii',
  },
  ES: {
    badge: 'RESEÑAS VERIFICADAS DE STEAM',
    titlePrefix: 'La confianza de más de',
    titleHighlight: '299+ comerciantes de CS2',
    desc: 'Opiniones directas de perfiles reales de Steam Community con intercambios confirmados.',
    verified: 'Verificado en Steam',
    basedOn: 'Basado en más de 299+ operaciones',
    item: 'Artículo:',
    ctaTitle: '¿Quieres leer las 299+ reseñas de Steam o dejar la tuya?',
    ctaDesc: 'Todas las reseñas incluyen enlaces directos a perfiles de Steam y detalles de la transacción.',
    ctaBtn: 'Ver las 299+ reseñas',
  },
  ZH: {
    badge: '经 STEAM 官方核验的玩家好评',
    titlePrefix: '深受超过',
    titleHighlight: '299+ 位 CS2 玩家信赖',
    desc: '来自真实 Steam 社区活跃玩家的公开评价，每笔交易均有链上及银行打款凭证。',
    verified: 'Steam 官方验证',
    basedOn: '基于 299+ 笔真实交易',
    item: '饰品:',
    ctaTitle: '想要查看全部 299+ 条真实评价或发表您的体验？',
    ctaDesc: '所有评价均附带经过验证的 Steam 社区主页直达链接及真实交易详情。',
    ctaBtn: '查看全部 299+ 条评价',
  },
  DE: {
    badge: 'VERIFIZIERTE STEAM-BEWERTUNGEN',
    titlePrefix: 'Das Vertrauen von',
    titleHighlight: '299+ CS2-Tradern',
    desc: 'Echtes Feedback von Steam-Community-Profilen mit bestätigten Trade-URL-Transaktionen.',
    verified: 'In Steam verifiziert',
    basedOn: 'Basierend auf 299+ Trades',
    item: 'Gegenstand:',
    ctaTitle: 'Möchtest du alle 299+ Steam-Bewertungen lesen oder eine eigene abgeben?',
    ctaDesc: 'Alle Bewertungen enthalten direkte Links zu Steam-Profilen und Transaktionsdetails.',
    ctaBtn: 'Alle 299+ Bewertungen ansehen',
  },
};

export const TrustpilotReviews: React.FC<TrustpilotReviewsProps> = ({ onNavigateReviews }) => {
  const { t, language } = useLanguage();
  const tt = TRUSTPILOT_I18N[language] || TRUSTPILOT_I18N['EN'];

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
                {tt.badge}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight mb-2">
              <>{tt.titlePrefix} <span className="text-emerald-400">{tt.titleHighlight}</span></>
            </h2>
            <p className="text-sm text-slate-300">
              {tt.desc}
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
                <span>{tt.verified}</span>
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                {tt.basedOn}
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
                    <a
                      href={rev.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block shrink-0 group/avatar"
                      title={rev.author}
                    >
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://avatars.fastly.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg';
                        }}
                        className="w-9 h-9 rounded-full object-cover border border-emerald-500/30 group-hover/avatar:border-emerald-400 group-hover/avatar:scale-105 transition-all"
                      />
                    </a>
                    <div className="min-w-0">
                      <a
                        href={rev.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/nick inline-flex items-center gap-1.5 transition-colors"
                        title={rev.author}
                      >
                        <span className="text-xs font-bold font-['Space_Grotesk'] text-white group-hover/nick:text-emerald-400 group-hover/nick:underline underline-offset-2 transition-colors truncate max-w-[125px]">
                          {rev.author}
                        </span>
                        <ExternalLink className="w-2.5 h-2.5 text-slate-500 group-hover/nick:text-emerald-400 opacity-60 group-hover/nick:opacity-100 transition-all shrink-0" />
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
                  <span className="text-[10px]">{tt.item}</span>
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
                {tt.ctaTitle}
              </div>
              <div className="text-xs text-slate-400">
                {tt.ctaDesc}
              </div>
            </div>
          </div>

          <button
            onClick={handleGoToReviews}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs font-['Space_Grotesk'] shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>
              {tt.ctaBtn}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
