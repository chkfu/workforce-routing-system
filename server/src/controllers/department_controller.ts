import pool from '../database/pool';
import { Request, Response, NextFunction } from 'express';
import { handle_async } from '../util/handle_async';
import department_services from '../services/department_service';

type type_new_dept = {
  dept_name: string;
  dept_capacity: number;
  importance_weight: number;
};

//  SECTION: GET /api/v1/departments

//  SECTION: POST /api/v1/departments

const create_departments = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const dept_arr: type_new_dept[] = req.body.departments;

    let count: number = 1;
    let strings_arr: string[] = [];

    //  remarks: for batch insert, customised inserted values with new string
    //  learnt: prevent sql injection without inserting req.body directly.
    dept_arr.map(() => {
      let part_1 = count + 1;
      let part_2 = count + 2;
      let part_3 = count + 3;
      strings_arr.push(`(${part_1}, ${part_2}, ${part_3})`);
    });
    const dept_str_compound: string = strings_arr.join(', ');

    // reamrks: put the new string into service function to proceed
    const new_dept =
      await department_services.create_departments(dept_str_compound);
    res.status(201).json({
      status: 'success',
      data: {
        department: new_dept,
      },
    });
  },
);

//  Export

export default {
  create_departments,
};
