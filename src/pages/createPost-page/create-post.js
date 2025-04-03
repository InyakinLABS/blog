// NewPost.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'

import { useCreatePostMutation } from '../../services/api'

import styles from './create-post.module.scss'

const NewPost = () => {
  const [tags, setTags] = useState([''])
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm()
  const [createPost] = useCreatePostMutation()
  const history = useHistory()

  const addTag = () => {
    if (tags[tags.length - 1].trim() === '') {
      setError('tags', { type: 'manual', message: 'Fill this field before adding a new one' })
      return
    }
    clearErrors('tags')
    setTags([...tags, ''])
  }

  const removeTag = (index) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
    if (newTags.length === 0) {
      setTags([''])
    }
    clearErrors('tags')
  }

  const handleTagChange = (index, value) => {
    const newTags = [...tags]
    newTags[index] = value
    setTags(newTags)
    clearErrors('tags')
  }

  const validateNotEmpty = (value) => {
    return value.trim() !== '' || 'Field cannot be empty or contain only spaces'
  }

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      tagList: tags.map((tag) => tag.trim()).filter((tag) => tag !== ''),
    }

    try {
      await createPost(formData)
      history.push('/articles')
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  return (
    <div className={styles.newPost}>
      <span className={styles.newPostTitle}>Create new article</span>
      <form className={styles.postForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            className={styles.titleInput}
            {...register('title', {
              required: 'Title is required',
              validate: validateNotEmpty,
            })}
          />
          {errors.title && <span className={styles.errorMessage}>{errors.title.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Short description</label>
          <input
            type="text"
            id="description"
            placeholder="Description"
            className={styles.titleInput}
            {...register('description', {
              required: 'Description is required',
              validate: validateNotEmpty,
            })}
          />
          {errors.description && <span className={styles.errorMessage}>{errors.description.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="body">Text</label>
          <textarea
            id="body"
            placeholder="Text"
            className={styles.postBodyInput}
            {...register('body', {
              required: 'Text is required',
              validate: validateNotEmpty,
            })}
          />
          {errors.body && <span className={styles.errorMessage}>{errors.body.message}</span>}
        </div>

        <div className={`${styles.formGroup} ${styles.tags}`}>
          <label htmlFor="tag">Tags</label>
          {tags.map((tag, index) => (
            <div className={styles.addTag} key={index}>
              <input
                type="text"
                placeholder="Tag"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
              />

              <>
                <button type="button" className={styles.tagBtn} onClick={() => removeTag(index)}>
                  Delete
                </button>
                {index === tags.length - 1 && (
                  <button type="button" className={`${styles.tagBtn} ${styles.addTagBtn}`} onClick={addTag}>
                    Add tag
                  </button>
                )}
              </>
            </div>
          ))}
          {errors.tags && <span className={styles.errorMessage}>{errors.tags.message}</span>}

          <button type="submit" className={styles.sendPost}>
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
export default NewPost
