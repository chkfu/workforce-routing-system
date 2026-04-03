import express from 'express';
import department_controller from '../controllers/department_controller';

//  Import routes
const router = express.Router();

//  Import routes
router.route('/').post(department_controller.create_departments);

//  Export
export default router;
