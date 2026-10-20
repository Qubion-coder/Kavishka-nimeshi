import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, Heart, HeartCrack, CheckCircle, Loader2, ArrowRight, Users, User } from 'lucide-react';
import { toast } from 'sonner';
import { GOOGLE_SCRIPT_URL } from '../config';
import { COUPLE, EVENT_PATHS, EventDetails } from '../eventDetails';

interface ConfirmProps {
  event: EventDetails;
  inviteeName: string;
}

type Attending = 'yes' | 'no' | null;

export const Confirm: React.FC<ConfirmProps> = ({ event, inviteeName }) => {
  const [attending, setAttending] = useState<Attending>(null);
  const [name, setName] = useState(inviteeName);
  const [guests, setGuests] = useState('1');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const weekday = event.date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Colombo' });
  const occasion = event.label.toLowerCase();

  // Keep the guest's name/title on the "view invitation" link
  const invitationUrl = `${EVENT_PATHS[event.type]}${window.location.search}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attending) {
      toast.error('Please let us know if you will attend');
      return;
    }
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setStatus('loading');

    try {
      const payload = new FormData();
      payload.append('sheet', 'RSVP');
      payload.append('fullName', name.trim());
      payload.append('guests', attending === 'yes' ? guests : '0');
      payload.append('event', event.type);
      payload.append('attending', attending === 'yes' ? 'Yes' : 'No');
      payload.append('source', 'Confirmation Page');

      await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: payload });

      setStatus('success');
    } catch (error) {
      console.error('Error sending confirmation: ', error);
      setStatus('idle');
      toast.error('Could not submit your confirmation. Please try again.');
    }
  };

  const choiceClass = (value: Attending) =>
    `flex-1 flex flex-col items-center gap-1.5 px-4 py-5 rounded-[1.5rem] border transition-all duration-300 ${
      attending === value
        ? 'bg-gradient-to-br from-brand-rose to-white border-brand-plum/60 shadow-[0_10px_25px_rgba(194,87,122,0.2)] scale-[1.02]'
        : 'bg-white/80 border-brand-rose hover:border-brand-lavender'
    }`;

  return (
    <div className="min-h-screen relative isolate overflow-hidden flex items-center justify-center px-4 py-12 sm:py-16 font-sans text-brand-ink lining-nums">
      <img
        src="/ChatGPT Image Jul 5, 2026, 02_20_06 AM.png"
        alt=""
        className="fixed inset-0 w-full h-full object-cover -z-20"
        style={{ height: '100%' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-white/20 via-white/50 to-white/20 -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="w-full max-w-xl bg-white/85 backdrop-blur-2xl rounded-[2.5rem] gold-frame relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-lavender via-brand-gold to-brand-plum" />

        <div className="px-6 sm:px-12 pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-brand-gold" />
            <span className="text-brand-plum uppercase tracking-[0.4em] text-[10px] sm:text-[11px] font-bold">
              Attendance Confirmation
            </span>
            <div className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-brand-gold" />
          </div>

          <h1 className="font-names text-shimmer text-4xl sm:text-5xl leading-tight mb-2">{COUPLE.names}</h1>
          <p className="font-display text-3xl text-brand-plum mb-6">{event.title.join(' ')}</p>

          <p className="font-serif text-lg text-brand-ink/75 leading-relaxed mb-8">
            {inviteeName && <span className="block font-semibold text-brand-ink mb-1">Dear {inviteeName},</span>}
            Having previously shared our {occasion} invitation, we warmly invite you to kindly confirm your
            attendance as we finalize arrangements for our celebration.
          </p>

          <div className="bg-brand-blush/80 border border-brand-rose rounded-[1.75rem] px-6 py-5 space-y-2.5 font-serif text-brand-ink/90 text-left sm:text-center">
            <p className="flex sm:justify-center items-center gap-3 text-lg">
              <Calendar className="w-4 h-4 text-brand-plum shrink-0" /> {weekday}, {event.displayDate}
            </p>
            <p className="flex sm:justify-center items-center gap-3 text-lg">
              <Clock className="w-4 h-4 text-brand-plum shrink-0" /> {event.time}
            </p>
            <p className="flex sm:justify-center items-center gap-3 text-lg">
              <MapPin className="w-4 h-4 text-brand-plum shrink-0" /> {event.venue} • {event.city.replace(', Sri Lanka', '')}
            </p>
          </div>

          <p className="mt-5 text-[11px] uppercase tracking-[0.25em] font-bold text-brand-gold">
            Please confirm by {event.confirmBy}
          </p>
        </div>

        <div className="px-6 sm:px-12 pb-12">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 px-6 bg-white/80 rounded-[2rem] border border-brand-rose"
              >
                <div className="w-20 h-20 bg-brand-rose/70 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-gold/30">
                  <CheckCircle className="w-10 h-10 text-brand-plum" />
                </div>
                <h2 className="text-4xl font-display text-brand-ink mb-3">With Gratitude</h2>
                <p className="font-serif text-lg text-brand-ink/70 leading-relaxed mb-6">
                  {attending === 'yes'
                    ? `Thank you, ${name.trim()}! We can't wait to celebrate with you on ${event.shortDate}.`
                    : `Thank you for letting us know, ${name.trim()}. You will be missed, and we're grateful for your blessings.`}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2 rounded-full border border-brand-lavender/50 text-brand-plum text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-brand-rose/40 transition-all"
                >
                  Update Response
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-7"
              >
                <div>
                  <p className="text-center font-serif text-xl text-brand-ink mb-4">
                    Will you be attending on {event.shortDate}?
                  </p>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setAttending('yes')} className={choiceClass('yes')}>
                      <Heart className={`w-6 h-6 text-brand-plum ${attending === 'yes' ? 'fill-brand-plum' : ''}`} />
                      <span className="font-serif text-lg font-semibold text-brand-ink">Yes, I will attend</span>
                      <span className="font-serif italic text-sm text-brand-ink/60">Joyfully accept</span>
                    </button>
                    <button type="button" onClick={() => setAttending('no')} className={choiceClass('no')}>
                      <HeartCrack className="w-6 h-6 text-brand-ink/50" />
                      <span className="font-serif text-lg font-semibold text-brand-ink">No, I cannot</span>
                      <span className="font-serif italic text-sm text-brand-ink/60">Regretfully decline</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/65 mb-3 ml-2 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-brand-plum" /> Guest Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white px-6 py-4 rounded-full border border-brand-rose focus:ring-2 focus:ring-brand-lavender/30 focus:border-brand-plum/40 outline-none transition-all font-serif text-lg shadow-inner placeholder:text-brand-ink/30"
                  />
                </div>

                <AnimatePresence initial={false}>
                  {attending !== 'no' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-brand-ink/65 mb-3 ml-2 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-brand-plum" /> Number of Guests Attending
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {['1', '2', '3', '4', '5'].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setGuests(n)}
                            className={`py-3.5 rounded-2xl font-serif text-xl transition-all border ${
                              guests === n
                                ? 'btn-premium text-white border-transparent'
                                : 'bg-white border-brand-rose text-brand-ink/80 hover:border-brand-lavender'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <p className="text-center font-serif italic text-sm text-brand-ink/55 mt-2">
                        {guests === '1' ? '1 Person' : `${guests} People`}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full btn-premium text-white py-5 rounded-full tracking-[0.3em] font-bold text-[11px] uppercase active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Confirmation'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <a
            href={invitationUrl}
            className="mt-8 flex items-center justify-center gap-2 text-brand-plum font-serif text-lg hover:text-brand-ink transition-colors group"
          >
            View Full {event.label} Invitation & Event Details
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </motion.div>
    </div>
  );
};
