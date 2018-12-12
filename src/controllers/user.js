import mysql from 'mysql';
import dbconfig from '../models/dbconfig';
import userSQL from '../models/user';
import { responseJSON } from '../utils/index';

const pool = mysql.createPool(dbconfig.mysql);


export default {
  getUsers (req, res, next) {
    pool.getConnection(function(err, connection) {
      const { id, name, favator, limit = 10, offset = 0, isAsc = false, orderType = 'id' } = req.query;
      let sql = userSQL.queryAll;
      let param = [];
      if (id) {
        sql += ' WHERE FIND_IN_SET (id, ?)';
        param.push(id);
      } else {
        sql += ' WHERE 1=1'
      }
      if (name) {
        sql += ' AND name LIKE ?';
        param.push(`%${name}%`);
      }
      if (favator) {
        sql += ' AND favator LIKE ?';
        param.push(`%${favator}%`);
      }
      sql += ` ORDER BY ${orderType} ${isAsc ? 'ASC' : 'DESC'} LIMIT ${limit} OFFSET ${offset * limit}`
      connection.query(sql, param, function(err, result) {
        const data = result;
        if (result) {
          result = {
            code: 100,
            msg: '操作成功'
          };
          result.data = data || null;
        }
        responseJSON(res, result);
        connection.release();
      });
    });
  },
  addUser(req, res, next) {
    pool.getConnection(function(err, connection) {
      connection.query(userSQL.insert, req.body, function(err, result, fields) {
        if (result) {
          result = {
            code: 200,
            msg: '添加成功'
          };
        }
        responseJSON(res, result);
        connection.release();
      });
    })
  },
  updateUser(req, res, next) {
    pool.getConnection(function(err, connection) {
      connection.query(userSQL.update, [req.body, req.params.id],  function(err, result, fields) {
        if (result) {
          result = {
            code: 200,
            msg: '更新成功'
          };
        }
        responseJSON(res, result);
        connection.release();
      });
    });
  },
  deleteUsers(req, res, next) {
    pool.getConnection(function(err, connection) {
      connection.query(userSQL.delete, req.query.id,  function(err, result, fields) {
        if (result) {
          result = {
            code: 200,
            msg: '删除成功'
          };
        }
        responseJSON(res, result);
        connection.release();
      });
    });
  }
}