import express from 'express';
import SltCriteriaController from '../controllers/SltCriteriaController';
import { TSltCriteriaBase, TSchemaBase } from '../util/types';
import db_structure from '../util/config/db_structure';

//  Import router

const router = express.Router();

const slt_criteria_controller = new SltCriteriaController(
  db_structure.slt_criteria.table,
  [...db_structure.slt_criteria.columns] as Extract<
    keyof (TSltCriteriaBase & TSchemaBase),
    string
  >[], // remarks: for suit into string[] required
  db_structure.slt_criteria.primary_key,
);

//  Build routes

router
  .route('/')
  .get(slt_criteria_controller.get_record_batch())
  .post(slt_criteria_controller.create_record_batch())
  .patch(slt_criteria_controller.update_record_details_batch())
  .delete(slt_criteria_controller.remove_record_batch());

router
  .route('/activation')
  .patch(slt_criteria_controller.update_record_active_batch());
router.route('/empty').delete(slt_criteria_controller.empty_record_all());

router.route('/:id').get(slt_criteria_controller.get_record_by_id());

//  Testort

export default router;
