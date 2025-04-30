import { useState } from 'react';
import axios from 'axios';
import '../styles/TaskForm.css';

function TaskForm({ onTaskAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'Medium',
    due_date: '',
    tags: [],
    progress: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');

  const categories = ['General', 'Work', 'Personal', 'Shopping', 'Health', 'Education'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        'https://muhaitheef.infinityfreeapp.com/tasks/add_task.php',
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        setFormData({
          title: '',
          description: '',
          category: 'General',
          priority: 'Medium',
          due_date: '',
          tags: [],
          progress: 0
        });
        onTaskAdded();
      } else {
        alert('Error: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter task title"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter task description"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={isSubmitting}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              disabled={isSubmitting}
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="due_date">Due Date</label>
          <input
            type="datetime-local"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <div className="tags-input">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag and press Enter"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              disabled={isSubmitting}
            />
            <button type="button" onClick={handleAddTag} disabled={isSubmitting}>
              Add
            </button>
          </div>
          <div className="tags-list">
            {formData.tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="progress">Progress (%)</label>
          <input
            type="range"
            id="progress"
            name="progress"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />
          <span className="progress-value">{formData.progress}%</span>
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;