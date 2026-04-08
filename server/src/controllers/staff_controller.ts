import { RequestHandler, Request, Response, NextFunction } from 'express';
import { handle_async } from '../util/handle_async';
import AppError from '../util/error_control/AppError';
import staff_repository from '../repositories/staff_repository';
import { type_staff_row } from '../types';

//  GET  https://localhost:8080/api/v1/staff
//  INPUT:  null
const get_staff_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const staff = await staff_repository.get_staff_batch();
    //  error handling
    if (!staff) {
      return next(new AppError(404, '[STAFF] error: no staff is found.'));
    }
    //  normal response
    res.status(200).json({
      status: 'success',
      count: staff.length,
      data: {
        staff: staff,
      },
    });
  },
);

//  GET  https://localhost:8080/api/v1/staff/{:id}
//  INPUT:  id
const get_staff_by_id: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  get requested id
    const id: string =
      typeof req.params['id'] === 'string'
        ? req.params['id']
        : req.params['id'][0];
    const staff = await staff_repository.get_staff_by_id(id);
    //  error handling
    if (!staff) {
      return next(new AppError(404, '[STAFF] error: no staff is found.'));
    }
    //  normal response
    res.status(200).json({
      status: 'success',
      count: 1,
      data: {
        staff,
      },
    });
  },
);

//  POST  https://localhost:8080/api/v1/staff
//  INPUT:  first_name, last_name, gender, work_position, work_grade for compulsory
const create_staff_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  remarks: get staff array
    const staff_arr: type_staff_row[] = req.body.staff;
    const staff = await Promise.all(
      staff_arr.map((el: type_staff_row) => {
        const {
          first_name,
          last_name,
          gender,
          work_position,
          work_grade,
          work_email,
          work_ext,
          dept_id,
          date_hired,
          date_quit,
          is_active,
        } = el;
        return staff_repository.create_staff_batch(
          first_name,
          last_name,
          gender,
          work_position,
          work_grade,
          work_email,
          work_ext,
          dept_id,
          date_hired,
          date_quit,
          is_active,
        );
      }),
    );
    //  error handling
    if (staff.length < 1) {
      return next(
        new AppError(400, '[STAFF] error: failed to create staff batch.'),
      );
    }
    //  normal response
    res.status(201).json({
      status: 'success',
      count: staff.length,
      data: {
        staff,
      },
    });
  },
);

//  PATCH  https://localhost:8080/api/v1/staff
//  INPUT:  array of id strings, single input for each column update (enable null)
const update_staff_detail_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  remarks: get id list for update
    const id_arr: string[] = Array.from(
      new Set(
        req.body._ids.map((id: string | string[]) =>
          typeof id === 'string' ? id : id[0],
        ),
      ),
    );
    if (id_arr.length < 1) {
      return next(
        new AppError(400, '[STAFF] error: no staff id is provided for update.'),
      );
    }
    //  remarks: get the update values; null means keep existing value
    const {
      first_name,
      last_name,
      gender,
      work_position,
      work_grade,
      work_email,
      work_ext,
      dept_id,
      date_hired,
      date_quit,
      is_active,
    } = req.body;
    const staff = await staff_repository.update_staff_detail_batch(
      first_name,
      last_name,
      gender,
      work_position,
      work_grade,
      work_email,
      work_ext,
      dept_id,
      date_hired,
      date_quit,
      is_active,
      id_arr,
    );
    //  error handling
    if (staff.length < 1) {
      return next(
        new AppError(404, '[STAFF] error: no staff is found for update.'),
      );
    }
    //  normal response
    res.status(200).json({
      status: 'success',
      count: staff.length,
      data: {
        staff,
      },
    });
  },
);

//  DELETE  https://localhost:8080/api/v1/staff
//  INPUT:  array of ids
const remove_staff_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  remarks: get id list for deletion
    const id_arr: string[] = Array.from(
      new Set(
        req.body._ids.map((id: string | string[]) =>
          typeof id === 'string' ? id : id[0],
        ),
      ),
    );
    //  error handling
    if (id_arr.length < 1) {
      return next(
        new AppError(
          400,
          '[STAFF] error: no staff id is provided for deletion.',
        ),
      );
    }
    //  normal response
    const staff = await staff_repository.remove_staff_batch(id_arr);
    if (staff.length < 1) {
      return next(
        new AppError(404, '[STAFF] error: no staff is found for deletion.'),
      );
    }
    return res.status(204).send();
  },
);

//  DELETE  https://localhost:8080/api/v1/staff/empty
//  INPUT:  null
const empty_staff_all: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const staff = await staff_repository.empty_staff_all();
    if (staff.length < 1) {
      return next(
        new AppError(404, '[STAFF] error: no staff is found for deletion.'),
      );
    }
    return res.status(204).send();
  },
);

//  Export
export default {
  get_staff_batch,
  get_staff_by_id,
  create_staff_batch,
  update_staff_detail_batch,
  remove_staff_batch,
  empty_staff_all,
};
