import BaseRepository from './BaseRepository';
import { TSltWeightBase, TSchemaBase } from '../util/types';

class SltWeightRepository extends BaseRepository<TSltWeightBase & TSchemaBase> {
  //  Attributes

  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TSltWeightBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    super(table, columns, primary_key);
  }
}

//  Export
export default SltWeightRepository;
