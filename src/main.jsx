import React from 'react'
import ReactDOM from 'react-dom/client'
import {render} from 'react-dom'
import { Provider } from 'react-redux'

import "moment/dist/locale/zh-cn"

import App from './App'
import './index.css'

import { TransactionsProvider } from './context/TransactionContext'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Dashboard from './components/exchange/dashboard'
import { dashboardStore } from './store/configureStore'

const store=dashboardStore()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
        <Routes>
        <Route exact path="/" element={
          <TransactionsProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </TransactionsProvider>
        } />
        <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
  </Provider>
  ,
)
