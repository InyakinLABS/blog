import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreatePostMutation } from "../../services/api";
import './create-post.scss';
import { useHistory } from "react-router-dom";

const NewPost = () => {
  const [tags, setTags] = useState([""]);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const[createPost]=useCreatePostMutation();
const history=useHistory();
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

  const onSubmit = async(data) => {
    const formData = {
      ...data,
      tagList: tags.filter(tag => tag.trim() !== "")
    };
    console.log("Form submitted:", formData);
    const response=await createPost(formData);
    console.log(response);
    history.push('/articles')
  };

  return (
    <div className="new-post">
      <span className="new-post-title">Create new article</span>
      <form className="post-form" onSubmit={handleSubmit(onSubmit)}>
        <div className='formGroup'>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            className='title-input'
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <span className="error-message">{errors.title.message}</span>}
        </div>

        <div className='formGroup'>
          <label htmlFor="description">Short description</label>
          <input
            type="text"
            id="description"
            placeholder="Description"
            className='title-input'
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <span className="error-message">{errors.description.message}</span>}
        </div>

        <div className='formGroup'>
          <label htmlFor="body">Text</label>
          <textarea
            id="body"
            placeholder="Text"
            className='post-body-input'
            {...register("body", { required: "Text is required" })}
          />
          {errors.body && <span className="error-message">{errors.body.message}</span>}
        </div>

        <div className='formGroup tags'>
          <label htmlFor="tag">Tags </label>
          {tags.map((tag, index) => (
            <div className="addtag" key={index}>
              <input
                type="text"
                placeholder="Tag"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
              />
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
          ))}
          
          <button type="submit" className="send-post">Send</button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;