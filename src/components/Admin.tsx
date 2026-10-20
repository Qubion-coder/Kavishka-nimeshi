import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, CheckCircle2, Sparkles, User, Calendar, Clock, MapPin, Heart, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { CONFIRM_PATHS, COUPLE, EVENTS, EVENT_PATHS, EventType } from '../eventDetails';

export const Admin: React.FC = () => {
  const [guestTitle, setGuestTitle] = useState('Mr.');
  const [guestName, setGuestName] = useState('');
  const [includeDear, setIncludeDear] = useState(true);
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const details = EVENTS[eventType];

  const guestQuery = () => {
    const params = new URLSearchParams();
    if (guestTitle) params.append('title', guestTitle);
    params.append('name', guestName.trim());
    return params.toString();
  };

  const buildUrl = (type: EventType) => `${window.location.origin}${EVENT_PATHS[type]}?${guestQuery()}`;

  const buildConfirmUrl = (type: EventType) => `${window.location.origin}${CONFIRM_PATHS[type]}?${guestQuery()}`;

  const handleEventChange = (type: EventType) => {
    setEventType(type);
    // Keep an already generated link in step with the selected invitation type
    if (generatedUrl) {
      setGeneratedUrl(buildUrl(type));
      setCopied(false);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast.error('Please enter a guest name');
      return;
    }

    setGeneratedUrl(buildUrl(eventType));
    setCopied(false);
    toast.success('Invitation link generated successfully!');
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      toast.error('Failed to copy link. Please select and copy manually.');
    });
  };

  const generateFullMessage = (url: string, title: string, name: string, withDear: boolean) => {
    const occasion = details.label.toLowerCase();
    const fullName = title.toLowerCase() === 'family'
      ? `${name.trim()} and Family`
      : `${title ? title + ' ' : ''}${name}`.trim();

    const greeting = withDear ? `Dear ${fullName}` : fullName;

    return `${greeting} ❤️

With joyful hearts, we warmly invite you to celebrate our ${occasion} with us.

📅 ${details.displayDate}
🕘 ${details.time}
📍 ${details.venue}, ${details.city.replace(', Sri Lanka', '')}

Please view our ${occasion} invitation and all the event details through the link below 🌐:

${url}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${COUPLE.names}`;
  };

  const handleCopyConfirmMessage = () => {
    const fullName = guestTitle.toLowerCase() === 'family'
      ? `${guestName.trim()} and Family`
      : `${guestTitle ? guestTitle + ' ' : ''}${guestName}`.trim();
    const msg = `${includeDear ? `Dear ${fullName}` : fullName} ❤️

Having previously shared our ${details.label.toLowerCase()} invitation, we kindly ask you to confirm your attendance as we finalize arrangements for our celebration.

📅 ${details.displayDate}
📍 ${details.venue}, ${details.city.replace(', Sri Lanka', '')}

Please confirm by ${details.confirmBy} through the link below 🌐:

${buildConfirmUrl(eventType)}

With love,
❤️ ${COUPLE.names}`;
    navigator.clipboard.writeText(msg).then(() => {
      toast.success('Confirmation message copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy message.');
    });
  };

  const handleCopyMessageActive = () => {
    const msg = generateFullMessage(generatedUrl, guestTitle, guestName, includeDear);
    navigator.clipboard.writeText(msg).then(() => {
      toast.success('Full message copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy message.');
    });
  };

  return (
    <div className="min-h-screen bg-brand-blush py-12 px-4 sm:px-6 lg:px-8 font-sans text-brand-ink relative overflow-hidden selection:bg-brand-plum/20">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-radial from-brand-lavender/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Back to main website button */}
        <div className="mb-8 flex justify-between items-center">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 border border-brand-lavender/40 text-brand-ink/75 hover:text-brand-plum hover:bg-white transition-all shadow-sm font-medium text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Invitation
          </a>
          <span className="px-4 py-1.5 rounded-full bg-brand-rose border border-brand-lavender/30 text-brand-plum text-xs font-bold uppercase tracking-widest shadow-sm">
            Admin Dashboard
          </span>
        </div>

        {/* Main Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-brand-plum animate-pulse" />
            <span className="text-brand-plum uppercase tracking-[0.5em] text-xs font-bold drop-shadow-sm">Invitation Generator</span>
            <Sparkles className="w-5 h-5 text-brand-plum animate-pulse" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-display text-brand-ink tracking-tight mb-4 drop-shadow-sm">
            Wedding <span className="italic font-light text-brand-plum">Admin Panel</span>
          </h1>
          <p className="text-brand-ink/65 font-serif italic text-lg max-w-xl mx-auto">
            Generate personalized invitation links for your guests with specific event access.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Generator Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(194,87,122,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-rose via-brand-plum to-brand-rose" />

            <form onSubmit={handleGenerate} className="space-y-8">
              {/* Invitation Type */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] font-bold text-brand-ink/65 mb-3 flex items-center gap-2 ml-1">
                  <Heart className="w-4 h-4 text-brand-plum" />
                  Invitation Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-brand-rose/60 rounded-full">
                  {(Object.keys(EVENTS) as EventType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleEventChange(type)}
                      className={`py-3 rounded-full font-sans tracking-[0.2em] font-bold text-[11px] uppercase transition-all ${
                        eventType === type
                          ? 'bg-brand-plum text-white shadow-md'
                          : 'text-brand-ink/65 hover:text-brand-plum'
                      }`}
                    >
                      {EVENTS[type].label}
                    </button>
                  ))}
                </div>

                <motion.div
                  key={eventType}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-5 bg-brand-blush rounded-2xl border border-brand-rose/80 space-y-2.5 text-sm font-serif text-brand-ink/90"
                >
                  <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-brand-plum">
                    {details.label} Details
                  </p>
                  <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-plum" /> {details.displayDate}</p>
                  <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-plum" /> {details.time}</p>
                  {details.poruwaTime && (
                    <p className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-brand-plum" /> Poruwa ceremony at {details.poruwaTime}</p>
                  )}
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-plum" /> {details.venue}, {details.city.replace(', Sri Lanka', '')}</p>
                </motion.div>
              </div>
              {/* Guest Title & Name */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-brand-ink/65 mb-3 flex items-center gap-2 ml-1">
                    <User className="w-4 h-4 text-brand-plum" />
                    Guest Title
                  </label>
                  <select
                    value={guestTitle}
                    onChange={(e) => setGuestTitle(e.target.value)}
                    className="w-full bg-white px-6 py-4 rounded-full border border-brand-rose/80 focus:ring-2 focus:ring-brand-lavender/30 focus:border-brand-plum/40 outline-none transition-all font-serif text-lg shadow-inner text-brand-ink cursor-pointer"
                  >
                    <option value="">No Prefix</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Miss">Miss</option>
                    <option value="Mr. & Mrs.">Mr. & Mrs.</option>
                    <option value="Family">Family</option>
                    <option value="Dear">Dear</option>
                  </select>
                </div>



                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] font-bold text-brand-ink/65 mb-3 flex items-center gap-2 ml-1">
                    <User className="w-4 h-4 text-brand-plum" />
                    Guest Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sanjaya"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-white px-6 py-4 rounded-full border border-brand-rose/80 focus:ring-2 focus:ring-brand-lavender/30 focus:border-brand-plum/40 outline-none transition-all font-serif italic text-lg shadow-inner text-brand-ink placeholder:text-brand-ink/45"
                  />
                </div>
                
                <div className="flex items-center gap-3 ml-1 pt-2">
                  <input
                    type="checkbox"
                    id="includeDear"
                    checked={includeDear}
                    onChange={(e) => setIncludeDear(e.target.checked)}
                    className="w-5 h-5 text-brand-plum bg-white border-brand-lavender rounded focus:ring-brand-plum/40 focus:ring-2 cursor-pointer accent-brand-plum"
                  />
                  <label htmlFor="includeDear" className="text-sm font-serif text-brand-ink/75 cursor-pointer">
                    Include "Dear" before the name
                  </label>
                </div>
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-premium text-white py-5 rounded-full font-sans tracking-[0.3em] font-bold text-xs uppercase transition-all shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <LinkIcon className="w-4 h-4 text-brand-plum" />
                Generate {details.label} Link
              </button>
            </form>
          </motion.div>

          {/* Generated Link & History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Active Generated Link Box */}
            <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(194,87,122,0.15)] relative overflow-hidden">
              <h3 className="font-serif text-2xl text-brand-ink mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-brand-plum" />
                Generated Link
              </h3>
              
              {generatedUrl ? (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-5 bg-brand-blush rounded-2xl border border-brand-rose/80 shadow-inner">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-plum mb-3 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> WhatsApp Message Preview
                    </p>
                    <div className="text-sm text-brand-ink/90 font-serif whitespace-pre-wrap leading-relaxed bg-white/60 p-4 rounded-xl border border-brand-rose/70">
                      {generateFullMessage(generatedUrl, guestTitle, guestName, includeDear)}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleCopy(generatedUrl)}
                      className="flex-1 bg-brand-plum text-white py-3.5 px-6 rounded-full font-sans tracking-[0.2em] font-bold text-[11px] uppercase hover:bg-brand-plum/90 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Link Only'}
                    </button>
                    <button
                      onClick={handleCopyMessageActive}
                      className="flex-1 bg-brand-rose text-brand-plum py-3.5 px-6 rounded-full font-sans tracking-[0.2em] font-bold text-[11px] uppercase hover:bg-brand-rose/90 transition-all shadow-sm border border-brand-lavender/30 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Full Message
                    </button>
                  </div>

                  <button
                    onClick={handleCopyConfirmMessage}
                    className="w-full bg-white text-brand-plum py-3.5 px-6 rounded-full font-sans tracking-[0.2em] font-bold text-[11px] uppercase hover:bg-brand-blush transition-all shadow-sm border border-brand-gold/40 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Copy Attendance Confirmation Message
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-brand-rose rounded-2xl">
                  <p className="text-brand-ink/45 font-serif italic text-base">
                    Fill the form and click generate to create a link.
                  </p>
                </div>
              )}
            </div>


          </motion.div>
        </div>
      </div>
    </div>
  );
};
