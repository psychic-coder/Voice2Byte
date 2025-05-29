import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const MobileMenu = ({ showMobileMenu, setShowMobileMenu, currentUser }) => {
  const [activeMenu, setActiveMenu] = useState("");

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      const mobileMenu = document.querySelector('.mobile-menu-container');
      if (showMobileMenu && mobileMenu && !mobileMenu.contains(e.target)) {
        setShowMobileMenu(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMobileMenu, setShowMobileMenu]);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? "" : menu);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  if (!showMobileMenu) return null;

  return (
    <div 
      className="mobile-menu-container"
      style={{
        position: 'fixed',
        top: '60px',
        left: 0,
        width: '100%',
        height: 'calc(100vh - 60px)',
        backgroundColor: '#fff',
        zIndex: 1000,
        overflowY: 'auto',
        transform: 'translateX(0)',
        transition: 'transform 0.3s ease-in-out',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        padding: '20px'
      }}
    >
     
      <div 
        className="mobile-menu-close" 
        style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: '#363636'
        }} 
        onClick={closeMobileMenu}
      >
        <i className="fa-solid fa-times" />
      </div>

    
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0,
        marginTop: '20px'
      }}>
      
        <li style={{ 
          padding: '12px 0', 
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Link 
            href="/" 
            onClick={closeMobileMenu}
            style={{
              textDecoration: 'none',
              color: '#363636',
              fontSize: '1.1rem',
              display: 'block',
              fontWeight: '500'
            }}
          >
            Home
          </Link>
        </li>
        
        
        <li style={{ 
          padding: '12px 0', 
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Link 
            href="/about" 
            onClick={closeMobileMenu}
            style={{
              textDecoration: 'none',
              color: '#363636',
              fontSize: '1.1rem',
              display: 'block',
              fontWeight: '500'
            }}
          >
            About Us
          </Link>
        </li>

      
        <li style={{ 
          padding: '12px 0', 
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div 
            onClick={() => toggleMenu('Restaurants')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span style={{ 
              color: '#363636', 
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>
              Restaurants
            </span>
            <i 
              className={`fa-solid ${activeMenu === 'Restaurants' ? 'fa-chevron-up' : 'fa-chevron-down'}`} 
              style={{ color: '#f29f05' }}
            />
          </div>
          
          {activeMenu === 'Restaurants' && (
            <ul style={{ 
              listStyle: 'none', 
              padding: '10px 0 0 15px', 
              margin: 0 
            }}>
              <li style={{ padding: '8px 0' }}>
                <Link 
                  href="/restaurants" 
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: 'none',
                    color: '#666',
                    fontSize: '1rem',
                    display: 'block'
                  }}
                >
                  All Restaurants
                </Link>
              </li>
              <li style={{ padding: '8px 0' }}>
                <Link 
                  href="/restaurant-card" 
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: 'none',
                    color: '#666',
                    fontSize: '1rem',
                    display: 'block'
                  }}
                >
                  Restaurant Details
                </Link>
              </li>
              <li style={{ padding: '8px 0' }}>
                <Link 
                  href="/checkout" 
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: 'none',
                    color: '#666',
                    fontSize: '1rem',
                    display: 'block'
                  }}
                >
                  Checkout
                </Link>
              </li>
            </ul>
          )}
        </li>

       
        <li style={{ 
          padding: '12px 0', 
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div 
            onClick={() => toggleMenu('Pages')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <span style={{ 
              color: '#363636', 
              fontSize: '1.1rem',
              fontWeight: '500'
            }}>
              Pages
            </span>
            <i 
              className={`fa-solid ${activeMenu === 'Pages' ? 'fa-chevron-up' : 'fa-chevron-down'}`} 
              style={{ color: '#f29f05' }}
            />
          </div>
          
          {activeMenu === 'Pages' && (
            <ul style={{ 
              listStyle: 'none', 
              padding: '10px 0 0 15px', 
              margin: 0 
            }}>
              <li style={{ padding: '8px 0' }}>
                <Link 
                  href="/blog" 
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: 'none',
                    color: '#666',
                    fontSize: '1rem',
                    display: 'block'
                  }}
                >
                  Blog
                </Link>
              </li>
              <li style={{ padding: '8px 0' }}>
                <Link 
                  href="/single-blog" 
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: 'none',
                    color: '#666',
                    fontSize: '1rem',
                    display: 'block'
                  }}
                >
                  Single Blog
                </Link>
              </li>
              <li style={{ padding: '8px 0' }}>
                <Link 
                  href="/services" 
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: 'none',
                    color: '#666',
                    fontSize: '1rem',
                    display: 'block'
                  }}
                >
                  Services
                </Link>
              </li>
              <li style={{ padding: '8px 0' }}>
                <Link 
                  href="/faq" 
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: 'none',
                    color: '#666',
                    fontSize: '1rem',
                    display: 'block'
                  }}
                >
                  FAQ
                </Link>
              </li>
              <li style={{ padding: '8px 0' }}>
                <Link 
                  href="/pricing-table" 
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: 'none',
                    color: '#666',
                    fontSize: '1rem',
                    display: 'block'
                  }}
                >
                  Pricing Table
                </Link>
              </li>
              <li style={{ padding: '8px 0' }}>
                <Link 
                  href="/become-partner" 
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: 'none',
                    color: '#666',
                    fontSize: '1rem',
                    display: 'block'
                  }}
                >
                  Become A Partner
                </Link>
              </li>
              <li style={{ padding: '8px 0' }}>
                <Link 
                  href="/404" 
                  onClick={closeMobileMenu}
                  style={{
                    textDecoration: 'none',
                    color: '#666',
                    fontSize: '1rem',
                    display: 'block'
                  }}
                >
                  404 Page
                </Link>
              </li>

              {/* Admin Pages */}
              {currentUser?.user?.role === "HOTEL_ADMIN" && (
                <>
                  <li style={{ padding: '8px 0' }}>
                    <Link 
                      href="/hotelAdmin/addFoodItem" 
                      onClick={closeMobileMenu}
                      style={{
                        textDecoration: 'none',
                        color: '#666',
                        fontSize: '1rem',
                        display: 'block'
                      }}
                    >
                      Add Food Item
                    </Link>
                  </li>
                  <li style={{ padding: '8px 0' }}>
                    <Link 
                      href="/hotelAdmin/adminProfile" 
                      onClick={closeMobileMenu}
                      style={{
                        textDecoration: 'none',
                        color: '#666',
                        fontSize: '1rem',
                        display: 'block'
                      }}
                    >
                      Admin Profile
                    </Link>
                  </li>
                  <li style={{ padding: '8px 0' }}>
                    <Link 
                      href="/hotelAdmin/foodItem" 
                      onClick={closeMobileMenu}
                      style={{
                        textDecoration: 'none',
                        color: '#666',
                        fontSize: '1rem',
                        display: 'block'
                      }}
                    >
                      Food Items
                    </Link>
                  </li>
                  <li style={{ padding: '8px 0' }}>
                    <Link 
                      href="/hotelAdmin/orderStatus" 
                      onClick={closeMobileMenu}
                      style={{
                        textDecoration: 'none',
                        color: '#666',
                        fontSize: '1rem',
                        display: 'block'
                      }}
                    >
                      Order Status
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}
        </li>

     
        <li style={{ 
          padding: '12px 0', 
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Link 
            href="/contact" 
            onClick={closeMobileMenu}
            style={{
              textDecoration: 'none',
              color: '#363636',
              fontSize: '1.1rem',
              display: 'block',
              fontWeight: '500'
            }}
          >
            Contact Us
          </Link>
        </li>
      </ul>

  
      <div style={{ 
        marginTop: '30px', 
        paddingTop: '20px', 
        borderTop: '1px solid #f0f0f0' 
      }}>
        {currentUser ? (
          <Link 
            href={currentUser.user?.role === "HOTEL_ADMIN" ? "/hotelAdmin/adminProfile" : "/profile"} 
            onClick={closeMobileMenu}
            style={{
              display: 'block',
              padding: '12px 15px',
              backgroundColor: '#f29f05',
              color: '#fff',
              textAlign: 'center',
              borderRadius: '6px',
              textDecoration: 'none',
              marginBottom: '15px',
              fontWeight: '500',
              fontSize: '1rem'
            }}
          >
            My Profile
          </Link>
        ) : (
          <Link 
            href="/signin" 
            onClick={closeMobileMenu}
            style={{
              display: 'block',
              padding: '12px 15px',
              backgroundColor: '#f29f05',
              color: '#fff',
              textAlign: 'center',
              borderRadius: '6px',
              textDecoration: 'none',
              marginBottom: '15px',
              fontWeight: '500',
              fontSize: '1rem'
            }}
          >
            Sign In
          </Link>
        )}
        
        <Link 
          href="/checkout" 
          onClick={closeMobileMenu}
          style={{
            display: 'block',
            padding: '12px 15px',
            backgroundColor: '#363636',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '1rem'
          }}
        >
          Order Now
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;