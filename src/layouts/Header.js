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
    <header
      className={extraClass}
      style={{
        padding: "10px 0",
        height: "60px",
        position: "relative",
      }}
    >
      <div
        className="container"
        style={{
          padding: "0 15px",
          height: "100%",
        }}
      >
        <div className="row align-items-center" style={{ height: "100%" }}>
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
              </Link>
              <div className="mobile-menu-toggle d-xl-none">
                <button
                  onClick={toggleMobileMenu}
                  className="menu-toggle-btn"
                  aria-label="Toggle menu"
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    color: "#363636",
                    cursor: "pointer",
                  }}
                >
                  {mobileToggle ? (
                    <i className="fa-solid fa-times" />
                  ) : (
                    <i className="fa-solid fa-bars" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div
            className="col-lg-7 d-none d-xl-block"
            style={{ height: "100%" }}
          >
            <nav className="navbar" style={{ height: "100%" }}>
              <ul
                className="navbar-links"
                style={{
                  padding: 0,
                  margin: 0,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <li
                  className="navbar-dropdown"
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Link href="/" style={{ padding: "10px 12px" }}>
                    Home
                  </Link>
                </li>
                <li
                  className="navbar-dropdown"
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Link href="about" style={{ padding: "10px 12px" }}>
                    About
                  </Link>
                  <Link href="search" style={{ padding: "10px 12px" }}>
                    Search
                  </Link>
                </li>
                {currentUser?.user?.role === "HOTEL_ADMIN" && (
                  <>
                    <li
                      className="navbar-dropdown"
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Link
                        href="/hotelAdmin/adminProfile"
                        style={{ padding: "10px 12px" }}
                      >
                        AdminProfile
                      </Link>
                    </li>
                    <li
                      className="navbar-dropdown"
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Link
                        href="/hotelAdmin/foodItem"
                        style={{ padding: "10px 12px" }}
                      >
                        FoodItems
                      </Link>
                    </li>
                    <li
                      className="navbar-dropdown"
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Link
                        href="/hotelAdmin/addFoodItem"
                        style={{ padding: "10px 12px" }}
                      >
                        AddFoodItem
                      </Link>
                    </li>
                    <li
                      className="navbar-dropdown"
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Link
                        href="/hotelAdmin/orderStatus"
                        style={{ padding: "10px 12px" }}
                      >
                        OrderStatus
                      </Link>
                    </li>
                  </>
                )}
                <li
                  className="navbar-dropdown"
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Link href="restaurants" style={{ padding: "10px 12px" }}>
                    Restaurants
                  </Link>
                </li>
                <li
                  className="navbar-dropdown"
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Link href="contacts" style={{ padding: "10px 12px" }}>
                    Contacts
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-lg-3 d-none d-xl-flex" style={{ height: "100%" }}>
            <div
              className="extras bag d-flex align-items-center gap-2"
              style={{
                height: "100%",
                padding: "0 5px",
                justifyContent: "flex-end",
              }}
            >
              <div
                className="menu-btn"
                onClick={() => setShowCart(true)}
                style={{ margin: "0 5px", cursor: "pointer" }}
              >
                <i className="fa-solid fa-bag-shopping" />
              </div>
              {currentUser && (
                <div
                  className="button button-2 me-2"
                  style={{ padding: " " }}
                >
                  {currentUser ? (
                    <div
                      onClick={() =>
                        currentUser.user.role === "HOTEL_ADMIN"
                          ? router.push("/hotelAdmin/adminProfile")
                          : router.push("/profile")
                      }
                    >
                      Profile
                    </div>
                  ) : (
                    <div onClick={() => router.push("/signin")}>Signin</div>
                  )}
                </div>
              )}
              <Link href="checkout" className="button button-2">
                Order
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
  );
};

export default Header;
