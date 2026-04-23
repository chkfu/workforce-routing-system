import BaseRepository from '../../../core/BaseRepository';
import { TFinalIntakeBase, TSchemaBase } from '../../../util/types';

//  Repository class

class FinalIntakeRepository extends BaseRepository<
  TFinalIntakeBase & TSchemaBase
> {
  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TFinalIntakeBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    super(table, columns, primary_key);
  }
}

//  Export
export default FinalIntakeRepository;
