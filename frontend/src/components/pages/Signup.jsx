

// //Signup.jsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './signup.css';

// export const Signup = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     role: 'Investor'
//   });
//   const [errors, setErrors] = useState({});
//   const [success, setSuccess] = useState('');

//   // Email validation function
//   const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: ''
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!isValidEmail(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     }

//     if (!formData.password.trim()) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters long';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:4000/api/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!data.success) {
//         throw new Error(data.message);
//       }

//       setSuccess(data.message);
      
//       // Clear form
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         password: '',
//         role: 'Investor'
//       });

//       // Navigate to login page after 2 seconds
//       setTimeout(() => {
//         navigate('/login');
//       }, 2000);
      
//     } catch (err) {
//       setErrors({
//         submit: err.message || 'Something went wrong'
//       });
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-box">
//         <h2 className="signup-title">Sign Up</h2>
//         {errors.submit && <div className="error-message">{errors.submit}</div>}
//         {success && <div className="success-message">{success}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="name">Name</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               className={`form-input ${errors.name ? 'error' : ''}`}
//               placeholder="Enter your name"
//               value={formData.name}
//               onChange={handleChange}
//             />
//             {errors.name && <span className="error-text">{errors.name}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               className={`form-input ${errors.email ? 'error' : ''}`}
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             {errors.email && <span className="error-text">{errors.email}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="phone">Phone Number</label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               className={`form-input ${errors.phone ? 'error' : ''}`}
//               placeholder="Enter your phone number"
//               value={formData.phone}
//               onChange={handleChange}
//             />
//             {errors.phone && <span className="error-text">{errors.phone}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               className={`form-input ${errors.password ? 'error' : ''}`}
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//             {errors.password && <span className="error-text">{errors.password}</span>}
//           </div>

//           <button type="submit" className="signup-button">Sign Up</button>
//         </form>
//       </div>
//     </div>
//   );
// };

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Investor',
    referralCode: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Referral code validation is optional
    if (formData.referralCode.trim() && formData.referralCode.trim().length < 5) {
      newErrors.referralCode = 'Please enter a valid referral code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setSuccess(data.message);
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'Investor',
        referralCode: ''
      });

      // Navigate to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setErrors({
        submit: err.message || 'Something went wrong'
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="referralCode">Referral Code (Optional)</label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              className={`form-input ${errors.referralCode ? 'error' : ''}`}
              placeholder="Enter referral code if you have one"
              value={formData.referralCode}
              onChange={handleChange}
            />
            {errors.referralCode && <span className="error-text">{errors.referralCode}</span>}
          </div>

          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};