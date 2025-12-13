import React, { useEffect, useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Logic for visibility remains but making it always visible usually is better UX for footers unless specific request
      // We'll keep the logic if user liked it, but often footers are just at the bottom.
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      // Simple offset check
      if (scrollPosition >= pageHeight - 100) {
        setIsVisible(true);
      } else {
        // Also show if page is not scrollable (short content)
        if (document.documentElement.scrollHeight <= window.innerHeight) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`main-footer ${isVisible || true ? 'visible' : ''}`}>
      {/* Forcing visible for now because hiding it causes confusion often */}
      <div className="container">
        <div className="row">
          {/* Column 1 */}
          <div className="col">
            <h4>OnePercent</h4>
            <ul className="list-unstyled">
              <li>+1 (555) 123-4567</li>
              <li>support@onepercent.com</li>
              <li>123 Crypto Valley, NY</li>
            </ul>
          </div>
          {/* Column 2 */}
          <div className="col">
            <h4>About Us</h4>
            <ul>
              <li className="para">
                We are dedicated to providing the most secure and efficient crypto mining simulation platform. Join thousands of investors growing their portfolio daily.
              </li>
            </ul>
          </div>
          {/* Column 3 */}
          <div className="col">
            <h4>Resources</h4>
            <ul className="list-unstyled">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Investment Guide</li>
            </ul>
          </div>
          {/* Column 4 */}
          <div className="col">
            <h4>Connect</h4>
            <ul className="list-unstyled">
              <li>LinkedIn</li>
              <li>Twitter / X</li>
              <li>Telegram</li>
              <li>Discord</li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="row">
          <p className="col-sm">
            &copy;{new Date().getFullYear()} OnePercent Inc. | All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
