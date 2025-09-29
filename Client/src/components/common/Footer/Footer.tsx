import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer: FunctionComponent<object> = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Social Media</h3>
            <ul className="social-media">
              <li>
                <a
                  // No personal link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/FonnDuh"
                  target="_blank"
                  rel="noopener noreferrer">
                  <i className="fa-brands fa-github"></i>
                </a>
              </li>
              <li>
                <a
                  // No personal link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </li>
              <li>
                <a
                  // No personal link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Newsletter Signup</h3>
            <form>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                autoComplete="email"
                required
              />
              <button type="submit" onClick={(e) => e.preventDefault()}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MediaVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
