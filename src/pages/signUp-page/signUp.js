import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useRegisterUserMutation } from '../../services/api';
import styles from './signUp.module.scss';
import { Result, Button } from 'antd';

const SignUp = () => {
  const [showResult, setShowResult] = useState(null); // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch
  } = useForm({
    mode: 'onChange'
  });

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onSubmit = async (formData) => {
    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      }).unwrap();
      
      setShowResult('success');
      reset();
    } catch (error) {
      setErrorMessage(error.data?.message || 'Registration failed');
      setShowResult('error');
    }
  };

  // Регулярное выражение для email с обязательной точкой
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (showResult === 'success') {
    return (
      <div className={styles.resultContainer}>
        <Result
          status="success"
          title="Registration Successful!"
          subTitle="You can now sign in to your account."
          extra={[
            <Button type="primary" key="signin">
              <Link to="/signIn">Sign In</Link>
            </Button>
          ]}
        />
      </div>
    );
  }

  if (showResult === 'error') {
    return (
      <div className={styles.resultContainer}>
        <Result
          status="error"
          title="Registration Failed"
          subTitle={errorMessage}
          extra={[
            <Button type="primary" key="tryAgain" onClick={() => setShowResult(null)}>
              Try Again
            </Button>
          ]}
        />
      </div>
    );
  }

  return (
    <div className={styles.regForm}>
      <p className={styles.formHeader}>Create new account</p>
      <form className={styles.signupForm} onSubmit={handleSubmit(onSubmit)}>
        
        {/* Username */}
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            placeholder="Username"
            className={`${styles.formInput} ${errors.username && styles.errorInput}`}
            {...register('username', { 
              required: 'Username is required',
              minLength: { 
                value: 3, 
                message: 'Username must be at least 3 characters' 
              }
            })}
          />
          {errors.username && <span className={styles.errorText}>{errors.username.message}</span>}
        </div>

        {/* Email с валидацией точки */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className={`${styles.formInput} ${errors.email && styles.errorInput}`}
            {...register('email', { 
              required: 'Email is required',
              pattern: { 
                value: emailRegex,
                message: 'Please enter a valid email (example@domain.com)' 
              }
            })}
          />
          {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className={`${styles.formInput} ${errors.password && styles.errorInput}`}
            {...register('password', { 
              required: 'Password is required',
              minLength: { 
                value: 6, 
                message: 'Password must be at least 6 characters' 
              }
            })}
          />
          {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
        </div>

        {/* Repeat Password */}
        <div className={styles.formGroup}>
          <label htmlFor="repeatPassword">Repeat Password</label>
          <input
            id="repeatPassword"
            type="password"
            placeholder="Repeat Password"
            className={`${styles.formInput} ${errors.repeatPassword && styles.errorInput}`}
            {...register('repeatPassword', { 
              required: 'Please repeat your password',
              validate: value => 
                value === watch('password') || 'Passwords do not match'
            })}
          />
          {errors.repeatPassword && <span className={styles.errorText}>{errors.repeatPassword.message}</span>}
        </div>

        {/* Checkbox */}
        <div className={styles.agreeCheckbox}>
          <input
            id="agree"
            type="checkbox"
            className={`${styles.checkboxInput} ${errors.agree && styles.errorCheckbox}`}
            {...register('agree', { 
              required: 'You must agree to the terms' 
            })}
          />
          <label htmlFor="agree" className={styles.checkboxLabel}>
            I agree to the processing of my personal information
          </label>
          {errors.agree && <span className={styles.errorText}>{errors.agree.message}</span>}
        </div>

        {/* Submit Button */}
        <div className={styles.formSubmit}>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!isValid || isSubmitting || isLoading}
          >
            {(isSubmitting || isLoading) ? 'Processing...' : 'Create'}
          </button>
          <span className={styles.formSigninText}>
            Already have an account?{' '}
            <Link className={styles.formLink} to="/signIn">
              Sign In
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUp;