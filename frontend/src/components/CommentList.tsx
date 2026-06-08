import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addComment, deleteComment } from '../store/commentsSlice';
import { Comment } from '../types/comment.types';
import { useToast } from '../context/ToastContext';

interface CommentListProps {
  taskId: number;
}

const CommentList = ({ taskId }: CommentListProps) => {
  const { comments } = useSelector((state: RootState) => state.comments);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState('');
  const { showToast } = useToast();

  const taskComments = comments.filter(c => c.taskId === taskId);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      taskId,
      userId: user?.id || 1,
      userName: user?.name || 'Пользователь',
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    dispatch(addComment(comment));
    setNewComment('');
    showToast('Комментарий добавлен', 'success');
  };

  const handleDeleteComment = (id: number) => {
    if (confirm('Удалить комментарий?')) {
      dispatch(deleteComment(id));
      showToast('Комментарий удалён', 'info');
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Комментарии ({taskComments.length})
      </h4>

      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {taskComments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {comment.userName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              {comment.userId === (user?.id || 1) && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  🗑️ Удалить
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {comment.text}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Написать комментарий..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
        />
        <button
          onClick={handleAddComment}
          className="px-3 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100"
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default CommentList;