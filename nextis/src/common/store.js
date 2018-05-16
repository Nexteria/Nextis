import { initStore } from 'react-waterfall';
import { Map } from 'immutable';

const store = {
  initialState: {
    user: null,
    student: null,
    notifications: new Map(),
  },
  actions: {
    setUser: (state = {}, user) => ({
      ...user
    }),
    setNotification: (state = {}, notification) => ({
      ...state,
      notifications: state.notifications.set(notification.id, notification),
    }),
    removeNotification: (state = {}, notificationId) => ({
      ...state,
      notifications: state.notifications.delete(notificationId),
    }),
  },
}

export const {
  Provider,
  Consumer,
  actions,
  getState,
  connect,
  subscribe,
} = initStore(store)