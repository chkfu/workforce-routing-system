//  remarks: refer to official postgre error code list: https://www.postgresql.org/docs/current/errcodes-appendix.html
//           keep operational errors only
type PostgreErrList = Record<string, object | string>;

//  learnt: 400 for bad request, 404 for not found, 409 for data conflicts
export const postgre_err_list: PostgreErrList = {
  '01': { message: 'SQL - Warning', err_code: '400' },
  '02': { message: 'SQL - No Data', err_code: '404' },
  '03': { message: 'SQL - Statement Not Yet Complete', err_code: '400' },
  '20': { message: 'SQL - Case Not Found', err_code: '404' },
  '21': { message: 'SQL - Cardinality Violation', err_code: '400' },
  '22': { message: 'SQL - Data Exception', err_code: '400' },
  //  remarks: type "23" will be frequently triggered by operational behaviors
  '23000': { message: 'SQL - Integrity Constraint Violation', err_code: '400' },
  '23001': { message: 'SQL - Restrict Violation', err_code: '409' },
  '23502': { message: 'SQL - Not Null Violation', err_code: '400' },
  '23503': { message: 'SQL - Foreign Key Violation', err_code: '409' },
  '23505': { message: 'SQL - Unique Violation', err_code: '409' },
  '23514': { message: 'SQL - Check Violation', err_code: '400' },
  '23P01': { message: 'SQL - Exclusion Violation', err_code: '409' },
  '26': { message: 'SQL - Invalid SQL Statement Name', err_code: '400' },
  '27': { message: 'SQL - Triggered Data Change Violation', err_code: '400' },
  '42': {
    message: 'SQL - Syntax Error or Access Rule Violation',
    err_code: '400',
  },
  '44': { message: 'SQL - With Check Option Violation', err_code: '400' },
};
