const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();

router.use(authMiddleware);


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Комментарий не найден' } 
      });
    }
    if (comment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Нет прав на удаление' } 
      });
    }

    await prisma.comment.delete({
      where: { id }
    });

    res.json({ 
      success: true, 
      message: 'Комментарий успешно удален' 
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Ошибка при удалении комментария' } 
    });
  }
});

module.exports = router;
