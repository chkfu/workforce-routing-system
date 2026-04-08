BEGIN;

--  ENUMS

CREATE TYPE enum_user_role AS ENUM ('candidate', 'grade_1_assistant', 'grade_2_manager', 'grade_3_executive', 'sys_admin');
CREATE TYPE enum_staff_role AS ENUM ('grade_1_assistant', 'grade_2_manager', 'grade_3_executive');
CREATE TYPE enum_gender AS ENUM ('male', 'female', 'other');
CREATE TYPE enum_prob_status AS ENUM ('selecting', 'training', 'completed', 'postponed', 'withdrawn', 'failed');

--  1.  core tables

CREATE TABLE IF NOT EXISTS departments(
  _id  SERIAL  PRIMARY KEY,
  dept_name  VARCHAR(50) NOT NULL,
  dept_capacity  INTEGER DEFAULT 50,
  importance_weight  NUMERIC(4,3) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS staff(
  _id  SERIAL  PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name  VARCHAR(50) NOT NULL,
  gender  enum_gender NOT NULL,
  work_position VARCHAR(50)  NOT NULL,
  work_grade  enum_staff_role NOT NULL,
  work_email  VARCHAR(50) UNIQUE,
  work_ext  VARCHAR(20) UNIQUE,
  dept_id  INTEGER,
  date_hired  DATE,
  date_quit  DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active  BOOLEAN DEFAULT TRUE,

  CONSTRAINT fk_staff_dept
    FOREIGN KEY (dept_id)
    REFERENCES departments(_id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS candidates(
  _id  SERIAL  PRIMARY KEY,
  first_name  VARCHAR(50) NOT NULL,
  last_name  VARCHAR(50) NOT NULL,
  prob_status  enum_prob_status NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active  BOOLEAN DEFAULT TRUE
);

--  remarks: users table for system login, but staff and candidates refers to personal profiles
--  remarks: authentication related tables should be seperated, if needed to be in multi-cloud architecture
--           tradeoff: data lantency, systematic complexity, and cost of maintenance
CREATE TABLE IF NOT EXISTS users(
  _id          SERIAL PRIMARY KEY,
  username     VARCHAR(50) UNIQUE NOT NULL,
  _password    VARCHAR(255) NOT NULL,
  user_role    enum_user_role NOT NULL,
  staff_id     INTEGER UNIQUE REFERENCES staff(_id) ON DELETE SET NULL,
  candidate_id INTEGER UNIQUE REFERENCES candidates(_id) ON DELETE SET NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active    BOOLEAN DEFAULT TRUE,

  --  learnt: ensure staff, candidate, or admin has their corresponding id for tracking
  CONSTRAINT check_user_role CHECK (
    (user_role = 'candidate'  AND candidate_id IS NOT NULL AND staff_id IS NULL) OR
    (user_role = 'grade_1_assistant'  AND staff_id IS NOT NULL AND candidate_id IS NULL) OR
    (user_role = 'grade_2_manager'  AND staff_id IS NOT NULL AND candidate_id IS NULL) OR
    (user_role = 'grade_3_executive'  AND staff_id IS NOT NULL AND candidate_id IS NULL) OR
    (user_role = 'sys_admin'  AND staff_id IS NULL AND candidate_id IS NULL)
  )
);




COMMIT;
