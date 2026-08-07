import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../features/auth/useAuth";
import { ROUTES } from "../../shared/constants/routes";
import { ROLES } from "../../shared/constants/roles";
import { useCart } from "../../features/cart/useCart";

import styles from "./header.module.scss";
import logoSvg from "@/assets/img/logos/logo.svg";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const canManageProducts = user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN;

  const { totalQuantity } = useCart();

  // Відкриття aside
  const [asideIsOpen, setAsideIsOpen] = useState(false);
  const toggleMenu = () => {
    setAsideIsOpen((previousValue) => !previousValue);
  };
  const location = useLocation();
  const closeMenu = () => {
    setAsideIsOpen(false);
  };
  useEffect(() => {
    setAsideIsOpen(false);
  }, [location.pathname]);

  // Відкриття dropdown menu

  // Заборона скролу, коли aside відкритий
  useEffect(() => {
    document.body.style.overflow = asideIsOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [asideIsOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__container}>
          <div className={styles.header__top}>
            <Link to={ROUTES.HOME}>
              <img src={logoSvg} width="80" height="80" alt="Service logo" />
            </Link>
            <button className={`${styles.header__burgerMenu} ${styles.burgerMenu}`} aria-label="open mobile menu">
              <div className={styles.hamburgerIcon} onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
          <ul className={styles.headerNavList}>
            <li>
              <NavLink to={ROUTES.HOME} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Головна">
                Головна
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.ABOUT} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Про програму">
                Про програму
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink to={ROUTES.PRODUCTS} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Машини">
                  Машини
                </NavLink>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <NavLink to={ROUTES.PRODUCTS_INFINITE} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Всі машини">
                  Всі машини
                </NavLink>
              </li>
            )}
            {canManageProducts && (
              <li>
                <NavLink to={ROUTES.PRODUCT_CREATE} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Додати машину">
                  Додати машину
                </NavLink>
              </li>
            )}
            {user?.role === ROLES.USER && (
              <li>
                <NavLink to={ROUTES.CART} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Корзина">
                  <span className="icon_cart"></span> Корзина ({totalQuantity})
                </NavLink>
              </li>
            )}
          </ul>
          <div className={styles.header__regWrapper}>
            <div className={styles.header__user}>
              {!isAuthenticated ? (
                <>
                  <Link className={styles.header__login} to={ROUTES.LOGIN}>
                    <span>Логін</span>
                  </Link>
                  <Link className={styles.header__login} to={ROUTES.REGISTER}>
                    <span>Реєстрація</span>
                  </Link>
                </>
              ) : (
                <>
                  <div className={styles.header__userPhotoWrapper}>
                    <div className="icon_user"></div>
                  </div>
                  <div className={styles.header__userInfoWrapper}>
                    <p>{user?.username}</p>
                  </div>
                  <button className={styles.header__logout} type="button" onClick={logout}>
                    <span>Вийти</span>
                  </button>
                </>
              )}
            </div>
            <button className={`${styles.header__burgerMenu} ${styles.burgerMenu} ${styles["header__burgerMenu--two"]}`} aria-label="Mobile menu">
              <div className={styles.hamburgerIcon} onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </header>
      <aside className={`${styles.aside} ${asideIsOpen ? styles.menuOpen : ""}`}>
        <div className={styles.aside__prewrapper} onClick={closeMenu}></div>
        <div className={styles.aside__wrapper} onClick={(e) => e.stopPropagation()}>
          <button className={styles.close} aria-label="Close mobile menu" onClick={closeMenu}>
            <div className={styles.delSticks}></div>
          </button>
          <div className={styles.aside__logo}>
            <Link to="/about">
              <img src={logoSvg} width="80" height="80" alt="CRM logo" />
            </Link>
          </div>
          <div className={styles.aside__buttonsWrapper}>
            {!isAuthenticated ? (
              <>
                <Link className={styles.header__login} to={ROUTES.LOGIN}>
                  <span>Логін</span>
                </Link>
                <Link className={styles.header__login} to={ROUTES.REGISTER}>
                  <span>Реєстрація</span>
                </Link>
              </>
            ) : (
              <>
                <div className={`${styles.header__userPhotoWrapper} ${styles["header__userPhotoWrapper--aside"]}`}>
                  <div className="icon_user"></div>
                </div>
                <div className={`${styles.header__userInfoWrapper} ${styles["header__userInfoWrapper--aside"]}`}>
                  <p>{user?.username}</p>
                </div>
                <button className={`${styles.header__logout} ${styles["header__logout--aside"]}`} type="button" onClick={logout}>
                  <span>Вийти</span>
                </button>
              </>
            )}
          </div>
          <ul className={styles.aside__navList}>
            <li>
              <NavLink to={ROUTES.HOME} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Головна">
                Головна
              </NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.ABOUT} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Про програму">
                Про програму
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink to={ROUTES.PRODUCTS} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Машини">
                  Машини
                </NavLink>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <NavLink to={ROUTES.PRODUCTS_INFINITE} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Всі машини">
                  Всі машини
                </NavLink>
              </li>
            )}
            {canManageProducts && (
              <li>
                <NavLink to={ROUTES.PRODUCT_CREATE} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Додати машину">
                  Додати машину
                </NavLink>
              </li>
            )}
            {user?.role === ROLES.USER && (
              <li>
                <NavLink to={ROUTES.CART} className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Корзина">
                  <span className="icon_cart"></span> Корзина ({totalQuantity})
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
}
