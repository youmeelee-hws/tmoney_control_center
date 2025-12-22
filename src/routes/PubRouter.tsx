import React, { useState } from 'react'
import { Outlet } from 'react-router-dom' // 💡 Outlet 추가 import
import { RouteConfig } from '@/types/route'
import PubTestPage from '@/pages/02_Publish/PubTestPage'
import bell from '@/assets/images/bell.svg'
import set from '@/assets/images/set.svg'
import logo from '@/assets/images/logo.svg'
import arrow from '@/assets/images/nav-arrow.svg'
import arrowWhite from '@/assets/images/arrow-w.svg'
import mnIco1 from '@/assets/images/mn-ico1.svg'
import close from '@/assets/images/close.svg'

const PubLayout: React.FC = () => (
  <div className="main">
    {/* 사이드바 */}
    <div className="sidebar open">
      <div className="top">
        <div className="logo">
          <img src={logo} alt="" />
        </div>

        <button
          className="toggle-btn"
          type="button"
          aria-label="사이드바 열기/닫기"
        >
          <i className="ri-menu-fold-line"></i>
        </button>
        <p className="s-title">Subway Control Center V3</p>
      </div>
      <nav className="menu">
        <ul>
          <li>
            <div className="menu-item ">
              <p>
                <img src={mnIco1} alt="" />
                <span className="txt">Live Monitoring</span>
              </p>
              <span className="arrow">
                <img src={arrow} alt="" />
              </span>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    <div className="dashboard-wrap">
      <header className="header">
        <div className="notice-box">
          <div className="flex-space-center notice-top">
            <p className="value">Active Alerts</p>
            <button className="btn-close">
              <img src={close} alt="" />
            </button>
          </div>
          <ul className="notice-lists">
            <li className="notice-lists-item">
              <div className="flex-space-center mb-20">
                <span className="badge green">Normal</span>
                <p className="desc">2025-12-16 AM 08:15</p>
              </div>
              <p className="b-tit">No issues detected</p>
              <p className="s-tit">Seoul Station · </p>
              <p className="desc txt">
                Passenger flow is within normal range. No action is required at
                this time.
              </p>
              <button type="button" className="btn-view">
                View CCTV <img src={arrowWhite} alt="" />
              </button>
            </li>
          </ul>
        </div>
        <div className="flex-space-center">
          <div className="left">
            <p className="status">Operate</p>
            <p className="header-tit">Subway turnstile control</p>
            <div className="select-platform">
              <p className="desc">selected station</p>
              <div className="select-box">
                <select name="" id="">
                  <option value="Seoul Station">Seoul Station</option>
                </select>
              </div>
            </div>
          </div>
          <div className="utill">
            <button className="">
              <img src={bell} alt="" />
            </button>
            <button className="">
              <img src={set} alt="" />
            </button>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  </div>
)

export const pubRoutes: RouteConfig[] = [
  {
    path: '/pub',
    element: <PubLayout />,
    children: [
      {
        path: '',
        element: <PubTestPage />,
      },
    ],
  },
]
