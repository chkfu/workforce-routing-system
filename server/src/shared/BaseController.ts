/*
  [DISCLAIMER]

  Base Controller serves as centralised management of CRUD functionalities
  between different tables. 
  
  Additional controller scripts will only serve for specific requirements 
  for their affiliated table. Decide whether the shared methods should be
  specifically disabled or altered.
*/

import { RequestHandler, Request, Response, NextFunction } from 'express';
import { handle_async } from '../infra/middlewares/handle_async';
import BaseService from './BaseService';

//  Controller class

abstract class BaseController<T> {
  //  Attributes
  protected table: string;
  protected columns: Extract<keyof T, string>[]; // remarks: customised for spec types from tables
  protected primary_key: string;
  protected service: BaseService<T>;

  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof T, string>[],
    primary_key: string,
    service: BaseService<T>,
  ) {
    this.table = table;
    this.columns = columns;
    this.primary_key = primary_key;
    this.service = service;
  }

  //  Methods

  //  1.  GET methods

  //  GET /api/v1/{table_name}
  //  INPUT: null
  public get_record_batch = (): RequestHandler =>
    handle_async(async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.service.get_record_batch();
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
      const id: string = req.params['id'] as string;
      const record = await this.service.get_record_by_id(id);
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
      const obj_arr: any = req.body[this.table];
      const records = await this.service.create_record_batch(obj_arr);
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
      const records = await this.service.update_record_details_batch(req.body);
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
  public update_record_active_batch = (): RequestHandler =>
    handle_async(async (req: Request, res: Response, next: NextFunction) => {
      // remarks: update is_active as true
      const records = await this.service.update_record_active_batch(req.body);
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
  public remove_record_batch = (): RequestHandler =>
    handle_async(async (req: Request, res: Response, next: NextFunction) => {
      //  declarations
      const id_arr: string[] = req.body._ids.map((id: string | string[]) =>
        typeof id === 'string' ? id : id[0],
      );
      await this.service.remove_record_batch(id_arr);
      return res.status(204).send();
    });

  //  DELETE  /api/v1/{table_name}/empty
  //  INPUT: null
  //  remarks: return to empty table [for system admin only]
  public empty_record_all = (): RequestHandler =>
    handle_async(async (req: Request, res: Response, next: NextFunction) => {
      const records = await this.service.empty_record_all();
      return res.status(204).send();
    });
}

//  Export

export default BaseController;
