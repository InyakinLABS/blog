import React  from "react";
import Post from "../Post/Post";
import './post-list.scss';
import { Pagination ,Spin,Flex} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useGetArticlesQuery } from "../../services/api";
import { useState,useEffect } from "react";
import { store } from "../../services/store";

const PostList = () => {

  
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
 
    const queryArgs = React.useMemo(() => ({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      }), [currentPage, pageSize]);
    
      const { data, isLoading, isError,error,refetch} = useGetArticlesQuery(queryArgs);
  const {isLoggedIn} =store.getState().auth;
  useEffect(() => {
    if (!isLoggedIn) refetch();
  }, [isLoggedIn, refetch]);
  const articles = data?.articles || [];
  const articlesCount = data?.articlesCount || 0;
console.log(data);
  if (isLoading) return(
  <Flex align="center" gap="middle" className="spinner">
  <Spin indicator={<LoadingOutlined style={{ fontSize: 52 }} spin />} />
</Flex>);
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
            key={article.slug + article.createdAt} 
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