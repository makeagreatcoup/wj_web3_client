import { configureStore} from '@reduxjs/toolkit';
import rootReducer from './reducers';
import logger from 'redux-logger';

// 自定义中间件
const customMiddleware = (store) => (next) => (action) => {
  // console.log('dispatching', action);
  const result = next(action);
  // console.log('next state', store.getState());
  return result;
};

export const dashboardStore = (preloadedState) =>{
  return configureStore({
    reducer: rootReducer,
    middleware: [
      customMiddleware, // 添加自定义中间件
      logger, // 添加logger中间件
    ],
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState
  })
};
