import React, { useState, useEffect } from 'react'
import { Pagination, Spin, Flex } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { useGetArticlesQuery } from '../../services/api'
import { store } from '../../services/store'
import Post from '../Post/Post'

import styles from './post-list.module.scss'

const PostList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const queryArgs = React.useMemo(
    () => ({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    }),
    [currentPage, pageSize]
  )

  const { data, isLoading, isError, error, refetch } = useGetArticlesQuery(queryArgs)
  const { isLoggedIn } = store.getState().auth
  useEffect(() => {
    if (!isLoggedIn) refetch()
  }, [isLoggedIn, refetch])
  const articles = data?.articles || []
  const articlesCount = data?.articlesCount || 0

  if (isLoading)
    return (
      <Flex align="center" gap="middle" className={styles.spinner}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 52 }} spin />} />
      </Flex>
    )
  if (isError) return <div>Error: {error.message}</div>
  if (!articles.length) return <div>No articles found</div>

  const handleClick = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className={styles.container}>
      <ul className={styles.postList}>
        {articles.map((article) => (
          <Post key={article.slug + article.createdAt} article={article} />
        ))}
      </ul>
      <Pagination
        className={styles.customPagination}
        defaultCurrent={1}
        total={articlesCount}
        pageSize={5}
        showSizeChanger={false}
        onChange={handleClick}
      />
    </div>
  )
}

export default PostList
