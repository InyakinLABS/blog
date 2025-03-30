import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetArticleQuery, useEditPostMutation } from "../../services/api";
import styles from './edit-post.module.scss';
import { useHistory, useParams } from "react-router-dom";

const EditPost = () => {
  const { slug } = useParams();
  const history = useHistory();
  const { data: article, isLoading,refetch } = useGetArticleQuery(slug);
  const [editPost] = useEditPostMutation();
  const [tags, setTags] = useState([""]);

  const { 
    register,
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    if (article) {
      reset({
        title: article.title || "",
        description: article.description || "",
        body: article.body || ""
      });
      
      if (article.tagList && article.tagList.length > 0) {
        setTags([...article.tagList]);
      } else {
        setTags([""]);
      }
    }
  }, [article, reset]);

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const removeTag = (index) => {
    if (tags.length > 1) {
      const newTags = [...tags];
      newTags.splice(index, 1);
      setTags(newTags);
    }
  };

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const onSubmit = async (data) => {
    try {
      const formData = {
          ...data,
          tagList: tags.filter(tag => tag.trim() !== "")
      };
      console.log('form submitted',formData);
     const response=  await editPost({ 
        slug, 
        ...formData 
      }).unwrap();
     console.log(response);
     refetch();
      history.push(`/articles/${slug}`);
    } catch (error) {
      console.error("Failed to update article:", error);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

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
            {...register("title", { required: "Title is required" })}
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
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <span className={styles.errorMessage}>{errors.description.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="body">Text</label>
          <textarea
            id="body"
            placeholder="Text"
            className={styles.postBodyInput}
            {...register("body", { required: "Text is required" })}
          />
          {errors.body && <span className={styles.errorMessage}>{errors.body.message}</span>}
        </div>

        <div className={`${styles.formGroup} ${styles.tags}`}>
          <label>Tags</label>
          {tags.map((tag, index) => (
            <div className={styles.tagRow} key={index}>
              <input
                type="text"
                placeholder="Tag"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                className={styles.tagInput}
              />
              <div className={styles.tagButtons}>
              {index === tags.length - 1 ? (
                <>
                  <button 
                    type="button" 
                    className="tag-btn"
                    onClick={() => removeTag(index)}
                  >
                    Delete
                  </button>
                  {
                    <button 
                      type="button" 
                      className="tag-btn add-tag"
                      onClick={addTag}
                    >
                      Add tag
                    </button>
                  }
                </>
              ) : (
                <button 
                  type="button" 
                  className="tag-btn"
                  onClick={() => removeTag(index)}
                >
                  Delete
                </button>
              )}
              </div>
            </div>
          ))}
          
          <button type="submit" className={styles.sendPost} disabled={Object.keys(errors).length > 0}>
            Update Article
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;