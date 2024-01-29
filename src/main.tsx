import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './App.tsx'
import './index.css'

import AuthProvider from './contexts/AuthContext.tsx'
import { RouterProvider } from 'react-router-dom'

import { register } from 'swiper/element/bundle'

register();
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
      <React.StrictMode>
        <RouterProvider router={router}/>
      </React.StrictMode>
  </AuthProvider>
)
