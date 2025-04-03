import React, { useEffect } from 'react'
import { Pagination, Spin, Alert } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useHistory, useLocation } from 'react-router-dom'

import { useGetArticlesQuery } from '../../services/api'
import { store } from '../../services/store'
import Post from '../Post/Post'

import styles from './post-list.module.scss'

const PAGE_SIZE = 5

const PostList = () => {
  const { search, pathname } = useLocation()
  const history = useHistory()

  const page = new URLSearchParams(search).get('page') || '1'
  const currentPage = Math.max(1, parseInt(page, 10)) || 1

  const { data, isLoading, isError, error, refetch } = useGetArticlesQuery({
    limit: PAGE_SIZE,
    offset: (currentPage - 1) * PAGE_SIZE,
  })
  const { isLoggedIn } = store.getState().auth
  useEffect(() => {
    if (!isLoggedIn) refetch()
  }, [isLoggedIn, refetch])
  const articles = data?.articles || []
  const articlesCount = data?.articlesCount || 0
  const handlePageChange = (page) => {
    history.push(`${pathname}?page=${page}`)
  }

  if (isLoading) return <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  if (isError)
    return (
      <Alert message="Что-то пошло не так:(" description={`${error.message}`} type="error" className={styles.spinner} />
    )
  if (!data?.articles?.length) return <div>No articles found</div>

  return (
    <div className={styles.container}>
      <ul className={styles.postList}>
        {articles.map((article) => (
          <Post key={article.slug} article={article} />
        ))}
      </ul>
      {data.articlesCount > PAGE_SIZE && (
        <Pagination
          current={currentPage}
          total={articlesCount}
          pageSize={PAGE_SIZE}
          onChange={handlePageChange}
          className={styles.customPagination}
          showSizeChanger={false}
        />
      )}
    </div>
  )
}

export default PostList
