import { NavLink, Link, Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/model/AuthContext";
import { useEffect, useState, type MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import { USER_ROLE_LABELS } from "../../entities/user/model/user.constants";

import styles from "./header.module.scss";
import logoSvg from "@/assets/img/logos/logo.svg";

export function Header() {
  const { user, logout } = useAuth();

  // Відкриття aside
  const [asideIsOpen, setAsideIsOpen] = useState<boolean>(false);
  const toggleMenu = (): void => {
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
  const [dropdownIsOpen, setDropdownIsOpen] = useState<boolean>(false);
  const toggleDropdownMenu = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    setDropdownIsOpen((previousValue) => !previousValue);
  };

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
            <Link to="/about">
              <img src={logoSvg} width="80" height="80" alt="CRM logo" />
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
              <NavLink to="/about" className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Про CRM">
                <span className="icon_home"></span> Про CRM
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Головна">
                <span className="icon_calendar"></span> Головна
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Проєкти">
                <span className="icon_stats_bars"></span> Проєкти
              </NavLink>
            </li>
            <li>
              <NavLink to="/tasks" className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Задачі">
                <span className="icon_reviews"></span> Задачі
              </NavLink>
            </li>
            {user?.role === "ADMIN" && (
              <li>
                <NavLink to="/users" className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Користувачі">
                  <span className="icon_user_tie"></span> Користувачі
                </NavLink>
              </li>
            )}
          </ul>
          <div className={styles.header__regWrapper}>
            <div className={styles.header__user}>
              <div className={styles.header__userPhotoWrapper}>
                <div className="icon_user"></div>
              </div>
              <div className={styles.header__userInfoWrapper}>
                <p>
                  <>{user ? USER_ROLE_LABELS[user.role] : "Гість"} &nbsp;</>
                  {user?.firstName} {user?.lastName}
                </p>
              </div>

              <button type="button" className={styles.header__logout} onClick={() => void logout()}>
                <span>Вийти</span>
              </button>
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
            <div className={`${styles.header__userPhotoWrapper} ${styles["header__userPhotoWrapper--aside"]}`}>
              <div className="icon_user"></div>
            </div>
            <div className={`${styles.header__userInfoWrapper} ${styles["header__userInfoWrapper--aside"]}`}>
              <p>
                {user?.firstName} {user?.lastName} <>{user ? USER_ROLE_LABELS[user.role] : "Гість"}</>
              </p>
            </div>
            <button type="button" className={`${styles.header__logout} ${styles["header__logout--aside"]}`} onClick={() => void logout()}>
              <span>Вийти</span>
            </button>
          </div>
          <ul className={styles.aside__navList}>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Про CRM">
                <span className="icon_home"></span> Про CRM
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Головна">
                <span className="icon_calendar"></span> Головна
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Проєкти">
                <span className="icon_stats_bars"></span> Проєкти
              </NavLink>
            </li>
            <li>
              <NavLink to="/tasks" className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Задачі">
                <span className="icon_reviews"></span> Задачі
              </NavLink>
            </li>
            {user?.role === "ADMIN" && (
              <li>
                <NavLink to="/users" className={({ isActive }) => (isActive ? "current-page--1" : "")} aria-label="Користувачі">
                  <span className="icon_user_tie"></span> Користувачі
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
}
