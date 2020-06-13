import { SHOW_TERM, SHOW_NOTE, SHOW_MANUAL } from '@/store/actions.type';

window[SHOW_TERM] = (id) => window.dispatchEvent(new CustomEvent(SHOW_TERM, { detail: { id } }));

window[SHOW_NOTE] = (id) => window.dispatchEvent(new CustomEvent(SHOW_NOTE, { detail: { id } }));

window[SHOW_MANUAL] = (id) => window.dispatchEvent(new CustomEvent(SHOW_MANUAL, { detail: { id } }));