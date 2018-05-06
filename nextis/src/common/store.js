import { initStore } from 'react-waterfall';

const store = {
  initialState: {
    user: null,
  },
  actions: {
    setUser: (state = {}, user) => ({
      ...user
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