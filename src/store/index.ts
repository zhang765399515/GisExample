import { appStore } from './modules/app';
import { routeStore } from './modules/router';
import { user } from './modules/user';

const store: any = {};

export const registerStore = () => {
  store.appStore = appStore();
  store.routeStore = routeStore();
  store.user = user();
};
export default store;
