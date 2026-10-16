import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Compass, Map } from 'lucide-react';
import { getEvent } from '../eventDetails';

interface LocationProps {
  event?: string | null;
}

export const Location: React.FC<LocationProps> = ({ event = 'wedding' }) => {
  const details = getEvent(event);
  const venues = [
    {
      id: details.type,
      name: details.venue,
      city: details.city,
      quote: `"The place where we celebrate the most beautiful day of our lives"`,
      liveLocationUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.mapQuery)}`,
      embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(details.mapQuery)}&z=15&output=embed`,
      label: details.type === 'homecoming' ? "The Homecoming Venue" : "The Wedding Venue"
    }
  ];

  return (
    <div className="max-w-[85rem] mx-auto px-6 relative pt-12 pb-0 lg:py-12">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-brand-lavender/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="space-y-16 lg:space-y-32">
        {venues.map((venue, index) => {
          const isReversed = index % 2 !== 0;
          return (
            <div key={venue.id} className={`flex flex-col lg:flex-row${isReversed ? '-reverse' : ''} items-center lg:items-stretch gap-10 lg:gap-0 mt-4`}>
              
              {/* Interactive Card */}
              <motion.div 
                initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={`w-full lg:w-[45%] flex z-20 ${isReversed ? 'lg:-translate-x-12' : 'lg:translate-x-12'}`}
              >
                <div className="w-full h-full bg-white/90 backdrop-blur-2xl p-10 sm:p-14 lg:p-16 rounded-[2.5rem] gold-frame relative overflow-hidden group flex flex-col justify-center">
                  
                  {/* Elegant top border gradient */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-lavender via-brand-gold to-brand-plum" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-4 mb-6">
                      <span className="text-brand-plum uppercase tracking-[0.5em] text-[10px] sm:text-[11px] font-bold drop-shadow-sm">
                        {venue.label}
                      </span>
                      <div className="w-16 h-[1px] bg-gradient-to-r from-brand-gold/60 to-transparent" />
                    </div>

                    <h2 className="text-5xl sm:text-6xl font-display text-brand-ink mb-6 leading-tight drop-shadow-sm">
                      {details.title[0]} <br />
                      <span className="italic font-light text-brand-plum">{details.title[1]}</span>
                    </h2>

                    <motion.div 
                      className="flex items-start gap-5 mt-4"
                    >
                      <div className="w-12 h-12 bg-brand-blush rounded-full border border-brand-lavender/40 shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <MapPin className="text-brand-plum w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-serif text-brand-ink mb-1">{venue.name}</p>
                        <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-brand-ink/45 leading-relaxed mb-6">{venue.city}</p>
                        
                        <p className="text-brand-ink/65 italic font-serif text-lg leading-relaxed max-w-sm mb-10 pl-4 border-l-[1.5px] border-brand-lavender/40">
                          {venue.quote}
                        </p>

                        <a
                          href={venue.liveLocationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 btn-premium text-white px-8 py-4 rounded-full font-sans tracking-[0.2em] text-xs uppercase hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-300 active:scale-95 group/btn"
                        >
                          <Navigation className="w-4 h-4 text-white group-hover/btn:rotate-45 transition-transform duration-300" />
                          Open Live Location
                        </a>
                      </div>
                    </motion.div>
                  </div>

                  {/* Faint background compass icon */}
                  <Compass className="absolute -bottom-16 -right-16 w-64 h-64 text-brand-lavender/5 rotate-12 group-hover:rotate-45 transition-transform duration-[3s]" />
                </div>
              </motion.div>

              {/* Stunning Image Frame */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                className="w-full lg:w-[65%] aspect-video sm:h-[350px] lg:aspect-auto lg:h-auto lg:min-h-[600px] relative z-10"
              >
                <div className="absolute -inset-4 sm:-inset-6 border border-brand-gold/40 rounded-[3rem] -z-10 translate-x-2 sm:translate-x-4 translate-y-2 sm:translate-y-4" />
                
                <div className="w-full h-full min-h-[280px] block rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative">
                  <iframe
                    src={venue.embedUrl}
                    title={`${venue.name} Location`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full border-0"
                  />

                  {/* Decorative Location Pin Overlay */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-brand-lavender/30 shadow-lg flex items-center gap-2 pointer-events-none z-30">
                    <Map className="w-4 h-4 text-brand-plum animate-pulse" />
                    <span className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/75">Live Map</span>
                  </div>
                </div>
              </motion.div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
