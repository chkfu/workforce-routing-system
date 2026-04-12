import BaseController from './BasicController';
import { TStaffBase, TSchemaBase } from '../util/types';
import StaffRepository from '../repositories/StaffRepository';
//  Declarations

class StaffController extends BaseController<TStaffBase & TSchemaBase> {
  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TStaffBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    const repository = new StaffRepository(table, columns, primary_key);
    super(table, columns, primary_key, repository);
  }
}

//  Export
export default StaffController;
