import express from 'express';
import BaseController from '../controllers/BasicController';
import { TDepartmentBase } from '../util/types';

//  Import router

const router = express.Router();

//  Setup new controller
//  for binding entry criteria, added 'satisfies readonly (keyof TDepartmentBase)'
const department_cols = [
  'dept_name',
  'dept_capacity',
  'importance_weight',
  'is_active',
] as const satisfies readonly (keyof TDepartmentBase)[];

const dept_controller = new BaseController<TDepartmentBase>(
  'departments',
  [...department_cols], // remarks: for suit into string[] required
  '_id',
);

//  Build routes

router
  .route('/')
  .get(dept_controller.get_record_batch())
  .post(dept_controller.create_record_batch())
  .patch(dept_controller.update_record_details_batch());
// .delete(dept_controller.remove_department_batch);

router.route('/activation').patch(dept_controller.update_record_active_batch());
// router.route('/empty').delete(dept_controller.empty_department_all);

router.route('/:id').get(dept_controller.get_record_by_id());

//  Export

export default router;
