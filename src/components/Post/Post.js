import React from 'react'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Link } from 'react-router-dom'

import { useFavoriteArticleMutation, useUnfavoriteArticleMutation } from '../../services/api'
import fallback from '../../components/header/Rectangle.svg'
import { store } from '../../services/store'

import styles from './post.module.scss'

const Post = ({ article }) => {
  const { body, tagList, title, author, favoritesCount, createdAt, slug, favorited } = article
  const { isLoggedIn } = store.getState().auth

  const userImage = author.image
  const [favoriteArticle, { isLoading: isFavoriting }] = useFavoriteArticleMutation()
  const [unfavoriteArticle, { isLoading: isUnfavoriting }] = useUnfavoriteArticleMutation()

  const creationDate = format(parseISO(createdAt), 'd MMMM yyyy', { locale: ru })

  const handleLike = async () => {
    try {
      if (favorited) {
        await unfavoriteArticle(slug).unwrap()
      } else {
        await favoriteArticle(slug).unwrap()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <div className={styles.headerInfo}>
          <Link to={`/articles/${slug}`}>
            <span className={styles.postTitle}>{title}</span>
          </Link>
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
        {tagList.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className={styles.postBody}>{body}</div>
    </div>
  )
}

export default Post
