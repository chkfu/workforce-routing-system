BEGIN;

--  ENUMS

--  remarks: postgres enums are not supported by 'create if not exists'
--           'DO $$ $$' for static catching; if not, script will crash
DO $$ BEGIN CREATE TYPE enum_staff_role AS ENUM ('pending', 'grade_1_assistant', 'grade_2_manager', 'grade_3_executive'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE enum_gender AS ENUM ('male', 'female', 'other'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE enum_prob_status AS ENUM ('selecting', 'training', 'completed', 'postponed', 'withdrawn', 'failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

--  1.  Core tables

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
  gender  enum_gender  NOT NULL,
  email  VARCHAR(50) UNIQUE,
  prob_status  enum_prob_status NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active  BOOLEAN DEFAULT TRUE
);

--  remarks: users table for system login, but staff and candidates refers to personal profiles
--  remarks: authentication related tables should be seperated, if needed to be in multi-cloud architecture
--           tradeoff: data lantency, systematic complexity, and cost of maintenance
CREATE TABLE IF NOT EXISTS sys_users(
  _id          SERIAL PRIMARY KEY,
  username     VARCHAR(50) UNIQUE NOT NULL,
  _password    VARCHAR(255) NOT NULL,
  user_role    enum_user_role,
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

-- CREATE TABLE IF NOT EXISTS sys_audit(
--   _id  SERIAL  PRIMARY KEY,
--   processor_id  INTEGER,
--   tb_name  VARCHAR(50),
--   action_type  VARCHAR(50),
--   messages  TEXT,
--   CONSTRAINT fk_candidate_tests
--       FOREIGN KEY (candidate_id)
--       REFERENCES candidates(_id)
--       ON DELETE CASCADE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );


--  2.  Candidates-supported table

CREATE TABLE IF NOT EXISTS candidate_education(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  cert_degree  VARCHAR(50),
  cert_institute  VARCHAR(50),
  cert_major  VARCHAR(50),
  year_issued  INTEGER,
  is_verified  BOOLEAN  DEFAULT FALSE,
  CONSTRAINT fk_candidate_qual
    FOREIGN KEY (candidate_id) 
    REFERENCES candidates(_id)
    ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS candidate_experience(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  exp_nature  VARCHAR(50),
  exp_role  VARCHAR(50),
  exp_institute  VARCHAR(50),
  year_start  INTEGER,
  year_end  INTEGER,
  is_verified  BOOLEAN  DEFAULT FALSE,
  CONSTRAINT fk_candidate_exp
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(_id)
    ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS candidate_tests(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  score_aptitude  NUMERIC(5,2),
  score_interview_1st  NUMERIC(5,2),
  score_interview_2nd  NUMERIC(5,2),
  score_overall  NUMERIC(5,2),
  CONSTRAINT fk_candidate_tests
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(_id)
    ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS candidate_preferences(
  _id SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  pref_dept_1st  INTEGER,
  pref_dept_2nd  INTEGER,
  pref_dept_3rd  INTEGER,
  CONSTRAINT fk_candidate_pref_1st
    FOREIGN KEY (pref_dept_1st)
    REFERENCES departments(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_candidate_pref_2nd
    FOREIGN KEY (pref_dept_2nd)
    REFERENCES departments(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_candidate_pref_3rd
    FOREIGN KEY (pref_dept_3rd)
    REFERENCES departments(_id)
    ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

--  3. Selection Stage

CREATE TABLE IF NOT EXISTS select_weighting(
  _id  SERIAL  PRIMARY KEY,
  strategy_name  VARCHAR(50),
  strategy_goal  TEXT,
  weight_qual  NUMERIC(4,3),
  weight_exp  NUMERIC(4,3),
  weight_tests  NUMERIC(4,3),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active  BOOLEAN DEFAULT TRUE
);

--  learnt: using JSONB for complex criteria for matching, with O(log n) query
CREATE TABLE IF NOT EXISTS select_criteria (
  _id  SERIAL PRIMARY KEY,
  dept_id  INTEGER UNIQUE,
  min_score_qual  NUMERIC(5,2) DEFAULT 0,
  min_score_exp  NUMERIC(5,2) DEFAULT 0,
  min_score_tests  NUMERIC(5,2) DEFAULT 0,
  pref_criteria  JSONB,
  blacklist  JSONB,
  CONSTRAINT fk_dept 
    FOREIGN KEY (dept_id) REFERENCES departments(_id)
    ON DELETE CASCADE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active  BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS select_scoring(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  select_weighting_id  INTEGER,
  base_score_qual  NUMERIC(5,2)  DEFAULT 20,
  base_score_exp  NUMERIC(5,2)  DEFAULT 20,
  base_score_tests  NUMERIC(5,2)  DEFAULT 20,
  score_foundation  NUMERIC(5,2)  DEFAULT 0,
  score_preference  NUMERIC(5,2)  DEFAULT 0,
  CONSTRAINT fk_weighting_scores_select
    FOREIGN KEY (select_weighting_id)
    REFERENCES select_weighting(_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_candidate_scores_select
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(_id)
    ON DELETE RESTRICT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active  BOOLEAN DEFAULT TRUE
);

--  4. probation stage

CREATE TABLE IF NOT EXISTS probation_intakes(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  department_id  INTEGER,
  select_weight_id  INTEGER,
  select_score_id  INTEGER,
  intake_round  INTEGER,
  training_start  DATE,
  training_end  DATE,
  CONSTRAINT fk_candidate_training
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_department_training
    FOREIGN KEY (department_id)
    REFERENCES departments(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_weighting_training
    FOREIGN KEY (select_weight_id)
    REFERENCES select_weighting(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_score_training
    FOREIGN KEY (select_score_id)
    REFERENCES select_scoring(_id)
    ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);


COMMIT;
