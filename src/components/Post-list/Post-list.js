import React  from "react";
import Post from "../Post/Post";
import './post-list.scss';
import { Pagination } from 'antd';
import { useGetArticlesQuery } from "../../services/api";
import { useState } from "react";

const PostList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Количество статей на странице
  
    // Параметры запроса будут автоматически обновляться при изменении currentPage
    const queryArgs = React.useMemo(() => ({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      }), [currentPage, pageSize]);
    
      const { data, isLoading, isError,error } = useGetArticlesQuery(queryArgs);
  const articles = data?.articles || [];
  const articlesCount = data?.articlesCount || 0;
console.log(data);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!articles.length) return <div>No articles found</div>;
const handleClick=(page)=>{
    setCurrentPage(page);
}
  return (
    <div className="container">
      <ul className="post-list">
        {articles.map(article => (
          <Post 
            key={article.slug + article.tagList[0]} 
            article={article} 
          />
        ))}
      </ul>
      <Pagination 
        className="custom-pagination" 
        defaultCurrent={1}
        total={articlesCount}
        pageSize={5}
        showSizeChanger={false}
        onChange={handleClick}
      />
    </div>
  );
};

export default PostList;