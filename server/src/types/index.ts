export type type_dept_row = {
  _id: string;
  dept_name: string;
  dept_capacity: number;
  importance_weight: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type type_staff_row = {
  first_name: string;
  last_name: string;
  gender: enum_gender;
  work_position: string;
  work_grade: enum_staff_grade;
  work_email: string | null;
  work_ext: string | null;
  dept_id: number | null;
  date_hired: Date | null;
  date_quit: Date | null;
  is_active: boolean;
};
