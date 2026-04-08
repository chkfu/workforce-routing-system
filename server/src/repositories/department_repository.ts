import pool from '../database/pool';

//  Build service functions

//  1.  GET methods

//  remarks: empty table refers to empty list, not necessary to crash the query
const get_departments_batch = async () => {
  const result = await pool.query(
    `SELECT * FROM departments
    ORDER BY _id ASC;`,
  );
  return result.rows ?? [];
};

const get_department_by_id = async (id: string) => {
  const result = await pool.query(`SELECT * FROM departments WHERE _id = $1;`, [
    id,
  ]);
  return result.rows[0];
};

//  2.  POST methods

//  learnt: `returning *` for returning inserted records, not available for `SELECT` methods
const create_department_batch = async (
  dept_name: string,
  dept_capacity: number,
  importance_weight: number,
  is_active: boolean,
) => {
  const result = await pool.query(
    `INSERT INTO departments 
     (dept_name, dept_capacity, importance_weight, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
    [dept_name, dept_capacity, importance_weight, is_active],
  );
  return result.rows;
};

//  3. PATCH methods

const update_department_details_batch = async (
  dept_name: string | null,
  dept_capacity: number | null,
  importance_weight: number | null,
  is_active: boolean | null,
  id_arr: string[],
) => {
  const result = await pool.query(
    `UPDATE departments
     SET dept_name = COALESCE($1, dept_name), dept_capacity = COALESCE($2, dept_capacity), importance_weight = COALESCE($3, importance_weight), updated_at = CURRENT_TIMESTAMP, is_active = COALESCE($4, is_active)
     WHERE _id = ANY($5)
     RETURNING *;`,
    [dept_name, dept_capacity, importance_weight, is_active, id_arr],
  );
  return result.rows;
};

const update_department_active_batch = async (
  id_arr: string[],
  status: boolean,
) => {
  const result = await pool.query(
    `UPDATE departments
     SET is_active = $1, updated_at = CURRENT_TIMESTAMP
     WHERE _id = ANY($2)
     RETURNING *;`,
    [status, id_arr],
  );
  return result.rows;
};

//  4. DELETE methods

const remove_department_batch = async (id_arr: string[]) => {
  const result = await pool.query(
    `DELETE FROM departments
    WHERE _id = ANY($1) RETURNING *;`,
    [id_arr],
  );
  return result.rows;
};

const empty_department_all = async () => {
  const result = await pool.query(`DELETE FROM departments RETURNING *;`);
  return result.rows;
};

//  Export

export default {
  get_departments_batch,
  get_department_by_id,
  create_department_batch,
  update_department_details_batch,
  update_department_active_batch,
  remove_department_batch,
  empty_department_all,
};
