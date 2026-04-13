--  SECTION A: INITIALISATION

CREATE TABLE IF NOT EXISTS departments(
  _id  SERIAL  PRIMARY KEY,
  dept_name  VARCHAR(50),
  dept_capacity  INTEGER, 
  importance_weight  NUMERIC(4,3),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS staff (
  _id  SERIAL  PRIMARY KEY,
  first_name  VARCHAR(50),
  last_name  VARCHAR(50),
  _email  VARCHAR(200),
  _password  VARCHAR(200),
  work_position  VARCHAR(50),
  work_grade  INTEGER,
  work_dept  INTEGER,
  date_hired  DATE,
  CONSTRAINT fk_candidate_dept
    FOREIGN KEY (work_dept) 
    REFERENCES departments(_id)
    ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS candidates(
  _id  SERIAL  PRIMARY KEY,
  first_name  VARCHAR(50),
  last_name  VARCHAR(50),
  _email  VARCHAR(200),
  _password  VARCHAR(200),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active  BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS sys_audit(
  _id  SERIAL  PRIMARY KEY,
  processor_id  INTEGER,
  tb_name  VARCHAR(50),
  action_type  VARCHAR(50),
  updates  TEXT,
  CONSTRAINT fk_processor_history
    FOREIGN KEY (processor_id)
    REFERENCES staff(_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--  SUPPORT CLASS CANDIDATE
CREATE TABLE IF NOT EXISTS candidates_qualification(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  cert_degree  VARCHAR(50),
  cert_institute  VARCHAR(50),
  cert_major  VARCHAR(50),
  year_issued  INTEGER,
  CONSTRAINT fk_candidate_qual
    FOREIGN KEY (candidate_id) 
    REFERENCES candidates(_id)
    ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

--  SUPPORT CLASS CANDIDATE
CREATE TABLE IF NOT EXISTS candidates_experience(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  exp_nature  VARCHAR(50),
  exp_role  VARCHAR(50),
  exp_institute  VARCHAR(50),
  year_start  INTEGER,
  year_end  INTEGER,
  CONSTRAINT fk_candidate_exp
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(_id)
    ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

--  SUPPORT CLASS CANDIDATE
CREATE TABLE IF NOT EXISTS candidates_tests(
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

--  SUPPORT CLASS CANDIDATE
CREATE TABLE IF NOT EXISTS candidates_preferences(
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


--  SECTION B:  SELECTING FOR PROBATION TRAINING

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
CREATE TABLE select_criteria (
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

CREATE TABLE IF NOT EXISTS calculate_select_scores(
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

CREATE TABLE IF NOT EXISTS select_decision(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  department_id  INTEGER,
  intake_select_weighting  INTEGER,
  intake_select_score_id  INTEGER,
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
    FOREIGN KEY (intake_select_weighting)
    REFERENCES select_weighting(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_score_training
    FOREIGN KEY (intake_select_score_id)
    REFERENCES calculate_select_scores(_id)
    ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

--  SECTION C:  SELECTING FOR OFFICIAL HIRING

CREATE TABLE IF NOT EXISTS probation_scores(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  department_id  INTEGER,
  count_awarding  INTEGER,
  count_warning  INTEGER,
  score_performance  NUMERIC(5,2) DEFAULT 0,
  score_attendance  NUMERIC(5,2) DEFAULT 0,
  score_adaptability  NUMERIC(5,2) DEFAULT 0,
  CONSTRAINT fk_candidate_probation
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_department_probation
    FOREIGN KEY (department_id)
    REFERENCES departments(_id)
    ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS hiring_weighting(
  _id  SERIAL  PRIMARY KEY,
  method_name  VARCHAR(50),
  method_goal  TEXT,
  weighting_performance  NUMERIC(4,3),
  weighting_attendance  NUMERIC(4,3),
  weighting_adaptability  NUMERIC(4,3),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS hiring_criteria(
  _id  SERIAL  PRIMARY KEY,
  dept_id INTEGER UNIQUE,
  min_score_foundation NUMERIC(5,2) DEFAULT 0,
  min_score_preference NUMERIC(5,2) DEFAULT 0,
  pref_criteria JSONB,
  blacklist JSONB,
  CONSTRAINT fk_dept_hiring
    FOREIGN KEY (dept_id)
    REFERENCES departments(_id)
    ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS calculate_hiring_scores(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  hiring_weighting_id  INTEGER,
  score_performance  NUMERIC(5,2) DEFAULT 0,
  score_attendance  NUMERIC(5,2) DEFAULT 0,
  score_adaptability  NUMERIC(5,2) DEFAULT 0,
  score_overall  NUMERIC(5,2) DEFAULT 0,
  CONSTRAINT fk_weighting_scores_hiring
    FOREIGN KEY (hiring_weighting_id)
    REFERENCES hiring_weighting(_id)
    ON DELETE RESTRICT,
  CONSTRAINT fk_candidate_scores_hiring
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(_id)
    ON DELETE RESTRICT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS hiring_decisions(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  department_id  INTEGER,
  hiring_weighting INTEGER,
  hiring_criteria INTEGER,
  hiring_score_id INTEGER,
  decision_date DATE DEFAULT CURRENT_DATE,
  final_decision VARCHAR(20),
  CONSTRAINT fk_candidate_decision
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_department_decision
    FOREIGN KEY (department_id)
    REFERENCES departments(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_weighting_decision
    FOREIGN KEY (hiring_weighting)
    REFERENCES hiring_weighting(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_criteria_decision
    FOREIGN KEY (hiring_criteria)
    REFERENCES hiring_criteria(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_score_decision
    FOREIGN KEY (hiring_score)
    REFERENCES calculate_hiring_scores(_id)
    ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS appraisal_records(
  _id  SERIAL  PRIMARY KEY,
  candidate_id  INTEGER,
  department_id  INTEGER,
  training_intake_id INTEGER,
  hiring_intake_id INTEGER,
  appraisal_date  DATE  DEFAULT CURRENT_DATE,
  count_absent  INTEGER,
  count_late  INTEGER,
  count_early_leave  INTEGER,
  count_awarding  INTEGER,
  count_warning  INTEGER,
  score_performance  NUMERIC(5,2),
  score_overall  NUMERIC(5,2),
  CONSTRAINT fk_candidate_appraisal
    FOREIGN KEY (candidate_id)
    REFERENCES candidates(_id)
    ON DELETE SET NULL,
  CONSTRAINT fk_department_appraisal
    FOREIGN KEY (department_id)
    REFERENCES departments(_id)
    ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
)



