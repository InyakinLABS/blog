import React, { useState } from "react";
import styles from './profile.module.scss';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEditUserMutation } from "../../services/api";
import { updateUser } from '../../services/authSlice';
import {debounce} from 'lodash'
const Profile = () => {
  const [serverError, setServerError] = useState(null);
  const currentUser = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [editUser, { isLoading }] = useEditUserMutation();
  
  const { 
    register,
    handleSubmit, 
    formState: { errors, isValid },
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      password: '',
      image: currentUser?.image || ''
    }
  });

  const onSubmit =debounce( async (formData) => {
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '')
      );
      
      const response = await editUser({ user: payload }).unwrap();
      dispatch(updateUser(response.user));
      setServerError(null);
      
      reset({ password: '' });
    } catch (error) {
      setServerError(error.data?.errors || 'Something went wrong');
    }
  },400);

  return (
    <div className={styles.regForm}>
      <p className={styles.formHeader}>Edit Profile Information</p>
      {serverError && (
  <div className={styles.errorMessage}>
    {typeof serverError === 'string' ? (
      <p>{serverError}</p>
    ) : (
      Object.entries(serverError).map(([key, value]) => {
        if (Array.isArray(value)) {
          return <p key={key}>{key}: {value.join(', ')}</p>;
        }
        return <p key={key}>{key}: {value}</p>;
      })
    )}
  </div>
)}
      
      <form className={styles.signupForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            className={styles.formInput}
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              },
              maxLength: {
                value: 20,
                message: 'Username must not exceed 20 characters'
              }
            })}
          />
          {errors.username && (
            <span className={styles.error}>{errors.username.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className={styles.formInput}
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">New password (leave blank to keep current)</label>
          <input
            type="password"
            id="password"
            placeholder="Enter new password"
            className={styles.formInput}
            {...register('password', {
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image">Avatar Image (URL)</label>
          <input
            type="url"
            id="image"
            placeholder="Avatar image URL"
            className={styles.formInput}
            {...register('image', {
              
            })}
          />
          {errors.image && (
            <span className={styles.error}>{errors.image.message}</span>
          )}
        </div>
        
        <div className={styles.formSubmit}>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;