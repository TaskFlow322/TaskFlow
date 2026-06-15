const express = require('express');
const router = express.Router({ mergeParams: true });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
router.get('/', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: 'Task not found' 
      });
    }

    const comments = await prisma.comment.findMany({
      where: { taskId: id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
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
      error: 'Failed to fetch comments' 
    });
  }
});

// POST /api/tasks/:id/comments
router.post('/', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, userId } = req.body;

    if (!content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content is required' 
      });
    }

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'UserId is required' 
      });
    }

    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: 'Task not found' 
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        taskId: id,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({ 
      success: true, 
      data: comment 
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create comment' 
    });
  }
});

// DELETE /api/tasks/:id/comments/:commentId
router.delete('/:commentId', async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId: id
      }
    });

    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        error: 'Comment not found' 
      });
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    res.json({ 
      success: true, 
      message: 'Comment deleted' 
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete comment' 
    });
  }
});

module.exports = router;
