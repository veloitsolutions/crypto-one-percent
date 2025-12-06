import React, { useEffect, useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;

      // Show footer if user has scrolled to the bottom
      if (scrollPosition >= pageHeight - 50) { // Adjust the offset if needed
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`main-footer ${isVisible ? 'visible' : ''}`}>
      <div className="container">
        <div className="row">
          {/* Column 1 */}
          <div className="col">
            <h4>Company Name</h4>
            <ul className="list-unstyled">
              <li>contact no.</li>
              <li>email</li>
              <li>address</li>
            </ul>
          </div>
          {/* Column 2 */}
          <div className="col">
            <h4>About us</h4>
            <ul>
              <li className="para">
                Lorem ipsum dolor sit, <br /> amet consectetur adipisicing <br /> elit. Iure quisquam sapiente <br /> praesentium.
              </li>
            </ul>
          </div>
          {/* Column 3 */}
          <div className="col">
            <h4>Support</h4>
            <ul className="list-unstyled">
              <li>FAQ</li>
              <li>Privacy Policy</li>
              <li>Help</li>
            </ul>
          </div>
          {/* Column 4 */}
          <div className="col">
            <h4>Social Media</h4>
            <ul className="list-unstyled">
              <li>Linked In</li>
              <li>X (Twitter)</li>
              <li>Instagram</li>
              <li>Facebook</li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="row">
          <p className="col-sm">
            &copy;{new Date().getFullYear()} Company Name | All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
