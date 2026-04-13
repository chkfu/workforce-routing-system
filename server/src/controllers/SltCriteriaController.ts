import BaseController from './BaseController';
import { TSltCriteriaBase, TSchemaBase } from '../util/types';
import SltCriteriaRepository from '../repositories/SltCriteriaRepository';

//  Declarations

class SltCriteriaController extends BaseController<
  TSltCriteriaBase & TSchemaBase
> {
  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TSltCriteriaBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    const repository = new SltCriteriaRepository(table, columns, primary_key);
    super(table, columns, primary_key, repository);
  }
}

//  Export
export default SltCriteriaController;
