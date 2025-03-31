import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Result, Button } from 'antd'

import { useRegisterUserMutation } from '../../services/api'

import styles from './signUp.module.scss'

const SignUp = () => {
  const [showResult, setShowResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [serverErrors, setServerErrors] = useState({})

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
    setError,
    clearErrors,
    trigger,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      repeatPassword: '',
      agree: false,
    },
  })

  const [registerUser, { isLoading }] = useRegisterUserMutation()

  // Точное регулярное выражение для email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  const onSubmit = async (formData) => {
    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap()

      setShowResult('success')
      reset()
      setServerErrors({})
    } catch (error) {
      if (error.data?.errors) {
        const { errors: serverErrors } = error.data
        setServerErrors(serverErrors)

        Object.keys(serverErrors).forEach((field) => {
          setError(field, {
            type: 'server',
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} ${serverErrors[field]}`,
          })
        })
      } else {
        setErrorMessage(error.message || 'Registration failed')
        setShowResult('error')
      }
    }
  }

  const handleInputChange = async (fieldName) => {
    if (serverErrors[fieldName]) {
      setServerErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
      clearErrors(fieldName)
    }
    await trigger(fieldName)
  }

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
            </Button>,
          ]}
        />
      </div>
    )
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
            </Button>,
          ]}
        />
      </div>
    )
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
            placeholder="Username (3-20 characters)"
            className={`${styles.formInput} ${(errors.username || serverErrors.username) && styles.errorInput}`}
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
              maxLength: {
                value: 20,
                message: 'Username must be no more than 20 characters',
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: 'Username can only contain letters and numbers',
              },
            })}
            onChange={() => handleInputChange('username')}
          />
          {(errors.username || serverErrors.username) && (
            <span className={styles.errorText}>{errors.username?.message || `Username ${serverErrors.username}`}</span>
          )}
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className={`${styles.formInput} ${(errors.email || serverErrors.email) && styles.errorInput}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: emailRegex,
                message: 'Please enter a valid email address',
              },
            })}
            onChange={() => handleInputChange('email')}
          />
          {(errors.email || serverErrors.email) && (
            <span className={styles.errorText}>{errors.email?.message || `Email ${serverErrors.email}`}</span>
          )}
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password (6-40 characters)"
            className={`${styles.formInput} ${(errors.password || serverErrors.password) && styles.errorInput}`}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
              maxLength: {
                value: 40,
                message: 'Password must be no more than 40 characters',
              },
            })}
            onChange={() => handleInputChange('password')}
          />
          {(errors.password || serverErrors.password) && (
            <span className={styles.errorText}>{errors.password?.message || `Password ${serverErrors.password}`}</span>
          )}
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
              validate: (value) => value === watch('password') || 'Passwords do not match',
            })}
            onChange={() => handleInputChange('repeatPassword')}
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
              required: 'You must agree to the terms',
            })}
          />
          <label htmlFor="agree" className={styles.checkboxLabel}>
            I agree to the processing of my personal information
          </label>
          {errors.agree && <span className={styles.errorText}>{errors.agree.message}</span>}
        </div>

        {/* Submit Button */}
        <div className={styles.formSubmit}>
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting || isLoading || !isValid}>
            {isSubmitting || isLoading ? 'Processing...' : 'Create'}
          </button>
          <span className={styles.formSigninText}>
            Already have an account?{' '}
            <Link className={styles.formLink} to="/sign-in">
              Sign In
            </Link>
          </span>
        </div>
      </form>
    </div>
  )
}

export default SignUp
