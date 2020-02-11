import { SHOW_TERM } from '@/store/actions.type';

window[SHOW_TERM] = (id) => window.dispatchEvent(new CustomEvent(SHOW_TERM, { detail: { id } }));