import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import { useLoginUserMutation } from '../../services/api'
import { loginStart, loginSuccess, loginFailure } from '../../services/authSlice'

import styles from './login-page.module.scss'

const Login = () => {
  const [formError, setFormError] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    mode: 'onTouched',
  })

  const dispatch = useDispatch()
  const [loginUser, { isLoading }] = useLoginUserMutation()

  const onSubmit = async (data) => {
    try {
      dispatch(loginStart())
      clearErrors()
      setFormError(null)

      const userData = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap()

      dispatch(loginSuccess(userData))
    } catch (error) {
      console.log(formError)
      // Обработка ошибки в формате {"errors":{"email or password":"is invalid"}}
      if (error && error['email or password']) {
        const errorMessage = 'Email or password is invalid'
        setFormError(errorMessage)
        setError('email', { type: 'server', message: errorMessage })
        setError('password', { type: 'server', message: errorMessage })
      } else {
        const errorMessage = error.message || 'Something went wrong'
        setFormError(errorMessage)
      }

      dispatch(loginFailure(error?.message || 'Login failed'))
    }
  }

  return (
    <div className={styles.regForm}>
      <p className={styles.formHeader}>Sign In</p>

      {/* Общая ошибка формы */}
      <span className={styles.formError}>{formError}</span>
      <form className={styles.signupForm} onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            className={`${styles.formInput} ${errors.email ? styles.errorInput : ''}`}
            onChange={() => clearErrors('email')}
          />
        </div>

        {/* Password Field */}
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            className={`${styles.formInput} ${errors.password ? styles.errorInput : ''}`}
            onChange={() => clearErrors('password')}
          />
        </div>

        {/* Submit Button */}
        <div className={styles.formSubmit}>
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? 'Logging in...' : 'Login'}
          </button>
          <span className={styles.formSigninText}>
            Don&apos;t have an account?{' '}
            <Link className={styles.formLink} to="/sign-up">
              Sign Up
            </Link>
          </span>
        </div>
      </form>
    </div>
  )
}

export default Login
