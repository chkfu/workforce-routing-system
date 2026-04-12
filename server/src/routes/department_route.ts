import express from 'express';
import DepartmentsController from '../controllers/DepartmentsController';
import { TDepartmentBase, TSchemaBase } from '../util/types';
import db_structure from '../util/config/db_structure';

//  Import router

const router = express.Router();

const dept_controller = new DepartmentsController(
  db_structure.departments.table,
  [...db_structure.departments.columns] as Extract<
    keyof (TDepartmentBase & TSchemaBase),
    string
  >[], // remarks: for suit into string[] required
  db_structure.departments.primary_key,
);

//  Build routes

router
  .route('/')
  .get(dept_controller.get_record_batch())
  .post(dept_controller.create_record_batch())
  .patch(dept_controller.update_record_details_batch())
  .delete(dept_controller.remove_record_batch());

router.route('/activation').patch(dept_controller.update_record_active_batch());
router.route('/empty').delete(dept_controller.empty_record_all());

router.route('/:id').get(dept_controller.get_record_by_id());

//  Export

export default router;
