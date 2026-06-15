const express = require('express');
const router = express.Router({ mergeParams: true });
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth'); 

const prisma = new PrismaClient();


router.use(authMiddleware);


router.get('/', async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Задача не найдена' } 
      });
    }

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ 
      success: true, 
      data: comments 
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Ошибка при получении комментариев' } 
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; 

    if (!content || !content.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Содержание комментария обязательно' } 
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Задача не найдена' } 
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({ 
      success: true, 
      data: comment,
      message: 'Комментарий добавлен'
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Ошибка при создании комментария' } 
    });
  }
});

module.exports = router;
