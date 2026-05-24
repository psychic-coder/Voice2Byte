import Link from "next/link";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import CartSidebar from "../components/CartSidebar";

const Header = ({ extraClass }) => {
  const router = useRouter();
  const { currentUser } = useSelector((state) => state.user);
  const [mobileToggle, setMobileToggle] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const toggleMobileMenu = () => {
    const body = document.querySelector("body");
    setMobileToggle(!mobileToggle);
    body.classList.toggle("mobile-menu-active");
  };

  return (
    <>
      <style jsx>{`
        .futuristic-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(242, 159, 5, 0.1);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }

        .nav-link {
          position: relative;
          color: #363636;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.3px;
          padding: 10px 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 8px;
        }

        .nav-link::before {
          content: "";
          position: absolute;
          bottom: 8px;
          left: 16px;
          right: 16px;
          height: 2px;
          background: linear-gradient(90deg, #f29f05, #ffc107);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link:hover {
          color: #f29f05;
          background: rgba(242, 159, 5, 0.05);
        }

        .nav-link:hover::before {
          transform: scaleX(1);
          transform-origin: left;
        }

        .icon-button {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(242, 159, 5, 0.08);
          border: 1px solid rgba(242, 159, 5, 0.15);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #363636;
        }

        .icon-button:hover {
          background: #f29f05;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(242, 159, 5, 0.25);
        }

        .action-button {
          padding: 10px 24px;
          background: linear-gradient(135deg, #f29f05, #ffc107);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(242, 159, 5, 0.3);
          position: relative;
          overflow: hidden;
        }

        .action-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }

        .action-button:hover::before {
          left: 100%;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(242, 159, 5, 0.4);
        }

        .action-button-outline {
          padding: 10px 24px;
          background: transparent;
          color: #363636;
          border: 2px solid rgba(242, 159, 5, 0.3);
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .action-button-outline:hover {
          background: rgba(242, 159, 5, 0.1);
          border-color: #f29f05;
          color: #f29f05;
          transform: translateY(-2px);
        }

        .logo-container {
          transition: transform 0.3s ease;
          cursor: pointer;
        }

        .logo-container:hover {
          transform: scale(1.05);
        }

        @media (max-width: 1199px) {
          .mobile-menu-btn {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(242, 159, 5, 0.08);
            border: 1px solid rgba(242, 159, 5, 0.15);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .mobile-menu-btn:hover {
            background: #f29f05;
            color: white;
          }
        }
      `}</style>

      <header
        className={`futuristic-header ${extraClass}`}
        style={{
          padding: "12px 0",
          height: "70px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          className="container"
          style={{
            padding: "0 20px",
            height: "100%",
          }}
        >
          <div className="row align-items-center" style={{ height: "100%" }}>
            {/* Logo Section */}
            <div className="col-xl-2" style={{ height: "100%" }}>
              <div
                className="header-style"
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Link href="/">
                  <div className="logo-container">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={163}
                      height={38}
                      viewBox="0 0 163 38"
                    >
                      <g id="Logo" transform="translate(-260 -51)">
                        <g
                          id="Logo-2"
                          data-name="Logo"
                          transform="translate(260 51)"
                        >
                          <g id="Elements">
                            <path
                              id="Path_1429"
                              data-name="Path 1429"
                              d="M315.086,140.507H275.222v-.894c0-11.325,8.941-20.538,19.933-20.538s19.931,9.213,19.931,20.538Z"
                              transform="translate(-270.155 -115.396)"
                              fill="#f29f05"
                            />
                            <path
                              id="Path_1430"
                              data-name="Path 1430"
                              d="M301.13,133.517a1.488,1.488,0,0,1-1.394-.994,11.361,11.361,0,0,0-10.583-7.54,1.528,1.528,0,0,1,0-3.055,14.353,14.353,0,0,1,13.37,9.527,1.541,1.541,0,0,1-.875,1.966A1.444,1.444,0,0,1,301.13,133.517Z"
                              transform="translate(-264.176 -113.935)"
                              fill="#fff"
                            />
                            <path
                              id="Path_1431"
                              data-name="Path 1431"
                              d="M297.343,146.544a14.043,14.043,0,0,1-13.837-14.211h2.975a10.865,10.865,0,1,0,21.723,0h2.975A14.043,14.043,0,0,1,297.343,146.544Z"
                              transform="translate(-266.247 -108.544)"
                              fill="#363636"
                            />
                            <path
                              id="Path_1432"
                              data-name="Path 1432"
                              d="M302.183,132.519a7.064,7.064,0,1,1-14.122,0Z"
                              transform="translate(-264.027 -108.446)"
                              fill="#363636"
                            />
                            <path
                              id="Path_1433"
                              data-name="Path 1433"
                              d="M320.332,134.575H273.3a1.528,1.528,0,0,1,0-3.055h47.033a1.528,1.528,0,0,1,0,3.055Z"
                              transform="translate(-271.815 -108.923)"
                              fill="#f29f05"
                            />
                            <path
                              id="Path_1434"
                              data-name="Path 1434"
                              d="M289.154,123.4a1.507,1.507,0,0,1-1.487-1.528v-3.678a1.488,1.488,0,1,1,2.975,0v3.678A1.508,1.508,0,0,1,289.154,123.4Z"
                              transform="translate(-264.154 -116.667)"
                              fill="#f29f05"
                            />
                            <path
                              id="Path_1435"
                              data-name="Path 1435"
                              d="M284.777,138.133H275.3a1.528,1.528,0,0,1,0-3.055h9.474a1.528,1.528,0,0,1,0,3.055Z"
                              transform="translate(-270.84 -107.068)"
                              fill="#363636"
                            />
                            <path
                              id="Path_1436"
                              data-name="Path 1436"
                              d="M284.8,141.691h-6.5a1.528,1.528,0,0,1,0-3.055h6.5a1.528,1.528,0,0,1,0,3.055Z"
                              transform="translate(-269.379 -105.218)"
                              fill="#363636"
                            />
                          </g>
                        </g>
                        <text
                          id="Quickeat"
                          transform="translate(320 77)"
                          fill="#363636"
                          fontSize={20}
                          fontFamily="Poppins"
                          fontWeight={700}
                        >
                          <tspan x={0} y={0}>
                            Voice
                          </tspan>
                          <tspan y={0} fill="#f29f05">
                            2Byte
                          </tspan>
                        </text>
                      </g>
                    </svg>
                  </div>
                </Link>
                <div
                  className={`d-xl-none ${mobileToggle ? "d-none" : "d-block"}`}
                >
                  <div
                    onClick={toggleMobileMenu}
                    className="mobile-menu-btn"
                    aria-label="Toggle menu"
                  >
                    <i className="fa-solid fa-bars" />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div
              className="col-lg-7 d-none d-xl-block "
              style={{ height: "100%" }}
            >
              <nav style={{ height: "100%" }}>
                <ul
                  style={{
                    padding: 0,
                    margin: 0,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    listStyle: "none",
                    gap: "4px",
                  }}
                >
                  <li
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Link
                      href="/"
                      className="nav-link"
                      style={{ margin: "10px" }}
                    >
                      Home
                    </Link>
                  </li>
                  <li
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Link
                      href="/about"
                      className="nav-link"
                      style={{ margin: "10px" }}
                    >
                      About
                    </Link>
                  </li>
                  <li
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Link
                      href="/search"
                      className="nav-link"
                      style={{ margin: "10px" }}
                    >
                      Search
                    </Link>
                  </li>
                  {currentUser?.user?.role === "HOTEL_ADMIN" && (
                    <>
                      <li
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Link
                          href="/hotelAdmin/adminProfile"
                          className="nav-link"
                          style={{ margin: "10px" }}
                        >
                          Admin
                        </Link>
                      </li>
                      <li
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Link
                          href="/hotelAdmin/foodItem"
                          className="nav-link"
                          style={{ margin: "10px" }}
                        >
                          Items
                        </Link>
                      </li>
                      <li
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Link
                          href="/hotelAdmin/addFoodItem"
                          className="nav-link"
                          style={{ margin: "10px" }}
                        >
                          Add Item
                        </Link>
                      </li>
                      <li
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Link
                          href="/hotelAdmin/orderStatus"
                          className="nav-link"
                          style={{ margin: "10px" }}
                        >
                          Orders
                        </Link>
                      </li>
                    </>
                  )}
                  <li
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Link
                      href="/restaurants"
                      className="nav-link"
                      style={{ margin: "10px" }}
                    >
                      Restaurants
                    </Link>
                  </li>
                  <li
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Link
                      href="/contacts"
                      className="nav-link"
                      style={{ margin: "10px" }}
                    >
                      Contacts
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Action Buttons */}
            <div
              className="col-lg-3 d-none d-xl-flex"
              style={{ height: "100%" }}
            >
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                <div
                  className="icon-button"
                  onClick={() => setShowCart(true)}
                  title="Shopping Cart"
                >
                  <i className="fa-solid fa-bag-shopping" />
                </div>
                {currentUser ? (
                  <button
                    className="action-button-outline"
                    onClick={() => {
                      const role = currentUser.user.role;
                      if (role === "HOTEL_ADMIN") {
                        router.push("/hotelAdmin/adminProfile");
                      } else if (role === "COMPANY_ADMIN") {
                        router.push("/companyAdminProfile");
                      } else {
                        router.push("/profile");
                      }
                    }}
                  >
                    Profile
                  </button>
                ) : (
                  <button
                    className="action-button-outline"
                    onClick={() => router.push("/signin")}
                  >
                    Sign In
                  </button>
                )}
                <Link href="/checkout">
                  <button className="action-button">Order Now</button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <CartSidebar showCart={showCart} setShowCart={setShowCart} />
        <MobileMenu
          showMobileMenu={mobileToggle}
          setShowMobileMenu={setMobileToggle}
          currentUser={currentUser}
        />
      </header>
    </>
  );
};

export default Header;
