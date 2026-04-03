import { Request, Response, NextFunction } from 'express';
import { handle_async } from '../util/handle_async';
import department_services from '../services/department_service';
import { count } from 'console';

type type_new_dept = {
  dept_name: string;
  dept_capacity: number;
  importance_weight: number;
};

//  GET /api/v1/departments
//  INPUT: none
const get_departments_batch = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const departments = await department_services.get_departments_batch();
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
const get_department_by_id = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  remarks: in case of spec case as req.params['id'] is an array, normally string
    const id: string =
      typeof req.params['id'] === 'string'
        ? req.params['id']
        : req.params['id'][0];
    const department = await department_services.get_department_by_id(id);
    res.status(200).json({
      status: 'success',
      count: 1,
      data: {
        department,
      },
    });
  },
);

//  POST /api/v1/departments
//  INPUT: array of departments objects
const create_departments_batch = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  declarations
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
    const departments =
      await department_services.create_departments_batch(dept_str_compound);
    res.status(201).json({
      status: 'success',
      count: departments.length,
      data: {
        departments,
      },
    });
  },
);

//  PATCH /api/v1/departments
//  INPUT: array of id strings, single input for each column update (enable null)
const update_department_details_batch = handle_async(
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
      await department_services.update_department_details_batch(
        dept_name ?? null,
        dept_capacity ?? null,
        importance_weight ?? null,
        is_active ?? null,
        id_arr,
      );
    res.status(200).json({
      status: 'success',
      count: departments.length,
      data: {
        departments,
      },
    });
  },
);

//  PATCH /api/v1/departments/activate
//  INPUT: array of department ids
//  remarks: for recovery for inactive records for flexibility
const activate_department_batch = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  declarations
    const id_arr: string[] = req.body._ids.map((id: string | string[]) =>
      typeof id === 'string' ? id : id[0],
    );
    const id_set: Set<string> = new Set(id_arr);
    // remarks: update is_active as true
    const departments = await department_services.activate_department_batch(
      Array.from(id_set),
    );
    res.status(200).json({
      status: 'success',
      count: departments.length,
      data: {
        departments,
      },
    });
  },
);

//  PATCH /api/v1/departments/inactivate
//  INPUT: array of department ids
//  remartks: for soft-deletion, records will still be kept in database
const inactivate_department_batch = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  declarations
    const id_arr: string[] = req.body._ids.map((id: string | string[]) =>
      typeof id === 'string' ? id : id[0],
    );
    const id_set: Set<string> = new Set(id_arr);
    // remarks: update is_active as false
    const departments = await department_services.inactivate_department_batch(
      Array.from(id_set),
    );
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
const remove_department_batch = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    //  declarations
    const id_arr: string[] = req.body._ids.map((id: string | string[]) =>
      typeof id === 'string' ? id : id[0],
    );
    const id_set: Set<string> = new Set(id_arr);
    await department_services.remove_department_batch(Array.from(id_set));
    res.status(204).send();
  },
);

//  DELETE  /api/v1/departments/empty
//  INPUT: null
//  remarks: return to empty table
const empty_department_all = handle_async(
  async (req: Request, res: Response, next: NextFunction) => {
    await department_services.empty_department_all();
    res.status(204).send();
  },
);

//  Export

export default {
  get_departments_batch,
  get_department_by_id,
  create_departments_batch,
  update_department_details_batch,
  activate_department_batch,
  inactivate_department_batch,
  remove_department_batch,
  empty_department_all,
};
