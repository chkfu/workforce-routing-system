import BaseController from '../../../core/BaseController';
import { TFinalIntakeBase, TSchemaBase } from '../../../util/types';
import FinalIntakeService from './service';

//  Controller class

class FinalIntakeController extends BaseController<
  TFinalIntakeBase & TSchemaBase
> {
  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TFinalIntakeBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    const service = new FinalIntakeService(table, columns, primary_key);
    super(table, columns, primary_key, service);
  }
}

//  Export
export default FinalIntakeController;
