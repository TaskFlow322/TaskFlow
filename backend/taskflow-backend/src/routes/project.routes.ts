import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from '../controllers/project.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../validators/common.validator';
import {
  createProjectValidator,
  listProjectsValidator,
  projectIdParamValidator,
  updateProjectValidator,
} from '../validators/project.validator';

export const projectRouter = Router();

projectRouter.use(authMiddleware);

projectRouter.get('/', validate(listProjectsValidator), listProjects);
projectRouter.post('/', validate(createProjectValidator), createProject);
projectRouter.get('/:id', validate(projectIdParamValidator), getProject);
projectRouter.put(
  '/:id',
  validate([...projectIdParamValidator, ...updateProjectValidator]),
  updateProject
);
projectRouter.delete('/:id', validate(projectIdParamValidator), deleteProject);
