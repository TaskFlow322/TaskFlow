import { useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { getSocket, disconnectSocket } from '../services/socket';

interface TaskEventPayload {
  id: string;
  title: string;
  status: string;
}

interface TaskMovedPayload {
  id: string;
  previousStatus: string;
  status: string;
  title?: string;
}

const STATUS_LABELS: Record<string, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export const useTaskSocket = (active: boolean) => {
  const { showToast } = useToast();

  useEffect(() => {
    if (!active) return;

    const socket = getSocket();

    socket.on('task:created', (data: TaskEventPayload) => {
      showToast(`Новая задача: «${data.title}»`, 'info');
    });

    socket.on('task:updated', (data: TaskEventPayload) => {
      showToast(`Задача обновлена: «${data.title}»`, 'success');
    });

    socket.on('task:moved', (data: TaskMovedPayload) => {
      const to = STATUS_LABELS[data.status] ?? data.status;
      const label = data.title ? `«${data.title}» → ${to}` : `Задача перемещена в ${to}`;
      showToast(label, 'info');
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:moved');
      disconnectSocket();
    };
  }, [active, showToast]);
};
