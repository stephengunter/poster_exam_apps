import { SHOW_TERM, SHOW_NOTE, SHOW_MANUAL, NOTE_CATEGORY } from '@/store/actions.type';

window[SHOW_TERM] = (id) => window.dispatchEvent(new CustomEvent(SHOW_TERM, { detail: { id } }));

window[SHOW_NOTE] = (id) => window.dispatchEvent(new CustomEvent(SHOW_NOTE, { detail: { id } }));

window[SHOW_MANUAL] = (id) => window.dispatchEvent(new CustomEvent(SHOW_MANUAL, { detail: { id } }));

window[NOTE_CATEGORY] = () => window.dispatchEvent(new CustomEvent(NOTE_CATEGORY, { detail: null }));