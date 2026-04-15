/*
  [DISCLAIMER]

  Base Repository serves as centralised management of SQL queries
  between different tables. 
  
  Additional repository scripts will only serve for specific business requirements 
  for their affiliated table.
*/

import pool from '../infra/database/postgres';
import KeyError from '../util/errors/KeyError';
import ValueError from '../util/errors/ValueError';
import { TSchemaBase } from '../util/types';

/*
  learnt: 
  1.  prevent sql injection / malicious access
  -  initialised table name and column types in private attributes
  -  adopted parameter quotes for client input
  -  column validation with error handling
  2.  prevent keyword / case conflicts
  -  adopted identifier quotes at query string
*/

//   CLASS

abstract class BaseRepository<T> {
  //  1.  Attributes
  private table: string;
  private columns: Extract<keyof (T & TSchemaBase), string>[];
  private primary_key: string;

  //  2.  Constructor
  constructor(
    table: string,
    columns: Extract<keyof T, string>[],
    primary_key: string = '_id',
  ) {
    this.table = table;
    this.columns = columns;
    this.primary_key = primary_key;
  }

  //  3.  Methods

  //  3a.  GET methods

  //  remarks: GET batch records, potentially sorting
  //  INPUT: stringified for sort column, boolean for sort order
  public async get_record_batch(
    sort_col: string | null,
    is_ascending: boolean | null,
  ) {
    //  error handling
    //  learnt: required to convert into recognise type for column name string
    if (
      sort_col !== null &&
      !this.columns.includes(sort_col as Extract<keyof T, string>)
    ) {
      throw new ValueError(
        400,
        `[${this.table.toUpperCase()}] error: the provided column ${sort_col} is not found.`,
      );
    }
    if (sort_col != null && is_ascending == null) {
      throw new ValueError(
        400,
        `[${this.table.toUpperCase()}] error: sorted order is not provided.`,
      );
    }
    //  form query string
    let query_str = `SELECT * FROM "${this.table}"`;
    if (sort_col) {
      let rank_order: string = is_ascending ? 'ASC' : 'DESC';
      query_str += ` ORDER BY "${sort_col}" ${rank_order}`;
    }
    query_str += ';';
    //  querying
    const result = await pool.query(query_str);
    return result.rows ?? [];
  }

  //  remarks: GET specific record(s) by single / multiple id
  //  INPUT: array of stringified id
  public get_record_by_id = async (id: string) => {
    //  form query stirng
    let query_str: string = `SELECT * FROM "${this.table}" WHERE "${this.primary_key}" = $1;`;
    //  querying
    const result = await pool.query(query_str, [id]);
    return result.rows[0];
  };

  //  3b.  CREATE methods

  //  remarks: CREATE multiple records with same values
  //  INPUT: mapped data with designated record types
  public create_record_single = async (data: Omit<T, keyof TSchemaBase>) => {
    //  validation: check valid input
    if (!data)
      throw new ValueError(
        400,
        `[${this.table}] error: failed to create new record with missing input details.`,
      );

    //  declaration
    const key_arr: string[] = Object.keys(data);

    //  validation: check duplicate key inputs
    key_arr.forEach((key: string) => {
      //  1. validate column
      if (!this.columns.includes(key as Extract<keyof T, string>)) {
        throw new KeyError(
          400,
          `[${this.table.toUpperCase()}] error: the provided column ${key} is not found.`,
        );
      }
    });
    //  building query string
    const columns = key_arr.map((key: string) => `"${key}"`).join(', ');
    const placeholders = key_arr
      .map((_, index: number) => `$${index + 1}`)
      .join(', ');
    const values = key_arr.map(
      (key: string) => (data as Record<string, any>)[key],
    );
    //  querying
    const query = `
    INSERT INTO "${this.table}"
    (${columns})
    VALUES (${placeholders})
    RETURNING *;
  `;
    const result = await pool.query(query, values);
    return result.rows[0];
  };

  //  3c.  UPDATE methods

  //  remarks: UPDATE details for single or multiple records
  //  INPUT: array of numeric ids, and updated details with corresponding types
  update_record_details_batch = async (id_arr: string[], data: any) => {
    //  validation
    //  building query string
    const key_arr: string[] = Object.keys(data);
    const val_arr: any[] = Object.values(data);
    const id_placeholder: string = id_arr
      .map((_, index: number) => `$${key_arr.length + 1 + index}`)
      .join(', ');
    //  querying
    const result = await pool.query(
      `
        UPDATE "${this.table}"
        SET
          ${key_arr
            .map(
              (key: string, index: number) =>
                `"${key}" = COALESCE($${index + 1}, "${key}")`,
            )
            .join(', ')}
        WHERE ${this.primary_key} IN (${id_placeholder})
        RETURNING *;
      `,
      [...val_arr, ...id_arr],
    );
    return result.rows;
  };

  //  remarks: UPDATE is_active for single or multiple records
  //  INPUT: array of stringify id, boolean for is_active
  public update_record_active_batch = async (
    id_arr: string[],
    status: boolean,
  ) => {
    //  error handling
    if (!id_arr || status == null)
      throw new ValueError(
        400,
        `[${this.table.toUpperCase()}] error: failed to update without required information provided.`,
      );
    if (id_arr.length < 1)
      throw new ValueError(
        400,
        `[${this.table.toUpperCase()}] error: failed to update with missing id.`,
      );
    //  querying
    const placeholders = id_arr
      .map((_, index: number) => `$${index + 2}`)
      .join(', ');
    const result = await pool.query(
      `UPDATE "${this.table}"
        SET 
          is_active = $1, 
          updated_at = CURRENT_TIMESTAMP
        WHERE ${this.primary_key} IN (${placeholders})
        RETURNING *;`,
      [status, ...id_arr],
    );
    return result.rows.length === 1 ? result.rows[0] : result.rows;
  };

  //  3d.  DELETE methods

  //  remarks: DELETE multiple records by id
  //  INPUT: array of stringified id
  public remove_record_batch = async (id_arr: string[]) => {
    const placeholders = id_arr
      .map((_, index: number) => `$${index + 1}`)
      .join(', ');
    const result = await pool.query(
      `DELETE FROM "${this.table}" WHERE "${this.primary_key}" IN (${placeholders}) RETURNING *;`,
      id_arr,
    );
    return result.rows.length === 1 ? result.rows[0] : result.rows;
  };

  //  remarks: DELETE all records from table
  //  INPUT: null
  public empty_record_all = async () => {
    const result = await pool.query(`DELETE FROM "${this.table}" RETURNING *;`);
    return result.rows;
  };
}

//  Export

export default BaseRepository;
