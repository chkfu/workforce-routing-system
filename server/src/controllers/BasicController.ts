/*
  [DISCLAIMER]

  Base Controller serves as centralised management of CRUD functionalities
  between different tables. 
  
  Additional controller scripts will only serve for specific business requirements 
  for their affiliated table.
*/

import { RequestHandler, Request, Response, NextFunction } from 'express';
import { handle_async } from '../util/middlewares/handle_async';
import BaseRepository from '../repositories/BaseRepository';
import AppError from '../util/error_control/collection/AppError';
import ValueError from '../util/error_control/collection/ValueError';
import { TSchemaBase } from '../util/types';

//  CLASS

class BaseController<T> {
  //  Attributes
  private table: string;
  private columns: Extract<keyof T, string>[]; // remarks: customised for spec types from tables
  private primary_key: string;
  private repository: BaseRepository<T>;

  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof T, string>[],
    primary_key: string,
  ) {
    this.table = table;
    this.columns = columns;
    this.primary_key = primary_key;
    this.repository = new BaseRepository(
      this.table,
      this.columns, //  remarks: hard-code, as fail to get column name from types
      this.primary_key,
    );
  }

  //  Methods

  //  1.  GET methods

  //  GET /api/v1/{table_name}
  //  INPUT: null
  //  remarks: exception for empty checks, as empty is also the info for clients
  public get_record_batch = (): RequestHandler =>
    handle_async(async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.repository.get_record_batch(null, null);
      //  validation: check received records
      if (!result) {
        return next(
          new ValueError(
            404,
            `[${this.table.toUpperCase()}] error: no record is found.`,
          ),
        );
      }
      //  normal response
      res.status(200).json({
        status: 'success',
        count: result.length,
        data: {
          result,
        },
      });
    });

  //  GET /api/v1/{table_name}/:id
  //  INPUT: id in req.params
  public get_record_by_id = (): RequestHandler =>
    handle_async(async (req: Request, res: Response, next: NextFunction) => {
      //  remarks: this.primary_key is development setting, skip column validation
      //  remarks: in case of spec case as req.params['id'] is an array, normally string
      //  leanrt: express `params` always return string, but not affect in schema types
      const id = req.params['id'] as string;
      const record = await this.repository.get_record_by_id(id);
      //  error handling
      if (!record) {
        return next(
          new AppError(
            404,
            `[${this.table.toUpperCase()}] error: no record is found.`,
          ),
        );
      }
      //  normal response
      res.status(200).json({
        status: 'success',
        count: 1,
        data: {
          record,
        },
      });
    });

  //  2.  POST methods

  //  POST /api/v1/{table_name}
  //  INPUT: array of record objects
  public create_record_batch = (): RequestHandler =>
    handle_async(async (req: Request, res: Response, next: NextFunction) => {
      //  declarations
      const obj_arr: any = req.body[this.table];
      //  remarks: for batch insert, customised inserted values with new string
      //  learnt: prevent sql injection without inserting req.body directly.
      //  learnt: postgre `CREATE` runs in sequence, required Promise for handling batch items
      const records = await Promise.all(
        //  learnt: clear the type with unknown first, then exercise the omit type
        obj_arr.map(async (el: any) => {
          const new_item = Object.fromEntries(
            this.columns.map((key) => [key, el[key]]),
          ) as unknown as Omit<T, keyof TSchemaBase>;
          // reamrks: put the new string into service function to proceed
          return this.repository.create_record_single(new_item);
        }),
      );
      //  error handling
      if (!records || records.length < 1) {
        return next(
          new AppError(
            404,
            `[${this.table.toUpperCase()}] error: no record is found.`,
          ),
        );
      }
      //  normal response
      res.status(201).json({
        status: 'success',
        count: records.length,
        data: {
          records,
        },
      });
    });

  //  3.  PATCH methods

  //  PATCH  /api/v1/{table_name}
  //  INPUT: array of id strings, single input for each column update (enable null)
  public update_record_details_batch = (): RequestHandler =>
    handle_async(async (req: Request, res: Response, next: NextFunction) => {
      //  remarks: deduplicate ids into an array
      const id_arr: string[] = Array.from(
        new Set(
          req.body._ids.map((id: string | string[]) =>
            typeof id === 'string' ? id : id[0],
          ),
        ),
      );
      //  learnt: get the update values; null means keep existing value
      const update_data = Object.fromEntries(
        //  remarks: enable leaving empty or null for unchanged, with sql `COALESCE`
        this.columns.map((key) => [key, req.body[key] ?? null]),
      );
      const records = await this.repository.update_record_details_batch(
        id_arr,
        update_data,
      );
      //  error handling
      if (!records || records.length < 1) {
        return next(
          new AppError(
            404,
            `[${this.table.toUpperCase()}] error: no record is found.`,
          ),
        );
      }
      //  normal response
      res.status(200).json({
        status: 'success',
        count: records.length,
        data: {
          records,
        },
      });
    });

  //  PATCH /api/v1/{table_name}/activation
  //  INPUT: array of records ids, is_active as boolean
  //  remarks: for recovery for inactive records for flexibility
  public update_record_active_batch = (): RequestHandler =>
    handle_async(async (req: Request, res: Response, next: NextFunction) => {
      //  declarations
      const id_arr: string[] = req.body._ids.map((id: string | string[]) =>
        typeof id === 'string' ? id : id[0],
      );
      const id_set: Set<string> = new Set(id_arr);
      const is_active: boolean | null = req.body.is_active ?? null;
      if (is_active == null) {
        return next(
          new ValueError(
            400,
            `[${this.table.toUpperCase()}] error: invalid value input of req.body.is_active.`,
          ),
        );
      }
      // remarks: update is_active as true
      const records = await this.repository.update_record_active_batch(
        Array.from(id_set),
        is_active,
      );
      //  error handling
      if (!records || records.length < 1) {
        return next(
          new AppError(
            404,
            `[${this.table.toUpperCase()}] error: no record is found.`,
          ),
        );
      }
      //  normal response
      res.status(200).json({
        status: 'success',
        count: records.length,
        data: {
          records,
        },
      });
    });

  //  4.  DELETE methods

  //  DELETE  /api/v1/{table_name}
  //  INPUT: array of record ids
  //  remarks: for forceful delete [for system admin only]
  public remove_record_batch = (): RequestHandler =>
    handle_async(async (req: Request, res: Response, next: NextFunction) => {
      //  declarations
      const id_arr: string[] = req.body._ids.map((id: string | string[]) =>
        typeof id === 'string' ? id : id[0],
      );
      const id_set: Set<string> = new Set(id_arr);
      const records = await this.repository.remove_record_batch(
        Array.from(id_set),
      );
      if (records.length < 1)
        return next(
          new AppError(
            404,
            `[${this.table.toUpperCase()}] error: no record is found.`,
          ),
        );
      return res.status(204).send();
    });

  //  DELETE  /api/v1/{table_name}/empty
  //  INPUT: null
  //  remarks: return to empty table [for system admin only]
  public empty_record_all = (): RequestHandler =>
    handle_async(async (req: Request, res: Response, next: NextFunction) => {
      const records = await this.repository.empty_record_all();
      if (records.length < 1)
        return next(
          new AppError(
            404,
            `[${this.table.toUpperCase()}] error: no record is found.`,
          ),
        );
      return res.status(204).send();
    });
}

//  Export

export default BaseController;
