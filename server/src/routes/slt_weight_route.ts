import express from 'express';
import SltWeightController from '../controllers/SltWeightController';
import { TSltWeightBase, TSchemaBase } from '../util/types';
import db_structure from '../util/config/db_structure';

//  Import router

const router = express.Router();

const slt_weight_controller = new SltWeightController(
  db_structure.slt_weight.table,
  [...db_structure.slt_weight.columns] as Extract<
    keyof (TSltWeightBase & TSchemaBase),
    string
  >[], // remarks: for suit into string[] required
  db_structure.slt_weight.primary_key,
);

//  Build routes

router
  .route('/')
  .get(slt_weight_controller.get_record_batch())
  .post(slt_weight_controller.create_record_batch())
  .patch(slt_weight_controller.update_record_details_batch())
  .delete(slt_weight_controller.remove_record_batch());

router
  .route('/activation')
  .patch(slt_weight_controller.update_record_active_batch());
router.route('/empty').delete(slt_weight_controller.empty_record_all());

router.route('/:id').get(slt_weight_controller.get_record_by_id());

//  Testort

export default router;
