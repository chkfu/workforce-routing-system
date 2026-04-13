import BaseController from './BaseController';
import { TSltScoreBase, TSchemaBase } from '../util/types';
import SltScoreRepository from '../repositories/SltScoreRepository';
//  Declarations

class SltScoreController extends BaseController<TSltScoreBase & TSchemaBase> {
  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TSltScoreBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    const repository = new SltScoreRepository(table, columns, primary_key);
    super(table, columns, primary_key, repository);
  }
}

//  Export
export default SltScoreController;
