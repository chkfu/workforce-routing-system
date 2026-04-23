import BaseService from '../../../core/BaseService';
import FinalIntakeRepository from './repository';
import { TFinalIntakeBase, TSchemaBase } from '../../../util/types';

//  Service class

class FinalIntakeService extends BaseService<TFinalIntakeBase & TSchemaBase> {
  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TFinalIntakeBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    const repository = new FinalIntakeRepository(table, columns, primary_key);
    super(table, columns, primary_key, repository);
  }
}

//  Export
export default FinalIntakeService;
