import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice'; // Đảm bảo rằng đường dẫn chính xác

const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});

export default store;
