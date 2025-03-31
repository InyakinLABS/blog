import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import { logout } from '../../services/authSlice'

import styles from './header.module.scss'
import fallbackimage from './Rectangle.svg'

const Header = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const history = useHistory()

  const handleLogout = async () => {
    await dispatch(logout())
    history.push('/')
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Blog Platform
      </Link>
      <div className={styles.buttons}>
        {!isLoggedIn ? (
          <>
            <Link to="/sign-in" className={styles.signIn}>
              Log In
            </Link>
            <Link to="/sign-up" className={styles.signUp}>
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/new-article">
              <button className={styles.create}>Create article</button>
            </Link>

            <Link to="/profile">
              <button className={styles.profile}>
                <span className={styles.profileName}>{user?.username || 'User'}</span>
                <img className={styles.profileImage} src={user?.image || fallbackimage} alt="Profile" />
              </button>
            </Link>
            <button className={`${styles.signUp} ${styles.logOut}`} onClick={handleLogout}>
              Log out
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
