export type EventType = 'wedding' | 'homecoming';

export interface EventDetails {
  type: EventType;
  label: string;
  invitationTitle: string;
  title: [string, string];
  date: Date;
  displayDate: string;
  sideDate: string;
  time: string;
  poruwaTime?: string;
  venue: string;
  city: string;
  mapQuery: string;
}

export const COUPLE = {
  names: 'Kavishka & Nimeshi',
};

export const EVENTS: Record<EventType, EventDetails> = {
  wedding: {
    type: 'wedding',
    label: 'Wedding',
    invitationTitle: 'Wedding Invitation',
    title: ['The Wedding', 'Ceremony'],
    date: new Date('2026-11-25T09:00:00+05:30'),
    displayDate: 'November 25, 2026',
    sideDate: 'November 25th',
    time: '9.00 AM - 4.30 PM',
    poruwaTime: '9.00 AM',
    venue: 'Ahaspokuna Holiday Resort',
    city: 'Barandana, Sri Lanka',
    mapQuery: 'Ahaspokuna Holiday Resort Barandana',
  },
  homecoming: {
    type: 'homecoming',
    label: 'Homecoming',
    invitationTitle: 'Homecoming Invitation',
    title: ['The Homecoming', 'Celebration'],
    date: new Date('2026-11-27T18:00:00+05:30'),
    displayDate: 'November 27, 2026',
    sideDate: 'November 27th',
    time: '6.00 PM - 12.00 AM',
    venue: 'Sobalanka Holiday Resort',
    city: 'Melsiripura, Sri Lanka',
    mapQuery: 'Sobalanka Holiday Resort Melsiripura',
  },
};

/** Path each invitation is served from; /homecoming has its own link-preview image. */
export const EVENT_PATHS: Record<EventType, string> = {
  wedding: '/',
  homecoming: '/homecoming',
};

/** Any link without `event=homecoming` (including older links) opens the wedding invitation. */
export function getEvent(param: string | null | undefined): EventDetails {
  return param === 'homecoming' ? EVENTS.homecoming : EVENTS.wedding;
}

/** The /homecoming path wins; the `event` query param is kept for older links. */
export function getEventFromLocation(location: Location): EventDetails {
  if (location.pathname.replace(/\/$/, '') === EVENT_PATHS.homecoming) return EVENTS.homecoming;
  return getEvent(new URLSearchParams(location.search).get('event'));
}
