import { SHOW_PHOTO, SHOW_TERM, SHOW_NOTE } from '@/store/actions.type';

window[SHOW_PHOTO] = (id) => window.dispatchEvent(new CustomEvent(SHOW_PHOTO, { detail: { id } }));

window[SHOW_TERM] = (id) => window.dispatchEvent(new CustomEvent(SHOW_TERM, { detail: { id } }));

window[SHOW_NOTE] = (id) => window.dispatchEvent(new CustomEvent(SHOW_NOTE, { detail: { id } }));