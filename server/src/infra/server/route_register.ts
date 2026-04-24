import { Router } from 'express';
import dept_route from '../../modules/group_department/departments/route';
import staff_route from '../../modules/group_department/staff/route';
import candidate_route from '../../modules/group_candidate/candidates/route';
import sys_user_route from '../../modules/group_system/sys_users/route';
import cdd_edu_route from '../../modules/group_candidate/cdd_education/route';
import cdd_exp_route from '../../modules/group_candidate/cdd_experience/route';
import cdd_test_route from '../../modules/group_candidate/cdd_tests/route';
import cdd_pref_route from '../../modules/group_candidate/cdd_preference/route';
import slt_weight_route from '../../modules/group_selection/slt_weighting/route';
import slt_criteria_route from '../../modules/group_selection/slt_criteria/route';
import slt_score_route from '../../modules/group_selection/slt_scoring/route';
import pbt_intake_route from '../../modules/group_probation/pbt_intakes/route';
import pbt_score_route from '../../modules/group_probation/pbt_scoring/route';
import hire_weight_route from '../../modules/group_hiring/hire_weighting/route';
import hire_score_route from '../../modules/group_hiring/hire_scoring/route';
import hire_criteria_route from '../../modules/group_hiring/hire_criteria/route';
import final_intake_route from '../../modules/group_final/final_intakes/route';

export const route_register: Record<string, Router> = {
  departments: dept_route,
  staff: staff_route,
  candidates: candidate_route,
  sys_users: sys_user_route,
  candidate_education: cdd_edu_route,
  candidate_experience: cdd_exp_route,
  candidate_tests: cdd_test_route,
  candidate_preferences: cdd_pref_route,
  selection_weighting: slt_weight_route,
  selection_criteria: slt_criteria_route,
  selection_scoring: slt_score_route,
  probation_intakes: pbt_intake_route,
  probation_scoring: pbt_score_route,
  hire_criteria: hire_criteria_route,
  hire_weighting: hire_weight_route,
  hire_scoring: hire_score_route,
  final_intakes: final_intake_route,
};
