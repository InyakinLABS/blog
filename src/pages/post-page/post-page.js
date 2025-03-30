import React from "react";
import { useParams } from "react-router-dom";
import fallback from '../../components/header/Rectangle.svg';
import { HeartOutlined, HeartFilled,LoadingOutlined } from "@ant-design/icons";
import './post-page.scss';
import { format, parseISO } from 'date-fns';
import { useFavoriteArticleMutation, useUnfavoriteArticleMutation, useGetArticleQuery, useDeletePostMutation } from '../../services/api';
import { ru } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { store } from "../../services/store";
import { useHistory } from "react-router-dom";
import { Popconfirm ,Flex,Spin,Alert} from "antd";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
const PostPage = () => {
  const { slug } = useParams();
  const { data: article, isLoading, error, refetch } = useGetArticleQuery(slug);
  const [favoriteArticle, { isLoading: isFavoriting }] = useFavoriteArticleMutation();
  const [unfavoriteArticle, { isLoading: isUnfavoriting }] = useUnfavoriteArticleMutation();
  const [deletePost]=useDeletePostMutation();
  const history=useHistory()
  if (isLoading) return (
    <Flex align="center" gap="middle" className="spinner">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 52 }} spin />} />
    </Flex>
  );
  if (error) return (
    <Alert
    message="Что-то пошло не так:("
    description={`${error.message}`}
    type="error"
    className="spinner"
  />  
);
  if (!article) return null;

  const {
    body,
    tagList,
    title,
    author,
    description,
    favoritesCount,
    createdAt,
    favorited,
  } = article;
  
  const { isLoggedIn, user } = store.getState().auth;
  const userImage = author.image;
  const creationDate = format(parseISO(createdAt), 'd MMMM yyyy', { locale: ru });

  const handleLike = async () => {
    try {
      if (favorited) {
        await unfavoriteArticle(slug).unwrap();
      } else {
        await favoriteArticle(slug).unwrap();
      }
      refetch();
    } catch (error) {
      console.error('Error:', error);
    }
  };
const handleDelete=async ()=>{
    
    try{
        await deletePost(slug).unwrap();
        console.log('Успешно удален пост',slug);
        history.push('/');
    }  catch (error) {
        console.error('Error:', error);
      }
}


  return (
    <div className="post-page">
      <div className="post-header">
        <div className="header-info">
          <span className="post-title">{title}</span>
          <button 
            className="post-likes"
            onClick={handleLike}
            disabled={isFavoriting || isUnfavoriting || !isLoggedIn}
          >
            {favorited ? (
              <HeartFilled className="like-icon-active" />
            ) : (
              <HeartOutlined className="like-icon" />
            )}
            <span>{favoritesCount}</span>
          </button>
        </div>
        <div className="post-author">
          <div className="author-info">
            <span className="author-name">{author.username}</span>
            <span className="post-date">{creationDate}</span>
          </div>
          <img 
            className="author-pic" 
            src={userImage || fallback} 
            alt="author" 
          />
        </div>
      </div>
      <div className="post-tags">
        {tagList.length!==0?(tagList.map((tag,index) => (
          <span key={index} className="tag">{tag}</span>
        ))):(<span>Нет тегов</span>)}
      </div>
      
      <div className="post-description-container">
        
        <div className="post-description">
          {description}
        </div>
        {(isLoggedIn && author.username === user.username)? (
          <div className="post-actions">
             <Popconfirm
             placement="Right"
    title="Delete the post"
    description="Are you sure to delete this post?"
    onConfirm={handleDelete}
    okText="Yes"
    cancelText="No"
  >
    <button className="post-btn delete">Delete</button>
  </Popconfirm>
            <Link to={`/articles/${slug}/edit`}>
            <button className="post-btn edit">Edit</button>
            </Link>
          </div>
        ):null}
      </div>

      <div className="post-content">
        <ReactMarkdown remarkPlugins={[
      remarkGfm,
    ]} rehypePlugins={[rehypeHighlight]}>{body}</ReactMarkdown>
      </div>
    </div>
  );
};

export default PostPage;