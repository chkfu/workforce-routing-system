import BaseRepository from './BaseRepository';
import { TSltCriteriaBase, TSchemaBase } from '../util/types';

class SltCriteriaRepository extends BaseRepository<
  TSltCriteriaBase & TSchemaBase
> {
  //  Attributes

  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TSltCriteriaBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    super(table, columns, primary_key);
  }
}

//  Export
export default SltCriteriaRepository;
