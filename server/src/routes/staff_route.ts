import express from 'express';
import staff_controller from '../controllers/staff_controller';

//  Import router

const router = express.Router();

//  Build routes

router
  .route('/')
  .get(staff_controller.get_staff_batch)
  .post(staff_controller.create_staff_batch)
  .patch(staff_controller.update_staff_detail_batch)
  .delete(staff_controller.remove_staff_batch);

router.route('/activation').patch(staff_controller.update_staff_active_batch);
router.route('/empty').delete(staff_controller.empty_staff_all);

router.route('/:id').get(staff_controller.get_staff_by_id);

//  Export

export default router;
