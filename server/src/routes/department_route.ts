import express from 'express';
import department_controller from '../controllers/department_controller';

//  Import routes
const router = express.Router();

//  Import routes
router
  .route('/')
  .get(department_controller.get_departments_batch)
  .post(department_controller.create_departments_batch)
  .patch(department_controller.update_department_details_batch)
  .delete(department_controller.remove_department_batch);

router.route('/:id').get(department_controller.get_department_by_id);

router
  .route('/activate')
  .patch(department_controller.activate_department_batch);

router
  .route('/inactivate')
  .patch(department_controller.inactivate_department_batch);

router.route('/empty').delete(department_controller.empty_department_all);

//  Export
export default router;
