import React from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar, MapPin, Sparkles } from 'lucide-react';
import { getEvent } from '../eventDetails';

interface CeremonyDetailsProps {
  event?: string | null;
}

export const CeremonyDetails: React.FC<CeremonyDetailsProps> = ({ event = 'wedding' }) => {
  const details = getEvent(event);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
      {/* Premium ambient backdrop */}
      <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-radial from-brand-lavender/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Side: Text Content */}
        <div className="lg:w-1/2 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <span className="text-brand-plum uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[11px] sm:text-xs font-bold drop-shadow-sm">
                {details.type === 'homecoming' ? 'The Homecoming' : 'The Sacred Union'}
              </span>
              <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-brand-gold/60 to-transparent" />
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-display text-brand-ink mb-8 leading-[1.1] drop-shadow-sm">
                <>{details.title[0]} <br /><span className="italic font-light text-brand-plum">{details.title[1]}</span></>
            </h2>

            <p className="text-brand-ink/65 font-serif text-lg sm:text-xl leading-relaxed mb-16 max-w-lg">
                With love, we warmly invite you to join us and bless us on this beautiful day.
            </p>

            {/* Premium Timeline */}
            <div className="relative space-y-12 ml-10 sm:ml-12 border-l-[1.5px] border-brand-lavender/30 pl-10 sm:pl-12 py-4">

              {/* Date */}
              <div className="relative group flex items-center min-h-[48px]">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[64px] sm:-left-[74px] w-12 h-12 bg-white rounded-full border border-brand-lavender/40 shadow-lg flex items-center justify-center group-hover:border-brand-plum group-hover:shadow-[0_4px_15px_rgba(194,87,122,0.3)] transition-all duration-500">
                  <Calendar className="w-5 h-5 text-brand-plum group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl sm:text-3xl text-brand-ink group-hover:text-brand-plum transition-colors duration-500">
                    <span className="font-semibold text-brand-ink/90">Date:</span> {details.displayDate}
                  </h4>
                </div>
              </div>

              {/* Location */}
              <div className="relative group flex items-center min-h-[48px]">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[64px] sm:-left-[74px] w-12 h-12 bg-white rounded-full border border-brand-lavender/40 shadow-lg flex items-center justify-center group-hover:border-brand-plum group-hover:shadow-[0_4px_15px_rgba(194,87,122,0.3)] transition-all duration-500">
                  <MapPin className="w-5 h-5 text-brand-plum group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl sm:text-3xl text-brand-ink leading-relaxed group-hover:text-brand-plum transition-colors duration-500">
                    <span className="font-semibold text-brand-ink/90">Venue:</span> {details.venue}, <br className="hidden sm:block" /> {details.city.replace(', Sri Lanka', '')}
                  </h4>
                </div>
              </div>

              {/* Time */}
              <div className="relative group flex items-center min-h-[48px]">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[64px] sm:-left-[74px] w-12 h-12 bg-white rounded-full border border-brand-lavender/40 shadow-lg flex items-center justify-center group-hover:border-brand-plum group-hover:shadow-[0_4px_15px_rgba(194,87,122,0.3)] transition-all duration-500">
                  <Clock className="w-5 h-5 text-brand-plum group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl sm:text-3xl text-brand-ink leading-relaxed group-hover:text-brand-plum transition-colors duration-500">
                    <span className="font-semibold text-brand-ink/90">Time:</span> {details.time}
                  </h4>
                </div>
              </div>

              {/* Poruwa Ceremony */}
              {details.poruwaTime && (
              <div className="relative group flex items-center min-h-[48px]">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[64px] sm:-left-[74px] w-12 h-12 bg-white rounded-full border border-brand-lavender/40 shadow-lg flex items-center justify-center group-hover:border-brand-plum group-hover:shadow-[0_4px_15px_rgba(194,87,122,0.3)] transition-all duration-500">
                  <Sparkles className="w-5 h-5 text-brand-plum group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl sm:text-3xl text-brand-ink leading-relaxed group-hover:text-brand-plum transition-colors duration-500">
                    <span className="font-semibold text-brand-ink/90">Poruwa Ceremony:</span> {details.poruwaTime}
                  </h4>
                </div>
              </div>
              )}

            </div>
          </motion.div>
        </div>

        {/* Right Side: Save-the-date card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="lg:w-1/2 w-full max-w-md lg:max-w-none flex justify-center relative z-10"
        >
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-t-[12rem] rounded-b-[2.5rem] overflow-hidden gold-frame">
            <img
              src="/ChatGPT Image Jul 5, 2026, 02_20_06 AM.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <span className="text-brand-gold uppercase tracking-[0.5em] text-[10px] font-bold mb-4">Save the Date</span>
              <span className="font-serif uppercase tracking-[0.4em] text-sm text-brand-ink/80">
                {details.date.toLocaleDateString('en-US', { month: 'long', timeZone: 'Asia/Colombo' })}
              </span>
              <span className="font-names text-shimmer text-8xl sm:text-9xl leading-none my-2">
                {details.date.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'Asia/Colombo' })}
              </span>
              <span className="font-serif tracking-[0.4em] text-sm text-brand-ink/80">
                {details.date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Colombo' }).toUpperCase()} · {details.date.getFullYear()}
              </span>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-brand-gold to-transparent my-5" />
              <span className="font-display text-3xl text-brand-plum">{details.label}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
