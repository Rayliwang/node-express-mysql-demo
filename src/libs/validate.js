import { EVENT, CACHE, REGEXP } from './constant';

function rule(name, where = 'params', arrayOrReg = REGEXP.primaryKey, notEmpty = true) {
  let Reg = arrayOrReg;
  if (!(arrayOrReg instanceof RegExp)) {
    const value = `^(${arrayOrReg.join('|')})$`;
    Reg = new RegExp(value, 'i');
  } else {
    Reg = RegExp(Reg);
  }
  if (notEmpty) {
    return {
      in: where,
      notEmpty: true,
      matches: {
        options: [Reg]
      },
      errorMessage: `无效的${name}`
    };
  } else {
    return {
      in: where,
      optional: true,
      matches: {
        options: [Reg],
        errorMessage: `无效的${name}`
      }
    };
  }
}

const page = {
  offset: rule('offset', 'query', REGEXP.int, false),
  limit: rule('limit', 'query', REGEXP.limit, false)
}
export default {
  getUsers: {
    id: rule('id', 'query', REGEXP.primaryKeys, false),
    name: rule('name', 'query', REGEXP.varchar128, false),
    favator: rule('favator', 'query', REGEXP.varchar128, false),
    ...page
  },
  addUser: {
    name: rule('name', 'body', REGEXP.varchar128),
    favator: rule('favator', 'body', REGEXP.varchar128, false),
    phone: rule('phone', 'body', REGEXP.mobile),
    address: rule('address', 'body', REGEXP.varchar128),
    special: rule('special', 'body', REGEXP.varchar128, false),
    status: rule('status', 'body', REGEXP.int, false),
  },
  updateUser: {
    id: rule('id'),
    name: rule('name', 'body', REGEXP.varchar128, false),
    favator: rule('favator', 'body', REGEXP.varchar128, false),
    phone: rule('phone', 'body', REGEXP.mobile, false),
    address: rule('address', 'body', REGEXP.varchar128, false),
    special: rule('special', 'body', REGEXP.varchar128, false),
    status: rule('status', 'body', REGEXP.int, false),
  },
  deleteUsers: {
    id: rule('id', 'query', REGEXP.primaryKeys),
  }
}