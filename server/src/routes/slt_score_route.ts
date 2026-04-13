import express from 'express';
import SltScoreController from '../controllers/SltScoreController';
import { TSltScoreBase, TSchemaBase } from '../util/types';
import db_structure from '../util/config/db_structure';

//  Import router

const router = express.Router();

const slt_score_controller = new SltScoreController(
  db_structure.slt_score.table,
  [...db_structure.slt_score.columns] as Extract<
    keyof (TSltScoreBase & TSchemaBase),
    string
  >[], // remarks: for suit into string[] required
  db_structure.slt_score.primary_key,
);

//  Build routes

router
  .route('/')
  .get(slt_score_controller.get_record_batch())
  .post(slt_score_controller.create_record_batch())
  .patch(slt_score_controller.update_record_details_batch())
  .delete(slt_score_controller.remove_record_batch());

router
  .route('/activation')
  .patch(slt_score_controller.update_record_active_batch());
router.route('/empty').delete(slt_score_controller.empty_record_all());

router.route('/:id').get(slt_score_controller.get_record_by_id());

//  Testort

export default router;
