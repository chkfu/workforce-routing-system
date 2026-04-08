import pool from '../database/pool';

//  Build service functions

//  1.  GET methods

//  remarks: empty table refers to empty list, not necessary to crash the query
const get_staff_batch = async () => {
  const result = await pool.query(`SELECT * FROM staff ORDER BY _id ASC;`);
  return result.rows ?? [];
};

const get_staff_by_id = async (id: string) => {
  const result = await pool.query(`SELECT * FROM staff WHERE _id = $1;`, [id]);
  return result.rows[0];
};

//  2.  POST methods

const create_staff_batch = async (
  first_name: string,
  last_name: string,
  gender: string,
  work_position: string,
  work_grade: string,
  work_email: string | null,
  work_ext: string | null,
  dept_id: number | null,
  date_hired: Date | null,
  date_quit: Date | null,
  is_active: boolean,
) => {
  const result = await pool.query(
    `
          INSERT INTO staff (first_name, last_name, gender, work_position, work_grade, work_email, work_ext, dept_id, date_hired, date_quit, is_active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *;
        `,
    [
      first_name,
      last_name,
      gender,
      work_position,
      work_grade,
      work_email,
      work_ext,
      dept_id,
      date_hired,
      date_quit,
      is_active,
    ],
  );
  return result.rows[0];
};

//  3. PATCH methods

const update_staff_detail_batch = async (
  first_name: string | null,
  last_name: string | null,
  gender: string | null,
  work_position: string | null,
  work_grade: string | null,
  work_email: string | null,
  work_ext: string | null,
  dept_id: number | null,
  date_hired: Date | null,
  date_quit: Date | null,
  is_active: boolean,
  id_arr: string[],
) => {
  const result = await pool.query(
    `
      UPDATE staff
      SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        gender = COALESCE($3, gender),
        work_position = COALESCE($4, work_position),
        work_grade = COALESCE($5, work_grade),
        work_email = COALESCE($6, work_email),
        work_ext = COALESCE($7, work_ext),
        dept_id = COALESCE($8, dept_id),
        date_hired = COALESCE($9, date_hired),
        date_quit = COALESCE($10, date_quit),
        is_active = COALESCE($11, is_active)
      WHERE _id = ANY($12)
      RETURNING *;
    `,
    [
      first_name ?? null,
      last_name ?? null,
      gender ?? null,
      work_position ?? null,
      work_grade ?? null,
      work_email ?? null,
      work_ext ?? null,
      dept_id ?? null,
      date_hired ?? null,
      date_quit ?? null,
      is_active ?? null,
      id_arr,
    ],
  );
  return result.rows;
};

const update_staff_active_batch = async (id_arr: string[], status: boolean) => {
  const result = await pool.query(
    `UPDATE staff
     SET is_active = $1, updated_at = CURRENT_TIMESTAMP
     WHERE _id = ANY($2)
     RETURNING *;`,
    [status, id_arr],
  );
  return result.rows;
};

//  4. DELETE methods

const remove_staff_batch = async (id_arr: string[]) => {
  const result = await pool.query(
    `DELETE FROM staff WHERE _id = ANY($1) RETURNING *;`,
    [id_arr],
  );
  return result.rows;
};

const empty_staff_all = async () => {
  const result = await pool.query(`DELETE FROM staff RETURNING *;`);
  return result.rows;
};

//  Export

export default {
  get_staff_batch,
  get_staff_by_id,
  create_staff_batch,
  update_staff_detail_batch,
  update_staff_active_batch,
  remove_staff_batch,
  empty_staff_all,
};
