import BaseRepository from './BaseRepository';
import { TDepartmentBase, TSchemaBase } from '../util/types';

class DepartmentRepository extends BaseRepository<TDepartmentBase & TSchemaBase> {
  //  Attributes

  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TDepartmentBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    super(table, columns, primary_key);
  }
}

//  Export
export default DepartmentRepository;
