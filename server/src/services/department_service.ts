import pool from '../database/pool';

//  Build service functions

const create_departments = async (dept_str_compound: string) => {
  const result = await pool.query(
    `INSERT INTO departments 
     (dept_name, dept_capacity, importance_weight)
     VALUES ${dept_str_compound}
     RETURNING *`,
  );
  return result.rows;
};

//  Export

export default {
  create_departments,
};
