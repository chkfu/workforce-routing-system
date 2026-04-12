import BaseController from './BasicController';
import DepartmentRepository from '../repositories/DepartmentRepository';
import { TDepartmentBase, TSchemaBase } from '../util/types';

//  CLASS

class DepartmentsController extends BaseController<
  TDepartmentBase & TSchemaBase
> {
  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TDepartmentBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    const repository = new DepartmentRepository(table, columns, primary_key);
    super(table, columns, primary_key, repository);
  }
}

//  Export
export default DepartmentsController;
