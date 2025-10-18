import Link from "next/link";
import { useState, useEffect } from "react";

const MobileMenu = ({ showMobileMenu, setShowMobileMenu, currentUser }) => {
  const [activeMenu, setActiveMenu] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      const mobileMenu = document.querySelector(".mobile-menu-container");
      if (showMobileMenu && mobileMenu && !mobileMenu.contains(e.target)) {
        setShowMobileMenu(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
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
    <>
      {/* Backdrop with blur */}
      <div
        style={{
          position: "fixed",
          top: "60px",
          left: 0,
          width: "100%",
          height: "calc(100vh - 60px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)",
          zIndex: 999,
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={closeMobileMenu}
      />

      {/* Menu Container */}
      <div
        className="mobile-menu-container"
        style={{
          position: "fixed",
          top: "60px",
          left: 0,
          width: "85%",
          maxWidth: "380px",
          height: "calc(100vh - 60px)",
          background: "linear-gradient(135deg, #ffffff 0%, #fffef8 100%)",
          zIndex: 1000,
          overflowY: "auto",
          animation: "slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow:
            "4px 0 24px rgba(242, 159, 5, 0.15), 8px 0 48px rgba(0, 0, 0, 0.1)",
          borderRight: "1px solid rgba(242, 159, 5, 0.1)",
        }}
      >
        {/* Decorative gradient bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "3px",
            background:
              "linear-gradient(90deg, #f29f05 0%, #ffc107 50%, #f29f05 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />

        {/* Close Button */}
        <div
          className="mobile-menu-close"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "12px",
            backgroundColor: "rgba(242, 159, 5, 0.1)",
            transition: "all 0.3s ease",
            zIndex: 10,
          }}
          onClick={closeMobileMenu}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(242, 159, 5, 0.2)";
            e.currentTarget.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(242, 159, 5, 0.1)";
            e.currentTarget.style.transform = "rotate(0deg)";
          }}
        >
          <i
            className="fa-solid fa-times"
            style={{ color: "#f29f05", fontSize: "1.2rem" }}
          />
        </div>

        {/* Menu Content */}
        <div style={{ padding: "70px 24px 24px" }}>
          {/* Welcome Text */}
          <div
            style={{
              marginBottom: "32px",
              paddingBottom: "20px",
              borderBottom: "1px solid rgba(242, 159, 5, 0.15)",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "1.5rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #f29f05 0%, #ffc107 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
              }}
            >
              Menu
            </h3>
            {currentUser && (
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "0.9rem",
                  color: "#666",
                  fontWeight: "400",
                }}
              >
                Welcome back, {currentUser.user?.name?.split(" ")[0] || "User"}!
              </p>
            )}
          </div>

          {/* Navigation Links */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {/* Home */}
            <li style={{ marginBottom: "6px" }}>
              <Link
                href="/"
                onClick={closeMobileMenu}
                style={{
                  textDecoration: "none",
                  color: "#363636",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(242, 159, 5, 0.08)";
                  e.currentTarget.style.paddingLeft = "24px";
                  e.currentTarget.style.color = "#f29f05";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.paddingLeft = "16px";
                  e.currentTarget.style.color = "#363636";
                }}
              >
                <i
                  className="fa-solid fa-home"
                  style={{
                    marginRight: "12px",
                    fontSize: "1.1rem",
                    width: "20px",
                  }}
                />
                Home
              </Link>
            </li>

            {/* About Us */}
            <li style={{ marginBottom: "6px" }}>
              <Link
                href="/about"
                onClick={closeMobileMenu}
                style={{
                  textDecoration: "none",
                  color: "#363636",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(242, 159, 5, 0.08)";
                  e.currentTarget.style.paddingLeft = "24px";
                  e.currentTarget.style.color = "#f29f05";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.paddingLeft = "16px";
                  e.currentTarget.style.color = "#363636";
                }}
              >
                <i
                  className="fa-solid fa-info-circle"
                  style={{
                    marginRight: "12px",
                    fontSize: "1.1rem",
                    width: "20px",
                  }}
                />
                About Us
              </Link>
            </li>

            {/* Restaurants Dropdown */}
            <li style={{ marginBottom: "6px" }}>
              <div
                onClick={() => toggleMenu("Restaurants")}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor:
                    activeMenu === "Restaurants"
                      ? "rgba(242, 159, 5, 0.08)"
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (activeMenu !== "Restaurants") {
                    e.currentTarget.style.backgroundColor =
                      "rgba(242, 159, 5, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeMenu !== "Restaurants") {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i
                    className="fa-solid fa-utensils"
                    style={{
                      marginRight: "12px",
                      fontSize: "1.1rem",
                      width: "20px",
                      color:
                        activeMenu === "Restaurants" ? "#f29f05" : "#363636",
                    }}
                  />
                  <span
                    style={{
                      color:
                        activeMenu === "Restaurants" ? "#f29f05" : "#363636",
                      fontSize: "1rem",
                      fontWeight: "500",
                    }}
                  >
                    Restaurants
                  </span>
                </div>
                <i
                  className={`fa-solid ${
                    activeMenu === "Restaurants"
                      ? "fa-chevron-up"
                      : "fa-chevron-down"
                  }`}
                  style={{
                    color: "#f29f05",
                    fontSize: "0.9rem",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>

              <div
                style={{
                  maxHeight: activeMenu === "Restaurants" ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  paddingLeft: "12px",
                }}
              >
                <ul
                  style={{
                    listStyle: "none",
                    padding: "8px 0",
                    margin: 0,
                  }}
                >
                  {[
                    {
                      href: "/restaurants",
                      label: "All Restaurants",
                      icon: "fa-list",
                    },
                    {
                      href: "/restaurant-card",
                      label: "Restaurant Details",
                      icon: "fa-store",
                    },
                    {
                      href: "/checkout",
                      label: "Checkout",
                      icon: "fa-shopping-cart",
                    },
                  ].map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        style={{
                          textDecoration: "none",
                          color: "#666",
                          fontSize: "0.95rem",
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 16px",
                          borderRadius: "10px",
                          transition: "all 0.3s ease",
                          borderLeft: "2px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(242, 159, 5, 0.05)";
                          e.currentTarget.style.borderLeftColor = "#f29f05";
                          e.currentTarget.style.paddingLeft = "20px";
                          e.currentTarget.style.color = "#f29f05";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.borderLeftColor = "transparent";
                          e.currentTarget.style.paddingLeft = "16px";
                          e.currentTarget.style.color = "#666";
                        }}
                      >
                        <i
                          className={`fa-solid ${item.icon}`}
                          style={{
                            marginRight: "10px",
                            fontSize: "0.9rem",
                            width: "16px",
                            opacity: 0.7,
                          }}
                        />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Pages Dropdown */}
            <li style={{ marginBottom: "6px" }}>
              <div
                onClick={() => toggleMenu("Pages")}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor:
                    activeMenu === "Pages"
                      ? "rgba(242, 159, 5, 0.08)"
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (activeMenu !== "Pages") {
                    e.currentTarget.style.backgroundColor =
                      "rgba(242, 159, 5, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeMenu !== "Pages") {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i
                    className="fa-solid fa-file-alt"
                    style={{
                      marginRight: "12px",
                      fontSize: "1.1rem",
                      width: "20px",
                      color: activeMenu === "Pages" ? "#f29f05" : "#363636",
                    }}
                  />
                  <span
                    style={{
                      color: activeMenu === "Pages" ? "#f29f05" : "#363636",
                      fontSize: "1rem",
                      fontWeight: "500",
                    }}
                  >
                    All Pages
                  </span>
                </div>
                <i
                  className={`fa-solid ${
                    activeMenu === "Pages" ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                  style={{
                    color: "#f29f05",
                    fontSize: "0.9rem",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>

              <div
                style={{
                  maxHeight: activeMenu === "Pages" ? "1000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  paddingLeft: "12px",
                }}
              >
                <ul
                  style={{
                    listStyle: "none",
                    padding: "8px 0",
                    margin: 0,
                  }}
                >
                  {[
                    { href: "/blog", label: "Blog", icon: "fa-blog" },
                    {
                      href: "/single-blog",
                      label: "Single Blog",
                      icon: "fa-file",
                    },
                    {
                      href: "/services",
                      label: "Services",
                      icon: "fa-concierge-bell",
                    },
                    { href: "/faq", label: "FAQ", icon: "fa-question-circle" },
                    {
                      href: "/pricing-table",
                      label: "Pricing Table",
                      icon: "fa-tags",
                    },
                    {
                      href: "/become-partner",
                      label: "Become A Partner",
                      icon: "fa-handshake",
                    },
                    {
                      href: "/404",
                      label: "404 Page",
                      icon: "fa-exclamation-triangle",
                    },
                  ].map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        style={{
                          textDecoration: "none",
                          color: "#666",
                          fontSize: "0.95rem",
                          display: "flex",
                          alignItems: "center",
                          padding: "12px 16px",
                          borderRadius: "10px",
                          transition: "all 0.3s ease",
                          borderLeft: "2px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(242, 159, 5, 0.05)";
                          e.currentTarget.style.borderLeftColor = "#f29f05";
                          e.currentTarget.style.paddingLeft = "20px";
                          e.currentTarget.style.color = "#f29f05";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.borderLeftColor = "transparent";
                          e.currentTarget.style.paddingLeft = "16px";
                          e.currentTarget.style.color = "#666";
                        }}
                      >
                        <i
                          className={`fa-solid ${item.icon}`}
                          style={{
                            marginRight: "10px",
                            fontSize: "0.9rem",
                            width: "16px",
                            opacity: 0.7,
                          }}
                        />
                        {item.label}
                      </Link>
                    </li>
                  ))}

                  {/* Admin Pages */}
                  {currentUser?.user?.role === "HOTEL_ADMIN" && (
                    <>
                      <li style={{ margin: "12px 0 8px", padding: "0 16px" }}>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            color: "#f29f05",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          Admin Panel
                        </div>
                      </li>
                      {[
                        {
                          href: "/hotelAdmin/addFoodItem",
                          label: "Add Food Item",
                          icon: "fa-plus-circle",
                        },
                        {
                          href: "/hotelAdmin/adminProfile",
                          label: "Admin Profile",
                          icon: "fa-user-shield",
                        },
                        {
                          href: "/hotelAdmin/foodItem",
                          label: "Food Items",
                          icon: "fa-hamburger",
                        },
                        {
                          href: "/hotelAdmin/orderStatus",
                          label: "Order Status",
                          icon: "fa-clipboard-list",
                        },
                      ].map((item, idx) => (
                        <li key={idx} style={{ marginBottom: "4px" }}>
                          <Link
                            href={item.href}
                            onClick={closeMobileMenu}
                            style={{
                              textDecoration: "none",
                              color: "#666",
                              fontSize: "0.95rem",
                              display: "flex",
                              alignItems: "center",
                              padding: "12px 16px",
                              borderRadius: "10px",
                              transition: "all 0.3s ease",
                              borderLeft: "2px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(242, 159, 5, 0.05)";
                              e.currentTarget.style.borderLeftColor = "#f29f05";
                              e.currentTarget.style.paddingLeft = "20px";
                              e.currentTarget.style.color = "#f29f05";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.borderLeftColor =
                                "transparent";
                              e.currentTarget.style.paddingLeft = "16px";
                              e.currentTarget.style.color = "#666";
                            }}
                          >
                            <i
                              className={`fa-solid ${item.icon}`}
                              style={{
                                marginRight: "10px",
                                fontSize: "0.9rem",
                                width: "16px",
                                opacity: 0.7,
                              }}
                            />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>
            </li>

            {/* Contact Us */}
            <li style={{ marginBottom: "6px" }}>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                style={{
                  textDecoration: "none",
                  color: "#363636",
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(242, 159, 5, 0.08)";
                  e.currentTarget.style.paddingLeft = "24px";
                  e.currentTarget.style.color = "#f29f05";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.paddingLeft = "16px";
                  e.currentTarget.style.color = "#363636";
                }}
              >
                <i
                  className="fa-solid fa-envelope"
                  style={{
                    marginRight: "12px",
                    fontSize: "1.1rem",
                    width: "20px",
                  }}
                />
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Action Buttons */}
          <div
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(242, 159, 5, 0.15)",
            }}
          >
            {currentUser ? (
              <Link
                href={
                  currentUser.user?.role === "HOTEL_ADMIN"
                    ? "/hotelAdmin/adminProfile"
                    : "/profile"
                }
                onClick={closeMobileMenu}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 20px",
                  background:
                    "linear-gradient(135deg, #f29f05 0%, #ffc107 100%)",
                  color: "#fff",
                  textAlign: "center",
                  borderRadius: "14px",
                  textDecoration: "none",
                  marginBottom: "12px",
                  fontWeight: "600",
                  fontSize: "1rem",
                  boxShadow: "0 4px 16px rgba(242, 159, 5, 0.3)",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px rgba(242, 159, 5, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(242, 159, 5, 0.3)";
                }}
              >
                <i
                  className="fa-solid fa-user"
                  style={{ marginRight: "10px" }}
                />
                My Profile
              </Link>
            ) : (
              <Link
                href="/signin"
                onClick={closeMobileMenu}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "16px 20px",
                  background:
                    "linear-gradient(135deg, #f29f05 0%, #ffc107 100%)",
                  color: "#fff",
                  textAlign: "center",
                  borderRadius: "14px",
                  textDecoration: "none",
                  marginBottom: "12px",
                  fontWeight: "600",
                  fontSize: "1rem",
                  boxShadow: "0 4px 16px rgba(242, 159, 5, 0.3)",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px rgba(242, 159, 5, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(242, 159, 5, 0.3)";
                }}
              >
                <i
                  className="fa-solid fa-sign-in-alt"
                  style={{ marginRight: "10px" }}
                />
                Sign In
              </Link>
            )}

            <Link
              href="/checkout"
              onClick={closeMobileMenu}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px 20px",
                backgroundColor: "#363636",
                color: "#fff",
                textAlign: "center",
                borderRadius: "14px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1rem",
                border: "2px solid #363636",
                transition: "all 0.3s ease",
                letterSpacing: "0.3px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#363636";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#363636";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <i
                className="fa-solid fa-shopping-bag"
                style={{ marginRight: "10px" }}
              />
              Order Now
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .mobile-menu-container::-webkit-scrollbar {
          width: 6px;
        }

        .mobile-menu-container::-webkit-scrollbar-track {
          background: rgba(242, 159, 5, 0.05);
          border-radius: 10px;
        }

        .mobile-menu-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #f29f05 0%, #ffc107 100%);
          border-radius: 10px;
        }

        .mobile-menu-container::-webkit-scrollbar-thumb:hover {
          background: #f29f05;
        }
      `}</style>
    </>
  );
};

export default MobileMenu;
