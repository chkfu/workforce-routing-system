import express from 'express';
import FinalIntakeController from './controller';
import { TFinalIntakeBase, TSchemaBase } from '../../../util/types';
import db_structure from '../../../util/config/db_structure';

//  Import router

const router = express.Router();

const final_intake_controller = new FinalIntakeController(
  db_structure.final_intakes.table,
  [...db_structure.final_intakes.columns] as Extract<
    keyof (TFinalIntakeBase & TSchemaBase),
    string
  >[], // remarks: for suit into string[] required
  db_structure.final_intakes.primary_key,
);

//  Build routes

router
  .route('/')
  .get(final_intake_controller.get_record_batch())
  .post(final_intake_controller.create_record_batch())
  .patch(final_intake_controller.update_record_details_batch())
  .delete(final_intake_controller.remove_record_batch());

router
  .route('/activation')
  .patch(final_intake_controller.update_record_active_batch());
router.route('/empty').delete(final_intake_controller.empty_record_all());

router.route('/:id').get(final_intake_controller.get_record_by_id());

//  Testort

export default router;
