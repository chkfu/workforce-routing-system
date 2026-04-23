/*
  [DISCLAIMER]

  Types is the centralised storage of type managements for different section.
  These types specified those frequent used and complex structured types for
  better maintenance.
*/

import {
  enum_gender,
  enum_user_role,
  enum_prob_status,
  enum_hire_decision,
} from '../enums';

//  1.  Core tables

//  tags: all records
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

//  tags: candidates
export type TCandidateBase = {
  first_name: string;
  last_name: string;
  gender?: enum_gender;
  email?: string;
  prob_status?: enum_prob_status;
  is_active: boolean;
};

//  tags: sys_users
//  remarks: contains both staff and candidates, for accessing the system
export type TSysUserBase = {
  username: string;
  _password: string;
  staff_id?: number;
  candidate_id?: number;
  is_active: boolean;
};

//  2.  Candidates-supported table

//  tags: cdd_education
export type TCddEduBase = {
  candidate_id: number;
  cert_degree: string;
  cert_institute: string;
  cert_major: string;
  year_issued?: number;
  is_verified: boolean;
  is_active: boolean;
};

//  tags: cdd_experience
export type TCddExpBase = {
  candidate_id: number;
  exp_nature: string;
  exp_role: string;
  exp_institute: string;
  year_start: number;
  year_end?: number;
  is_verified: boolean;
  is_active: boolean;
};

//  tags: cdd_test
export type TCddTestBase = {
  candidate_id: number;
  score_aptitude: number;
  score_interview_1st: number;
  score_interview_2nd: number;
  is_active: boolean;
};

//  tags: cdd_preferences
export type TCddPrefBase = {
  candidate_id: number;
  pref_dept_1st: number;
  pref_dept_2nd: number;
  pref_dept_3rd: number;
  is_active: boolean;
};

//  3.  Select stage

//  tags: select_weighting
export type TSltWeightBase = {
  strategy_name: string;
  strategy_goal?: string;
  weight_qual: number;
  weight_exp: number;
  weight_tests: number;
  is_active: boolean;
};

//  tags: select_criteria
export type TSltCriteriaBase = {
  dept_id: number;
  min_score_qual: number;
  min_score_exp: number;
  min_score_tests: number;
  pref_criteria: Record<string, any>;
  blacklist: Record<string, any>;
  is_active: boolean;
};

//  tags: select_scoring
export type TSltScoreBase = {
  candidate_id: number;
  weight_id: number;
  base_score_qual: number;
  base_score_exp: number;
  base_score_tests: number;
  score_foundation: number;
  score_preference: number;
  is_active: boolean;
};

//  4.  Probation stage

//  tags: prob_intakes
export type TPbtIntakeBase = {
  candidate_id: number;
  department_id: number;
  select_weight_id: number;
  select_score_id: number;
  intake_round: number;
  training_start: Date;
  training_end: Date;
  is_active: boolean;
};

//  tags: prob_score
export type TPbtScoreBase = {
  candidate_id: number;
  department_id: number;
  count_awarding: number;
  count_warning: number;
  score_performance: number;
  score_attendance: number;
  score_adaptability: number;
  is_active: boolean;
};

//  5. Hire stage

//  tags: hire_weight
export type THireWeightBase = {
  method_name: string;
  method_goal: string;
  weight_performance: number;
  weight_attendance: number;
  weight_adaptability: number;
  is_active: boolean;
};

//  tags: hire_criteria
export type THireCriteriaBase = {
  dept_id: number;
  min_score_foundation: number;
  min_score_preference: number;
  pref_criteria: Record<string, any>;
  blacklist: Record<string, any>;
  is_active: boolean;
};

//  tags: hire_scoring
export type THireScoreBase = {
  candidate_id: number;
  hire_weight_id: number;
  score_performance: number;
  score_attendance: number;
  score_adaptability: number;
  is_active: boolean;
};

//  tags: hire_decisions
export type THireDecisionBase = {
  candidate_id: number;
  department_id: number;
  hire_weight_id: number;
  hire_criteria_id: number;
  hire_score_id: number;
  decision_date?: Date;
  final_decision: enum_hire_decision;
  is_active: boolean;
};

//  tags: final_intakes
export type TFinalIntakeBase = {
  candidate_id: number;
  department_id: number;
  hire_weight_id: number;
  hire_criteria_id: number;
  hire_score_id: number;
  intake_round: number;
  onboarding_start: Date;
  onboarding_end?: Date;
  final_decision?: enum_hire_decision;
  is_active: boolean;
};
