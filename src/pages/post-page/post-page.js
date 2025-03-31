import React from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import { HeartOutlined, HeartFilled, LoadingOutlined } from '@ant-design/icons'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Popconfirm, Flex, Spin, Alert } from 'antd'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

import { store } from '../../services/store'
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
  useGetArticleQuery,
  useDeletePostMutation,
} from '../../services/api'
import fallback from '../../components/header/Rectangle.svg'

import styles from './post-page.module.scss'
import 'highlight.js/styles/github.css'

const PostPage = () => {
  const { slug } = useParams()
  const { data: article, isLoading, error, refetch } = useGetArticleQuery(slug)
  const [favoriteArticle, { isLoading: isFavoriting }] = useFavoriteArticleMutation()
  const [unfavoriteArticle, { isLoading: isUnfavoriting }] = useUnfavoriteArticleMutation()
  const [deletePost] = useDeletePostMutation()
  const history = useHistory()

  if (isLoading)
    return (
      <Flex align="center" gap="middle" className={styles.spinner}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 52 }} spin />} />
      </Flex>
    )
  if (error)
    return (
      <Alert message="Что-то пошло не так:(" description={`${error.message}`} type="error" className={styles.spinner} />
    )
  if (!article) return null

  const { body, tagList, title, author, description, favoritesCount, createdAt, favorited } = article
  const { isLoggedIn, user } = store.getState().auth
  const userImage = author.image
  const creationDate = format(parseISO(createdAt), 'd MMMM yyyy', { locale: ru })

  const handleLike = async () => {
    try {
      if (favorited) {
        await unfavoriteArticle(slug).unwrap()
      } else {
        await favoriteArticle(slug).unwrap()
      }
      refetch()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deletePost(slug).unwrap()
      console.log('Успешно удален пост', slug)
      history.push('/')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className={styles.postPage}>
      <div className={styles.postHeader}>
        <div className={styles.headerInfo}>
          <span className={styles.postTitle}>{title}</span>
          <button
            className={styles.postLikes}
            onClick={handleLike}
            disabled={isFavoriting || isUnfavoriting || !isLoggedIn}
          >
            {favorited ? (
              <HeartFilled className={styles.likeIconActive} />
            ) : (
              <HeartOutlined className={styles.likeIcon} />
            )}
            <span>{favoritesCount}</span>
          </button>
        </div>
        <div className={styles.postAuthor}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{author.username}</span>
            <span className={styles.postDate}>{creationDate}</span>
          </div>
          <img className={styles.authorPic} src={userImage || fallback} alt="author" />
        </div>
      </div>
      <div className={styles.postTags}>
        {tagList.length !== 0 ? (
          tagList.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))
        ) : (
          <span>Нет тегов</span>
        )}
      </div>

      <div className={styles.postDescriptionContainer}>
        <div className={styles.postDescription}>{description}</div>
        {isLoggedIn && author.username === user.username ? (
          <div className={styles.postActions}>
            <Popconfirm
              placement="Right"
              title="Delete the post"
              description="Are you sure to delete this post?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <button className={`${styles.postBtn} ${styles.delete}`}>Delete</button>
            </Popconfirm>
            <Link to={`/articles/${slug}/edit`}>
              <button className={`${styles.postBtn} ${styles.edit}`}>Edit</button>
            </Link>
          </div>
        ) : null}
      </div>

      <div className={styles.postContent}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {body}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default PostPage
