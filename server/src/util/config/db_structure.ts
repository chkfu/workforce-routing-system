//  Shared configuration

const SHARED_PRIMARY_KEY: string = '_id';

//  Body

const db_structure = {
  //  1. Core tables

  departments: {
    table: 'departments',
    columns: ['dept_name', 'dept_capacity', 'importance_weight', 'is_active'],
    primary_key: SHARED_PRIMARY_KEY,
  },

  staff: {
    table: 'staff',
    columns: [
      'first_name',
      'last_name',
      'gender',
      'work_position',
      'work_grade',
      'work_email',
      'work_ext',
      'dept_id',
      'date_hired',
      'date_quit',
      'is_active',
    ],
    primary_key: SHARED_PRIMARY_KEY,
  },

  candidates: {
    table: 'candidates',
    columns: [
      'first_name',
      'last_name',
      'gender',
      'email',
      'prob_status',
      'is_active',
    ],
    primary_key: SHARED_PRIMARY_KEY,
  },

  sys_users: {
    table: 'sys_users',
    columns: [
      'username',
      '_password',
      'user_role',
      'staff_id',
      'candidate_id',
      'is_active',
    ],
    primary_key: SHARED_PRIMARY_KEY,
  },

  //  2. Candidate-supported tables

  cdd_edu: {
    table: 'candidate_education',
    columns: [
      'candidate_id',
      'cert_degree',
      'cert_institute',
      'cert_major',
      'year_issued',
      'is_verified',
      'is_active',
    ],
    primary_key: SHARED_PRIMARY_KEY,
  },

  cdd_exp: {
    table: 'candidate_experience',
    columns: [
      'candidate_id',
      'exp_nature',
      'exp_role',
      'exp_institute',
      'year_start',
      'year_end',
      'is_verified',
      'is_active',
    ],
    primary_key: SHARED_PRIMARY_KEY,
  },

  cdd_test: {
    table: 'candidate_tests',
    columns: [
      'candidate_id',
      'score_aptitude',
      'score_interview_1st',
      'score_interview_2nd',
      'score_overall',
      'is_active',
    ],
    primary_key: SHARED_PRIMARY_KEY,
  },

  cdd_pref: {
    table: 'candidate_preferences',
    columns: [
      'candidate_id',
      'pref_dept_1st',
      'pref_dept_2nd',
      'pref_dept_3rd',
      'is_active',
    ],
    primary_key: SHARED_PRIMARY_KEY,
  },

  //  3.  selection stage

  slt_weight: {
    table: 'select_weighting',
    columns: [
      'strategy_name',
      'strategy_goal',
      'weight_qual',
      'weight_exp',
      'weight_tests',
      'is_active',
    ],
    primary_key: SHARED_PRIMARY_KEY,
  },

  slt_criteria: {
    table: 'select_criteria',
    columns: [
      'dept_id',
      'min_score_qual',
      'min_score_exp',
      'min_score_tests',
      'pref_criteria',
      'blacklist',
      'is_active',
    ],
    primary_key: SHARED_PRIMARY_KEY,
  },

  slt_score: {
    table: 'select_scoring',
    columns: [
      'candidate_id',
      'select_weighting_id',
      'base_score_qual',
      'base_score_exp',
      'base_score_tests',
      'score_foundation',
      'score_preference',
      'is_active',
    ],
    primary_key: SHARED_PRIMARY_KEY,
  },

  //  4.  probation stage

  pbt_intakes: {
    table: 'probation_intakes',
    columns: [
      'candidate_id',
      'department_id',
      'select_weight_id',
      'select_score_id',
      'intake_round',
      'training_start',
      'training_end',
      'is_active',
    ],
    primary_key: SHARED_PRIMARY_KEY,
  },
};

//  Export

export default db_structure;
