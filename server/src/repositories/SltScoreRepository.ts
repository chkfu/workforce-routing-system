import BaseRepository from './BaseRepository';
import { TSltScoreBase, TSchemaBase } from '../util/types';

class SltScoreRepository extends BaseRepository<TSltScoreBase & TSchemaBase> {
  //  Attributes

  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TSltScoreBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    super(table, columns, primary_key);
  }
}

//  Export
export default SltScoreRepository;
