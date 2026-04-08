import { RequestHandler, Request, Response, NextFunction } from 'express';
import { handle_async } from '../util/handle_async';
import dept_repository from '../repositories/department_repository';
import { type_dept_row } from '../util/types';
import AppError from '../util/error_control/classes/AppError';
import ValueError from '../util/error_control/classes/ValueError';

//  GET /api/v1/departments
//  INPUT: none
const get_departments_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const departments = await dept_repository.get_departments_batch();
    //  error handling
    if (!departments) {
      return next(
        new AppError(404, '[DEPARTMENT] error: no department is found.'),
      );
    }
    //  normal response
    res.status(200).json({
      status: 'success',
      count: departments.length,
      data: {
        departments,
      },
    });
  },
);

//  GET /api/v1/departments/:id
//  INPUT: id in req.params
const get_department_by_id: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  remarks: in case of spec case as req.params['id'] is an array, normally string
    const id: string =
      typeof req.params['id'] === 'string'
        ? req.params['id']
        : req.params['id'][0];
    const department = await dept_repository.get_department_by_id(id);
    //  error handling
    if (!department) {
      return next(
        new AppError(404, '[DEPARTMENT] error: no department is found.'),
      );
    }
    //  normal response
    res.status(200).json({
      status: 'success',
      count: 1,
      data: {
        department: department,
      },
    });
  },
);

//  POST /api/v1/departments
//  INPUT: array of departments objects
const create_department_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  declarations
    const dept_arr: type_dept_row[] = req.body.departments;
    //  remarks: for batch insert, customised inserted values with new string
    //  learnt: prevent sql injection without inserting req.body directly.
    //  learnt: postgre `CREATE` runs in sequence, required Promise for handling batch items
    const departments = await Promise.all(
      dept_arr.map(async (el: type_dept_row) => {
        const { dept_name, dept_capacity, importance_weight, is_active } = el;
        // reamrks: put the new string into service function to proceed
        return dept_repository.create_department_batch(
          dept_name,
          dept_capacity,
          importance_weight,
          is_active,
        );
      }),
    );
    //  error handling
    if (!departments) {
      return next(
        new AppError(404, '[DEPARTMENT] error: no department is found.'),
      );
    }
    //  normal response
    res.status(201).json({
      status: 'success',
      count: departments.length,
      data: {
        departments,
      },
    });
  },
);

//  PATCH  /api/v1/departments
//  INPUT: array of id strings, single input for each column update (enable null)
const update_department_details_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  remarks: deduplicate ids into an array
    const id_arr: string[] = Array.from(
      new Set(
        req.body._ids.map((id: string | string[]) =>
          typeof id === 'string' ? id : id[0],
        ),
      ),
    );
    //  remarks: get the update values; null means keep existing value
    const { dept_name, dept_capacity, importance_weight, is_active } = req.body;
    const departments =
      //  remarks: enable leaving empty or null for unchanged, with sql `COALESCE`
      await dept_repository.update_department_details_batch(
        dept_name ?? null,
        dept_capacity ?? null,
        importance_weight ?? null,
        is_active ?? null,
        id_arr,
      );
    //  error handling
    if (!departments) {
      return next(
        new AppError(404, '[DEPARTMENT] error: no department is found.'),
      );
    }
    //  normal response
    res.status(200).json({
      status: 'success',
      count: departments.length,
      data: {
        departments,
      },
    });
  },
);

//  PATCH /api/v1/departments/activation
//  INPUT: array of department ids, is_active as boolean
//  remarks: for recovery for inactive records for flexibility
const update_department_active_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  declarations
    const id_arr: string[] = req.body._ids.map((id: string | string[]) =>
      typeof id === 'string' ? id : id[0],
    );
    const id_set: Set<string> = new Set(id_arr);
    const is_active: boolean | null = req.body.is_active ?? null;
    if (is_active == null) {
      return next(
        new ValueError(
          400,
          '[DEPARTMENT] error: invalid value input of req.body.is_active.',
        ),
      );
    }
    // remarks: update is_active as true
    const departments = await dept_repository.update_department_active_batch(
      Array.from(id_set),
      is_active,
    );
    //  error handling
    if (!departments) {
      return next(
        new AppError(404, '[DEPARTMENT] error: no department is found.'),
      );
    }
    //  normal response
    res.status(200).json({
      status: 'success',
      count: departments.length,
      data: {
        departments,
      },
    });
  },
);

//  DELETE  /api/v1/departments
//  INPUT: array of department ids
//  remarks: for forceful delete [for system admin only]
const remove_department_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  declarations
    const id_arr: string[] = req.body._ids.map((id: string | string[]) =>
      typeof id === 'string' ? id : id[0],
    );
    const id_set: Set<string> = new Set(id_arr);
    const departments = await dept_repository.remove_department_batch(
      Array.from(id_set),
    );
    if (departments.length < 1)
      return next(
        new AppError(404, '[DEPARTMENT] error: no department is found.'),
      );
    return res.status(204).send();
  },
);

//  DELETE  /api/v1/departments/empty
//  INPUT: null
//  remarks: return to empty table
const empty_department_all: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const departments = await dept_repository.empty_department_all();
    if (departments.length < 1)
      return next(
        new AppError(404, '[DEPARTMENT] error: no department is found.'),
      );
    return res.status(204).send();
  },
);

//  Export
export default {
  get_departments_batch,
  get_department_by_id,
  create_department_batch,
  update_department_details_batch,
  update_department_active_batch,
  remove_department_batch,
  empty_department_all,
};
