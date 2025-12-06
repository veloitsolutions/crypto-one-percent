// import React from "react";
// import "./Home.css";
// import { Link } from "react-router-dom";

// export const Home = () => {
//   return (
//     <div className="home-container">
//       <header className="hero-section">
//         <h1>Welcome to OnePercent</h1>
//         <p>Your gateway to effortless crypto mining and growth.</p>
//         <Link to="/signup" className="cta-button">Get Started</Link>
//       </header>

//       <section className="info-section">
//         <h2>About OnePercent</h2>
//         <p>
//           OnePercent is a revolutionary platform where you can convert your crypto into tokens. Each time you click the "Mine" button, your tokens grow, unlocking new potential and rewards. The mining feature is available once every 24 hours, making it an exciting daily ritual!
//         </p>
//         <img src="/public/CoinDCX.webp" alt="Crypto Growth" className="info-image" />
        
//       </section>

//       <section className="features-section">
//         <h2>Why Choose OnePercent?</h2>
//         <div className="features-grid">
//           <div className="feature-card">
//             <img src="/secure.png" alt="Secure Platform" />
//             <h3>Secure Platform</h3>
//             <p>Your crypto is safe with our top-notch security protocols.</p>
//           </div>
//           <div className="feature-card">
//             <img src="/Market-Growth.jpg" alt="Token Growth" />
//             <h3>Consistent Growth</h3>
//             <p>Watch your tokens increase with each daily mining click.</p>
//           </div>
//           <div className="feature-card">
//             <img src="/istockphoto.jpg" alt="Community Support" />
//             <h3>Vibrant Community</h3>
//             <p>Join a growing community of crypto enthusiasts.</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to OnePercent</h1>
        <p>Your gateway to effortless crypto mining and growth.</p>
        <Link to="/signup" className="cta-button">Get Started</Link>
      </header>

      <section className="info-section">
        <h2>About OnePercent</h2>
        <p>
          OnePercent is a revolutionary platform where you can convert your crypto into tokens. Each time you click the "Mine" button, your tokens grow, unlocking new potential and rewards. The mining feature is available once every 24 hours, making it an exciting daily ritual!
        </p>
        {/* <div className="info-images-container">
          <div className="info-image-wrapper">
            <img src="/public/CoinDCX.webp" alt="Crypto Trading" className="info-image" />
          </div>
          <div className="info-image-wrapper">
            <img src="/public/CoinDCX.webp" alt="Crypto Growth" className="info-image" />
          </div>
          <div className="info-image-wrapper">
            <img src="/public/CoinDCX.webp" alt="Crypto Mining" className="info-image" />
          </div>
        </div> */}
      </section>

      <section className="features-section">
        <h2>Why Choose OnePercent?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="/secure.png" alt="Secure Platform" />
            <h3>Secure Platform</h3>
            <p>Your crypto is safe with our top-notch security protocols.</p>
          </div>
          <div className="feature-card">
            <img src="/Market-Growth.jpg" alt="Token Growth" />
            <h3>Consistent Growth</h3>
            <p>Watch your tokens increase with each daily mining click.</p>
          </div>
          <div className="feature-card">
            <img src="/istockphoto.jpg" alt="Community Support" />
            <h3>Vibrant Community</h3>
            <p>Join a growing community of crypto enthusiasts.</p>
          </div>
        </div>
      </section>
    </div>
  );
};