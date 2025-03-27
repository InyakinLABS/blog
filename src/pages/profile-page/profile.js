import React from "react";
 import styles from './profile.module.scss'
const Profile = () => {

    return(
        <div className={styles.regForm}>
        <p className={styles.formHeader}>Edit Profile Infomation</p>
        <form className={styles.signupForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            
            className={styles.formInput}
            autoComplete='true'
          />
        </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
             
              className={styles.formInput}
              autoComplete="true"
            />
          </div>
  
          <div className={styles.formGroup}>
            <label htmlFor="password">New password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
             
              minLength="6"
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="url">Avatar Image (url)</label>
            <input
              type="url"
              id="url"
              name="url"
              placeholder="Avatar image"
             
              minLength="6"
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formSubmit}>
            <button type="submit" className={styles.submitBtn}>
              Login
            </button>
          </div>
        </form>
      </div>

    )

}
export default Profile