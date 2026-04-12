import express from 'express';
import BaseController from '../controllers/BasicController';
import { TStaffBase, TSchemaBase } from '../util/types';
import db_structure from '../util/config/db_structure';

//  Import router

const router = express.Router();

const staff_controller = new BaseController<TStaffBase & TSchemaBase>(
  db_structure.staff.table,
  [...db_structure.staff.columns] as Extract<
    keyof (TStaffBase & TSchemaBase),
    string
  >[], // remarks: for suit into string[] required
  db_structure.staff.primary_key,
);

//  Build routes

router
  .route('/')
  .get(staff_controller.get_record_batch())
  .post(staff_controller.create_record_batch())
  .patch(staff_controller.update_record_details_batch())
  .delete(staff_controller.remove_record_batch());

router
  .route('/activation')
  .patch(staff_controller.update_record_active_batch());
router.route('/empty').delete(staff_controller.empty_record_all());

router.route('/:id').get(staff_controller.get_record_by_id());

//  Export

export default router;
