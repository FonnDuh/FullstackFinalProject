import { ToastContainer } from "react-toastify";
import "./App.css";
import "./styles/global.css";
import "./styles/variables.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./components/feedback/NotFound/NotFound";
import Layout from "./layouts/Default/Layout";
import Search from "./pages/Search/Search";
import MediaDetails from "./pages/MediaDetails/MediaDetails";
import ErrorBoundary from "./components/feedback/ErrorBoundary";
import Login from "./pages/Forms/Login";
import Register from "./pages/Forms/Register";
import Profile from "./pages/Profile/Profile";
import { AuthProvider } from "./providers/AuthProvider";
import Watchlist from "./pages/Watchlist/Watchlist";
import Browsing from "./pages/Browsing/Browsing";
import About from "./pages/About/About";

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/search"
                element={
                  <ErrorBoundary>
                    <Search />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <ErrorBoundary>
                    <Watchlist />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/browse"
                element={
                  <ErrorBoundary>
                    <Browsing />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/tmdb/:type/:id"
                element={
                  <ErrorBoundary>
                    <MediaDetails />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/login"
                element={
                  <ErrorBoundary>
                    <Login />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/register"
                element={
                  <ErrorBoundary>
                    <Register />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/profile"
                element={
                  <ErrorBoundary>
                    <Profile />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/about"
                element={
                  <ErrorBoundary>
                    <About />
                  </ErrorBoundary>
                }
              />
              <Route
                path="*"
                element={
                  <ErrorBoundary>
                    <NotFound />
                  </ErrorBoundary>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
