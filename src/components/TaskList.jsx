import { useState } from 'react';
import axios from 'axios';
import '../styles/TaskList.css';

function TaskList({ tasks, refreshTasks }) {
  const [expandedTask, setExpandedTask] = useState(null);

  const handleMarkDone = async (id) => {
    try {
      const response = await axios.post(
        'http://localhost/task-manager-project/backend/tasks/update_task.php',
        {
          id: id,
          status: 'Done',
          progress: 100
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        refreshTasks();
      } else {
        console.error('Error updating task:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.post('http://localhost/task-manager-project/backend/tasks/delete_task.php', {
          id: id
        });
        refreshTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleUpdateProgress = async (id, progress) => {
    try {
      const response = await axios.post(
        'http://localhost/task-manager-project/backend/tasks/update_task.php',
        {
          id: id,
          progress: progress
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        refreshTasks();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return '#4CAF50';
      case 'Medium': return '#FFC107';
      case 'High': return '#FF9800';
      case 'Urgent': return '#F44336';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="task-list-container">
      <h2>Task List</h2>
      {tasks.length === 0 ? (
        <div className="no-tasks">No tasks yet. Add your first task above!</div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.status === 'Done' ? 'completed' : ''}`}
              onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
            >
              <div className="task-header">
                <span className="task-category">{task.category}</span>
                <span
                  className="task-priority"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
              </div>

              <h3 className="task-title">{task.title}</h3>

              {task.description && (
                <p className="task-description">
                  {expandedTask === task.id ? task.description : `${task.description.substring(0, 100)}...`}
                </p>
              )}

              <div className="task-meta">
                <div className="task-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{task.progress}%</span>
                </div>

                <div className="task-due-date">
                  <i className="calendar-icon">📅</i>
                  {formatDate(task.due_date)}
                </div>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="task-tags">
                  {JSON.parse(task.tags).map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}

              <div className="task-actions">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={task.progress}
                  onChange={(e) => handleUpdateProgress(task.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkDone(task.id);
                  }}
                  className="action-button done-button"
                  disabled={task.status === 'Done'}
                >
                  {task.status === 'Done' ? 'Completed' : 'Mark as Done'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(task.id);
                  }}
                  className="action-button delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;