import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addComment, deleteComment } from '../store/commentsSlice';
import { Comment } from '../types/comment.types';
import { Send, Trash2 } from 'lucide-react';

interface CommentListProps {
  taskId: number;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (userId: number): string => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-pink-500',
  ];
  return colors[userId % colors.length];
};

const formatRelativeTime = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'только что';
  if (diffMin < 60) return `${diffMin} мин. назад`;
  if (diffHour < 24) return `${diffHour} ч. назад`;
  if (diffDay < 7) return `${diffDay} дн. назад`;

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

const CommentList = ({ taskId }: CommentListProps) => {
  const { comments } = useSelector((state: RootState) => state.comments);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const taskComments = comments
    .filter((c) => c.taskId === taskId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useEffect(() => {
    // Прокрутка вниз при новых комментариях
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [taskComments.length]);

  const handleAddComment = () => {
    const trimmed = newComment.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);

    const comment: Comment = {
      id: Date.now(),
      taskId,
      userId: user?.id || 1,
      userName: user?.username || 'Пользователь',
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    dispatch(addComment(comment));
    setNewComment('');
    setIsSubmitting(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleDeleteComment = (id: number) => {
    dispatch(deleteComment(id));
  };

  return (
    <div>
      {/* Список комментариев */}
      <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
        {taskComments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Пока нет комментариев
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Напишите первым!
            </p>
          </div>
        ) : (
          taskComments.map((comment) => {
            const isOwn = comment.userId === (user?.id || 1);
            return (
              <div
                key={comment.id}
                className={`flex gap-3 group p-3 rounded-lg transition-colors ${
                  isOwn
                    ? 'bg-blue-50/50 dark:bg-blue-900/10'
                    : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                {/* Аватар */}
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(
                    comment.userId
                  )}`}
                >
                  {getInitials(comment.userName)}
                </div>

                {/* Контент */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {comment.userName}
                    </span>
                    {isOwn && (
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full">
                        Вы
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
                    {comment.text}
                  </p>
                </div>

                {/* Кнопка удаления */}
                {isOwn && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all flex-shrink-0 self-start"
                    title="Удалить комментарий"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Инпут для нового комментария */}
      <div className="flex gap-2 items-center">
        {/* Аватар текущего пользователя */}
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(
            user?.id || 1
          )}`}
        >
          {getInitials(user?.username || 'П')}
        </div>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Написать комментарий..."
            className="w-full pl-3 pr-10 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim() || isSubmitting}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all ${
              newComment.trim()
                ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentList;
