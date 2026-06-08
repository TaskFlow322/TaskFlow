const { Router } = require('express');
const { PrismaClient } = require('@prisma/client');

const router = Router();
const prisma = new PrismaClient();

router.patch('/:taskId/order', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { order, status } = req.body;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }

    const data = {};
    if (order !== undefined) data.order = order;
    if (status !== undefined) data.status = status;

    const updated = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    return res.json(updated);
  } catch (error) {
    console.error('Order error:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// PATCH /api/tasks/reorder — drag & drop между колонками
// Body: { taskId: "uuid", newStatus: "done", newOrder: 0 }
router.patch('/reorder', async (req, res) => {
  try {
    const { taskId, newStatus, newOrder } = req.body;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }

    const oldStatus = task.status;
    const oldOrder = task.order;

    await prisma.task.updateMany({
      where: {
        projectId: task.projectId,
        status: oldStatus,
        order: { gt: oldOrder },
      },
      data: { order: { decrement: 1 } },
    });
    await prisma.task.updateMany({
      where: {
        projectId: task.projectId,
        status: newStatus,
        order: { gte: newOrder },
      },
      data: { order: { increment: 1 } },
    });

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus, order: newOrder },
    });

    return res.json(updated);
  } catch (error) {
    console.error('Reorder error:', error);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
