import { RequestHandler, Request, Response, NextFunction } from 'express';
import { handle_async } from '../util/handle_async';
import AppError from '../util/error_control/classes/AppError';
import ValueError from '../util/error_control/classes/ValueError';
import RepositoryFactory from '../repositories/BaseRepository';
import { type_staff_row } from '../util/types';
import { TStaffBase } from '../util/types';

//  learnt: align to keys of type with read-only
//  reamrks: skipped the auto updated cols (_id, created_at, updated_at)
const staff_cols = [
  'first_name',
  'last_name',
  'gender',
  'work_position',
  'work_grade',
  'work_email',
  'work_ext',
  'dept_id',
  'date_hired',
  'date_quit',
  'is_active',
] as const satisfies readonly (keyof TStaffBase)[];

const staff_repository = new RepositoryFactory(
  'staff',
  [...staff_cols], //  remarks: hard-code, as fail to get column name from types
  '_id',
);

//  1.  GET methods

//  GET  https://localhost:8080/api/v1/staff
//  INPUT:  null
const get_staff_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const staff = await staff_repository.get_record_batch(null, null);
    //  validation: check received records
    if (!staff) {
      return next(new ValueError(404, '[STAFF] error: no staff is found.'));
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

//  GET /api/v1/staff/:id
//  INPUT: id in req.params
const get_staff_by_id: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  remarks: this.primary_key is development setting, skip column validation
    //  remarks: in case of spec case as req.params['id'] is an array, normally string
    //  leanrt: express `params` always return string, but not affect in schema types
    const id: string =
      typeof req.params['id'] === 'string'
        ? req.params['id']
        : req.params['id'][0];
    const staff = await staff_repository.get_record_by_id(id);
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

//  2.  CREATE mehtods

//  POST /api/v1/staff
//  INPUT: array of staff objects
const create_staff_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  declarations
    const staff_arr: any = req.body.staff;
    //  remarks: for batch insert, customised inserted values with new string
    //  learnt: prevent sql injection without inserting req.body directly.
    //  learnt: postgre `CREATE` runs in sequence, required Promise for handling batch items
    const staff = await Promise.all(
      staff_arr.map(async (el: any) => {
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
        // reamrks: put the new string into service function to proceed
        return staff_repository.create_record_single({
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
        });
      }),
    );
    //  error handling
    if (!staff || staff.length < 1) {
      return next(new AppError(404, '[STAFF] error: no staff is found.'));
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

//  3.  PATCH methods

//  PATCH  /api/v1/staff
//  INPUT: array of id strings, single input for each column update (enable null)
const update_staff_details_batch: RequestHandler = handle_async(
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
    const staff =
      //  remarks: enable leaving empty or null for unchanged, with sql `COALESCE`
      await staff_repository.update_record_details_batch(id_arr, {
        first_name: first_name,
        last_name: last_name,
        gender: gender ?? null,
        work_position: work_position,
        work_grade: work_grade,
        work_email: work_email ?? null,
        work_ext: work_ext ?? null,
        dept_id: dept_id ?? null,
        date_hired: date_hired ?? null,
        date_quit: date_quit ?? null,
        is_active: is_active ?? null,
      });
    //  error handling
    if (!staff || staff.length < 1) {
      return next(new AppError(404, '[STAFF] error: no staff is found.'));
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

//  PATCH /api/v1/staff/activation
//  INPUT: array of staff ids, is_active as boolean
//  remarks: for recovery for inactive records for flexibility
const update_staff_active_batch: RequestHandler = handle_async(
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
          '[STAFF] error: invalid value input of req.body.is_active.',
        ),
      );
    }
    // remarks: update is_active as true
    const staff = await staff_repository.update_record_active_batch(
      Array.from(id_set),
      is_active,
    );
    //  error handling
    if (!staff || staff.length < 1) {
      return next(new AppError(404, '[STAFF] error: no staff is found.'));
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

//  4.  DELETE methods

//  DELETE  /api/v1/staff
//  INPUT: array of staff ids
//  remarks: for forceful delete [for system admin only]
const remove_staff_batch: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  declarations
    const id_arr: string[] = req.body._ids.map((id: string | string[]) =>
      typeof id === 'string' ? id : id[0],
    );
    const id_set: Set<string> = new Set(id_arr);
    const staff = await staff_repository.remove_record_batch(
      Array.from(id_set),
    );
    if (staff.length < 1)
      return next(new AppError(404, '[STAFF] error: no staff is found.'));
    return res.status(204).send();
  },
);

//  DELETE  /api/v1/staff/empty
//  INPUT: null
//  remarks: return to empty table
const empty_staff_all: RequestHandler = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const staff = await staff_repository.empty_record_all();
    if (staff.length < 1)
      return next(new AppError(404, '[STAFF] error: no staff is found.'));
    return res.status(204).send();
  },
);

//  Export
export default {
  get_staff_batch,
  get_staff_by_id,
  create_staff_batch,
  update_staff_details_batch,
  update_staff_active_batch,
  remove_staff_batch,
  empty_staff_all,
};
