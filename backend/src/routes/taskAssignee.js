const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const router = Router();
const prisma = new PrismaClient();

router.patch('/:taskId/assignee', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assigneeId } = req.body;

    // Существует ли задача
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }

    // Если назначаем — проверить, что юзер в проекте
    if (assigneeId) {
      const member = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: task.projectId,
            userId: assigneeId,
          },
        },
      });

      if (!member) {
        return res.status(400).json({
          message: 'Пользователь не является участником проекта',
        });
      }
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { assigneeId: assigneeId || null },
      include: {
        assignee: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    return res.json(updated);
  } catch (error) {
    console.error('Assignee error:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
