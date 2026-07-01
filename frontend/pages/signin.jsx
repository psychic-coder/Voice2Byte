"use client"
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { config } from '@/data/axiosData';
import {  showErrorToast, showSuccessToast } from '@/src/components/Toast';
import { signInSuccess } from '@/redux/reducers/userslice';


export default function Signin() {
  const dispatch=useDispatch();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePhotoUpload = () => {
    setPhotoUrl("https://example.com/photos/user1.jpg");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const userData = isLogin 
      ? { email, password }
      : { 
          name, 
          email, 
          password, 
          address: "123 Main Street, Jaipur", 
          photoUrl: "https://example.com/photos/user1.jpg" 
        };
    
    console.log("Submitting:", userData);
    
    if (isLogin) {
  
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/login`,
          {
            email,
            password
          },
          config
        );
        const { message, success, tokenData } = res.data;
        
        if (success) {
          showSuccessToast("Login successful!");
          dispatch(signInSuccess(tokenData));
          router.push("/");
        } else {
          console.log("Login failed:", message);
          showErrorToast(message || "Invalid email or password");
        }
      } catch (error) {
        console.error("Login error:", error.response?.data?.message || error.message);
        showErrorToast(error.response?.data?.message || "Login failed. Please try again.");
      }
    } else {
   
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/registerCustomer`,
          {
            address,
            photoUrl,
            email,
            password,
            name
          },
          config
        );
        
        const { message, success, tokenData } = res.data;
        
        if (success) {
          showSuccessToast(message || "Registration successful!");
          dispatch(signInSuccess(tokenData));
          router.push("/");
        } else {
          console.log("Registration failed:", message);
          showErrorToast(message || "Error in registering the customer");
        }
      } catch (error) {
        console.error("Registration error:", error.response?.data?.message || error.message);
        showErrorToast(error.response?.data?.message || "Registration failed. Please try again.");
      }
    }


    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Sign In' : 'Sign Up'} | Voice2Bite</title>
      </Head>

      <div className="auth-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">
              <div className="auth-card shadow-lg rounded-4 overflow-hidden">
           
                <div className="auth-header text-center py-4" data-aos="fade-down">
                  <Link href="/" className="d-inline-block mb-3 no-underline">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={163}
                      height={38}
                      viewBox="0 0 163 38"
                      className="logo"
                    >
                      <g transform="translate(-260 -51)">
                        <g transform="translate(260 51)">
                          <g>
                            <path
                              d="M315.086,140.507H275.222v-.894c0-11.325,8.941-20.538,19.933-20.538s19.931,9.213,19.931,20.538Z"
                              transform="translate(-270.155 -115.396)"
                              fill="#f29f05"
                            />
                            <path
                              d="M301.13,133.517a1.488,1.488,0,0,1-1.394-.994,11.361,11.361,0,0,0-10.583-7.54,1.528,1.528,0,0,1,0-3.055,14.353,14.353,0,0,1,13.37,9.527,1.541,1.541,0,0,1-.875,1.966A1.444,1.444,0,0,1,301.13,133.517Z"
                              transform="translate(-264.176 -113.935)"
                              fill="#fff"
                            />
                            <path
                              d="M297.343,146.544a14.043,14.043,0,0,1-13.837-14.211h2.975a10.865,10.865,0,1,0,21.723,0h2.975A14.043,14.043,0,0,1,297.343,146.544Z"
                              transform="translate(-266.247 -108.544)"
                              fill="#363636"
                            />
                            <path
                              d="M302.183,132.519a7.064,7.064,0,1,1-14.122,0Z"
                              transform="translate(-264.027 -108.446)"
                              fill="#363636"
                            />
                            <path
                              d="M320.332,134.575H273.3a1.528,1.528,0,0,1,0-3.055h47.033a1.528,1.528,0,0,1,0,3.055Z"
                              transform="translate(-271.815 -108.923)"
                              fill="#f29f05"
                            />
                            <path
                              d="M289.154,123.4a1.507,1.507,0,0,1-1.487-1.528v-3.678a1.488,1.488,0,1,1,2.975,0v3.678A1.508,1.508,0,0,1,289.154,123.4Z"
                              transform="translate(-264.154 -116.667)"
                              fill="#f29f05"
                            />
                            <path
                              d="M284.777,138.133H275.3a1.528,1.528,0,0,1,0-3.055h9.474a1.528,1.528,0,0,1,0,3.055Z"
                              transform="translate(-270.84 -107.068)"
                              fill="#363636"
                            />
                            <path
                              d="M284.8,141.691h-6.5a1.528,1.528,0,0,1,0-3.055h6.5a1.528,1.528,0,0,1,0,3.055Z"
                              transform="translate(-269.379 -105.218)"
                              fill="#363636"
                            />
                          </g>
                        </g>
                        <text
                          transform="translate(320 77)"
                          fill="#363636"
                          fontSize={20}
                          fontFamily="Poppins"
                          fontWeight={700}
                        >
                          <tspan x={0} y={0}>Voice</tspan>
                          <tspan y={0} fill="#f29f05">2Byte</tspan>
                        </text>
                      </g>
                    </svg>
                  </Link>
                  <h2 className="fw-bold mb-0">{isLogin ? 'Welcome Back!' : 'Join Voice2Bite'}</h2>
                  <p className="text-muted">
                    {isLogin ? 'Sign in to your account' : 'Create your free account'}
                  </p>
                </div>

                {/* Auth Form */}
                <div className="auth-body px-4 py-3" data-aos="fade-up">
                  <form onSubmit={handleSubmit}>
                    {!isLogin && (
                      <>
                        <div className="mb-3" data-aos="fade-up" data-aos-delay="100">
                          <label htmlFor="name" className="form-label">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>

                        <div className="mb-3" data-aos="fade-up" data-aos-delay="110">
                          <label htmlFor="address" className="form-label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            id="address"
                            placeholder="123 Main Street, Jaipur"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                          />
                        </div>

                        <div className="mb-3" data-aos="fade-up" data-aos-delay="120">
                          <label className="form-label">Profile Photo</label>
                          <div className="d-flex align-items-center">
                            <button
                              type="button"
                              className="btn btn-outline-secondary me-3"
                              onClick={handlePhotoUpload}
                            >
                              Upload Photo
                            </button>
                            {photoUrl && (
                              <small className="text-muted">Photo selected (placeholder)</small>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <div className="mb-3" data-aos="fade-up" data-aos-delay="150">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3" data-aos="fade-up" data-aos-delay="200">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      {!isLogin && (
                        <div className="form-text">Use 8 or more characters with a mix of letters, numbers & symbols</div>
                      )}
                    </div>

                    {isLogin && (
                      <div className="d-flex justify-content-between mb-3" data-aos="fade-up" data-aos-delay="250">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="remember" />
                          <label className="form-check-label" htmlFor="remember">Remember me</label>
                        </div>
                        <Link href="/forgot-password" className="text-decoration-none text-primary">
                          Forgot password?
                        </Link>
                      </div>
                    )}

                    <div className="d-grid mb-3" data-aos="fade-up" data-aos-delay="300">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg fw-bold"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {isLogin ? 'Signing In...' : 'Creating Account...'}
                          </>
                        ) : (
                          isLogin ? 'Sign In' : 'Sign Up'
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="text-center mb-3" data-aos="fade-up" data-aos-delay="350">
                    <p className="mb-0 text-muted">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => setIsLogin(!isLogin)}
                      >
                        {isLogin ? 'Sign up' : 'Sign in'}
                      </button>
                    </p>
                  </div>

                  <div className="divider d-flex align-items-center my-3" data-aos="fade-up" data-aos-delay="400">
                    <p className="text-center mx-3 mb-0 text-muted">OR</p>
                  </div>

                  <div className="row g-2" data-aos="fade-up" data-aos-delay="450">
                    <div className="col">
                      <button className="btn btn-outline-dark w-100">
                        <i className="fab fa-google me-2"></i> Google
                      </button>
                    </div>
                    <div className="col">
                      <button className="btn btn-outline-dark w-100">
                        <i className="fab fa-facebook-f me-2"></i> Facebook
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 2rem 0;
          background-color: #f8f9fa;
          
          background-size: cover;
          background-position: center;
        }
        
        .auth-card {
          background: white;
          border: none;
          transition: all 0.3s ease;
        }
        
        .auth-header {
          background-color: #f8f9fa;
          border-bottom: 1px solid #eee;
        }
        
        .logo {
          height: 38px;
          width: auto;
        }
        
        .btn-primary {
          background-color: #f29f05;
          border-color: #f29f05;
        }
        
        .btn-primary:hover {
          background-color: #e09504;
          border-color: #e09504;
        }
        
        .divider:after,
        .divider:before {
          content: "";
          flex: 1;
          height: 1px;
          background: #eee;
        }
        
        @media (max-width: 767.98px) {
          .auth-page {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}