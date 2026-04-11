/*
  [DISCLAIMER]

  Types is the centralised storage of type managements for different section.
  These types specified those frequent used and complex structured types for
  better maintenance.
*/

//  tags: departments, staff
export type TSchemaBase = {
  _id: number;
  created_at: Date;
  updated_at: Date;
};

//  tags: departments
export type TDepartmentBase = {
  dept_name: string;
  dept_capacity?: number;
  importance_weight?: number;
  is_active: boolean;
};

//  tags: staff
export type TStaffBase = {
  first_name: string;
  last_name: string;
  gender?: string;
  work_position: string;
  work_grade: string;
  work_email?: string;
  work_ext?: string;
  dept_id?: number;
  date_hired?: Date;
  date_quit?: Date;
  is_active: boolean;
};
