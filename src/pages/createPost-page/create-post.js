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
  } = useForm()
  const [createPost] = useCreatePostMutation()
  const history = useHistory()

  const addTag = () => {
    setTags([...tags, ''])
  }

  const removeTag = (index) => {
    if (tags.length > 1) {
      const newTags = [...tags]
      newTags.splice(index, 1)
      setTags(newTags)
    }
  }

  const handleTagChange = (index, value) => {
    const newTags = [...tags]
    newTags[index] = value
    setTags(newTags)
  }

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      tagList: tags.filter((tag) => tag.trim() !== ''),
    }
    await createPost(formData)
    history.push('/articles')
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
            {...register('title', { required: 'Title is required' })}
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
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <span className={styles.errorMessage}>{errors.description.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="body">Text</label>
          <textarea
            id="body"
            placeholder="Text"
            className={styles.postBodyInput}
            {...register('body', { required: 'Text is required' })}
          />
          {errors.body && <span className={styles.errorMessage}>{errors.body.message}</span>}
        </div>

        <div className={`${styles.formGroup} ${styles.tags}`}>
          <label htmlFor="tag">Tags </label>
          {tags.map((tag, index) => (
            <div className={styles.addTag} key={index}>
              <input
                type="text"
                placeholder="Tag"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
              />
              {index === tags.length - 1 ? (
                <>
                  <button type="button" className={styles.tagBtn} onClick={() => removeTag(index)}>
                    Delete
                  </button>
                  <button type="button" className={`${styles.tagBtn} ${styles.addTagBtn}`} onClick={addTag}>
                    Add tag
                  </button>
                </>
              ) : (
                <button type="button" className={styles.tagBtn} onClick={() => removeTag(index)}>
                  Delete
                </button>
              )}
            </div>
          ))}

          <button type="submit" className={styles.sendPost}>
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewPost
