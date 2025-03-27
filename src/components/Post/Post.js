import React from "react";
import fallback from '../../components/header/Rectangle.svg';
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import styles from './post.module.scss';
import { format, parseISO } from 'date-fns';
import { useFavoriteArticleMutation, useUnfavoriteArticleMutation } from '../../services/api';
import { ru } from 'date-fns/locale';

const Post = ({ article }) => {
  const {
    body,
    tagList,
    title,
    author,
    description,
    favoritesCount,
    createdAt,
    slug,
    favorited,
    
  } = article;

  const userImage = author.image;
  const [favoriteArticle, { isLoading: isFavoriting }] = useFavoriteArticleMutation();
  const [unfavoriteArticle, { isLoading: isUnfavoriting }] = useUnfavoriteArticleMutation();
  
  const creationDate = format(parseISO(createdAt), 'd MMMM yyyy', { locale: ru });

  const handleLike = async () => {
    try {
      if (favorited) {
        await unfavoriteArticle(slug).unwrap();
      } else {
        await favoriteArticle(slug).unwrap();
      }
    } catch (error) {
      console.error('Error:', error);
      // Можно добавить уведомление об ошибке
    }
  };

  return (
    <div className={styles.post}>
      <div className={styles.postHeader}>
        <div className={styles.headerInfo}>
          <span className={styles.postTitle}>{title}</span>
          <button 
            className={styles.postLikes}
            onClick={handleLike}
            disabled={isFavoriting || isUnfavoriting}
          >
            {favorited ? (
              <HeartFilled className={styles.likeIconActive} />
            ) : (
              <HeartOutlined className={styles.likeIcon} />
            )}
            <span>{favoritesCount}</span>
          </button>
          <div className={styles.postTags}>
            {tagList.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className={styles.postAuthor}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{author.username}</span>
            <span className={styles.postDate}>{creationDate}</span>
          </div>
          <img 
            className={styles.authorPic} 
            src={userImage || fallback} 
            alt="author" 
          />
        </div>
      </div>
      <div className={styles.postBody}>
        {description || body}
      </div>
    </div>
  );
};

export default Post;