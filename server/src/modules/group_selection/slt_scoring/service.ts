import BaseService from '../../../core/BaseService';
import CddEduService from '../../group_candidate/cdd_education/service';
import CddExpService from '../../group_candidate/cdd_experience/service';
import CddTestService from '../../group_candidate/cdd_tests/service';
import SltScoreRepository from './repository';
import {
  TSltScoreBase,
  TSchemaBase,
  TCddEduBase,
  TCddExpBase,
  TCddTestBase,
} from '../../../util/types';
import db_structure from '../../../util/config/db_structure';
import ValueError from '../../../util/errors/ValueError';

//  Declaration

const map_pref_degree: Record<string, number> = {
  doctorate: 5,
  masters: 3,
  bachelors: 2,
  diploma: 1,
  certificate: 1,
};

const map_pref_major: Record<string, number> = {
  artificial_intelligence: 1.15,
  machine_learning: 1.15,
  data_science: 1.15,
  statistics: 1.15,
  computer_science: 1.1,
  software_engineering: 1.1,
  information_systems: 1.1,
  cybersecurity: 1.1,
  cloud_computing: 1.1,
  electrical_engineering: 1.1,
  mathematics: 1.1,
  economics: 1.06,
  business_analytics: 1.06,
  business_administration: 1.02,
  accounting: 1.02,
  finance: 1.02,
};

const map_pref_institute: Record<string, number> = {
  university_of_oxford: 1.15,
  university_of_cambridge: 1.15,
  harvard_university: 1.15,
  yale_university: 1.15,
  princeton_university: 1.15,
  columbia_university: 1.15,
  london_school_of_economics: 1.15,
  university_of_pennsylvania: 1.1,
  university_college_london: 1.1,
  imperial_college_london: 1.1,
  university_of_edinburgh: 1.1,
  university_of_manchester: 1.1,
  university_of_warwick: 1.1,
  dartmouth_college: 1.1,
  brown_university: 1.1,
  cornell_university: 1.1,
  university_of_bristol: 1.06,
  university_of_glasgow: 1.06,
  university_of_durham: 1.06,
  university_of_york: 1.06,
  university_of_nottingham: 1.02,
  university_of_sheffield: 1.02,
  university_of_birmingham: 1.02,
  university_of_leeds: 1.02,
  university_of_exeter: 1.02,
  university_of_southampton: 1.02,
  queen_mary_university_of_london: 1.02,
};

//  Service class

class SltScoreService extends BaseService<
  TSltScoreBase & TSchemaBase,
  SltScoreRepository
> {
  private cdd_edu_service: CddEduService;
  private cdd_exp_service: CddExpService;
  private cdd_test_service: CddTestService;

  //  Constructor
  constructor(
    table: string,
    columns: Extract<keyof (TSltScoreBase & TSchemaBase), string>[],
    primary_key: string,
  ) {
    const repository = new SltScoreRepository(table, columns, primary_key);
    super(table, columns, primary_key, repository);
    this.cdd_edu_service = new CddEduService(
      db_structure.cdd_edu.table,
      db_structure.cdd_edu.columns as Extract<
        keyof (TCddEduBase & TSchemaBase),
        string
      >[],
      db_structure.cdd_edu.primary_key,
    );
    this.cdd_exp_service = new CddExpService(
      db_structure.cdd_exp.table,
      db_structure.cdd_exp.columns as Extract<
        keyof (TCddExpBase & TSchemaBase),
        string
      >[],
      db_structure.cdd_exp.primary_key,
    );
    this.cdd_test_service = new CddTestService(
      db_structure.cdd_test.table,
      db_structure.cdd_test.columns as Extract<
        keyof (TCddTestBase & TSchemaBase),
        string
      >[],
      db_structure.cdd_test.primary_key,
    );
  }

  //  Methods

  //  remarks: update the weighting strategy to be adopted
  public async update_weight_opt(weight_id: string) {
    const id = parseInt(weight_id, 10);
    if (isNaN(id)) {
      throw new Error('Invalid weight_id: must be a valid integer');
    }
    return await this.cache_service.handle_lock(this.table, 'all', async () => {
      await this.cache_service.del_cache(
        this.cache_service.create_key(this.table),
      );
      const result = await this.repository.update_weight_opt(id);
      return result;
    });
  }

  //  remarks: trigger by cdd_edu controllers, re-calculate scores based on designated rules
  public async update_score_edu_by_candidate(candidate_id: string) {
    return await this.cache_service.handle_lock(
      this.table,
      candidate_id,
      async () => {
        //  get candidate education info
        const edu_data: TCddEduBase[] =
          await this.cdd_edu_service.get_recent_by_candidate(candidate_id);
        //  restructure data format
        const list_degree = new Set<string>();
        const list_major: string[] = [];
        const list_institute: string[] = [];
        edu_data.forEach((record: TCddEduBase) => {
          if (!record.is_active || !record.is_verified) return;
          list_degree.add(record.cert_degree);
          list_major.push(record.cert_major);
          list_institute.push(record.cert_institute);
        });
        //  calculate scores
        let final_score: number = 0;

        //  1.  calculate degrees
        Object.keys(map_pref_degree).forEach((record: string) => {
          if (list_degree.has(record)) final_score += map_pref_degree[record];
        });
        //  2. calculate majors
        Object.keys(map_pref_major).forEach((map_el: string) => {
          const match = list_major.some(
            (list_el: string) =>
              list_el.replace(/ /g, '_').toLowerCase() === map_el,
          );
          if (match) final_score *= map_pref_major[map_el];
        });
        //  3. calculate institutes
        Object.keys(map_pref_institute).forEach((map_el: string) => {
          const match = list_institute.some(
            (list_el: string) =>
              list_el.replace(/ /g, '_').toLowerCase() === map_el,
          );
          if (match) final_score *= map_pref_institute[map_el];
        });

        //  update database
        if (final_score > 20) final_score = 20;
        if (final_score < 0) final_score = 0;
        const result = await this.repository.update_score_edu_by_candidate(
          final_score,
          candidate_id,
        );
        return result;
      },
    );
  }

  //  remarks: trigger by cdd_exp controllers, re-calculate scores based on designated rules
  public async update_score_exp_by_id(candidate_id: string) {
    return await this.cache_service.handle_lock(
      this.table,
      candidate_id,
      async () => {
        //  declarations
        const exp_data: TCddExpBase[] =
          await this.cdd_exp_service.get_recent_by_candidate(candidate_id);
        //  restructure data format
        const list_degree = new Set<string>();
        const list_major: string[] = [];
        const list_institute: string[] = [];
        exp_data.forEach((record: TCddExpBase) => {
          if (!record.is_active || !record.is_verified) return;
        });
        //  calculate scores
        //  update database
      },
    );
  }

  //  remarks: trigger by cdd_test controllers, re-calculate scores based on designated rules
  public async update_score_tests_by_id(candidate_id: string) {
    return await this.cache_service.handle_lock(
      this.table,
      candidate_id,
      async () => {
        //  declarations
      },
    );
  }

  //  remarks: if empty edu history, initialise to 0 for edu score.
  public async reset_score_edu_nullify() {
    return await this.cache_service.handle_lock(this.table, 'all', async () => {
      await this.cache_service.del_cache(
        this.cache_service.create_key(this.table),
      );
      const result = await this.repository.reset_score_edu_nullify();
      return result;
    });
  }

  //  remarks: if empty exp history, initialise to 0 for edu score.
  public async reset_score_exp_nullify() {
    return await this.cache_service.handle_lock(this.table, 'all', async () => {
      await this.cache_service.del_cache(
        this.cache_service.create_key(this.table),
      );
      const result = await this.repository.reset_score_exp_nullify();
      return result;
    });
  }

  //  remarks: if empty test history, initialise to 0 for edu score.
  public async reset_score_tests_nullify() {
    return await this.cache_service.handle_lock(this.table, 'all', async () => {
      await this.cache_service.del_cache(
        this.cache_service.create_key(this.table),
      );
      const result = await this.repository.reset_score_tests_nullify();
      return result;
    });
  }
}

//  Export
export default SltScoreService;
