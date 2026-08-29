import React, { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";

import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import OrderbookPage from "./pages/OrderbookPage";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";

// 🔁 Engine background runner (price-driven)
import { startBackgroundRunner } from "./services/backgroundRunner";

export default function App() {
  useEffect(() => {
    startBackgroundRunner();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/market"
          element={
            <Layout>
              <Market />
            </Layout>
          }
        />
        <Route
          path="/orderbook"
          element={
            <Layout>
              <OrderbookPage />
            </Layout>
          }
        />
        <Route
          path="/portfolio"
          element={
            <Layout>
              <Portfolio />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <Settings />
            </Layout>
          }
        />
      </Routes>
    </HashRouter>
  );
}
