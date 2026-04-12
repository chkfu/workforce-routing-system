import BaseRepository from './BaseRepository';
import { TStaffBase, TSchemaBase } from '../util/types';

class StaffRepository extends BaseRepository<TStaffBase & TSchemaBase> {
  //  Attributes

  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TStaffBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    super(table, columns, primary_key);
  }
}

//  Export
export default StaffRepository;
