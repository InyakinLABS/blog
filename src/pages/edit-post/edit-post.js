import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'

import { useGetArticleQuery, useEditPostMutation } from '../../services/api'

import styles from './edit-post.module.scss'

const EditPost = () => {
  const { slug } = useParams()
  const history = useHistory()
  const { data: article, isLoading, refetch } = useGetArticleQuery(slug)
  const [editPost] = useEditPostMutation()
  const [tags, setTags] = useState([''])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  useEffect(() => {
    if (article) {
      reset({
        title: article.title || '',
        description: article.description || '',
        body: article.body || '',
      })

      if (article.tagList && article.tagList.length > 0) {
        setTags([...article.tagList])
      } else {
        setTags([''])
      }
    }
  }, [article, reset])

  const addTag = () => {
    setTags([...tags, ''])
  }

  const removeTag = (index) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
    if (newTags.length === 0) {
      setTags([''])
    }
  }

  const handleTagChange = (index, value) => {
    const newTags = [...tags]
    newTags[index] = value
    setTags(newTags)
  }
  const validateNotEmpty = (value) => {
    return value.trim() !== '' || 'Field cannot be empty or contain only spaces'
  }

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        tagList: tags.filter((tag) => tag.trim() !== ''),
      }
      console.log('form submitted', formData)
      const response = await editPost({
        slug,
        ...formData,
      }).unwrap()
      console.log(response)
      refetch()
      history.push(`/articles/${slug}`)
    } catch (error) {
      console.error('Failed to update article:', error)
    }
  }

  if (isLoading) return <div className={styles.loading}>Loading...</div>
  return (
    <div className={styles.newPost}>
      <span className={styles.newPostTitle}>Edit article</span>
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
                id="tag"
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
export default EditPost
