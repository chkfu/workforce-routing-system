import BaseController from './BaseController';
import { TSltWeightBase, TSchemaBase } from '../util/types';
import SltWeightRepository from '../repositories/SltWeightRepository';
//  Declarations

class SltWeightController extends BaseController<TSltWeightBase & TSchemaBase> {
  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TSltWeightBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    const repository = new SltWeightRepository(table, columns, primary_key);
    super(table, columns, primary_key, repository);
  }
}

//  Export
export default SltWeightController;
