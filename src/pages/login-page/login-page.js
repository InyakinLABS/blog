import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "../../services/api";
import styles from "./login-page.module.scss";
import { loginStart, loginSuccess, loginFailure } from '../../services/authSlice'


const Login = () => {
  const [serverError, setServerError] = useState(null);
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm({ mode: 'onChange' });
  const dispatch = useDispatch();
  const [loginUser,{isLoading}] = useLoginUserMutation();

  const onSubmit = async (data) => {
    try {
      dispatch(loginStart());
      const userData = await loginUser({
        email: data.email,
        password: data.password
      }).unwrap();
      console.log(userData);
      dispatch(loginSuccess(userData));
      
    } catch (error) {
      dispatch(loginFailure(error.data?.message || 'Login failed'));
    }
  };

  const renderServerError = () => {
    if (!serverError) return null;
    
    return (
      <div className={styles.errorMessage}>
        {serverError}
      </div>
    );
  };

  return (
    <div className={styles.regForm}>
      <p className={styles.formHeader}>Sign In</p>
      {renderServerError()}
      <form className={styles.signupForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address'
              }
            })}
            className={`${styles.formInput} ${errors.email ? styles.errorInput : ''}`}
          />
          {errors.email && (
            <span className={styles.errorText}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            className={`${styles.formInput} ${errors.password ? styles.errorInput : ''}`}
          />
          {errors.password && (
            <span className={styles.errorText}>{errors.password.message}</span>
          )}
        </div>
        
        <div className={styles.formSubmit}>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!isValid||isLoading }
          >
            {isValid&&isLoading? 'Logging in...' : 'Login'}
          </button>
          <span className={styles.formSigninText}>
            Don't have an account?{" "}
            <Link className={styles.formLink} to="/sign-up">
              Sign Up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;