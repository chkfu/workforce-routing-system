import express from 'express';
import dept_controller from '../controllers/department_controller';

//  Import router

const router = express.Router();

//  Build routes

router
  .route('/')
  .get(dept_controller.get_departments_batch)
  .post(dept_controller.create_department_batch)
  .patch(dept_controller.update_department_details_batch)
  .delete(dept_controller.remove_department_batch);

router
  .route('/activation')
  .patch(dept_controller.update_department_active_batch);
router.route('/empty').delete(dept_controller.empty_department_all);

router.route('/:id').get(dept_controller.get_department_by_id);

//  Export

export default router;
