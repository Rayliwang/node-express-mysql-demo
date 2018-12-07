// import mysql from 'mysql';

// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'root123456',
//   database: 'weapp'
// });

// connection.connect();

// connection.query('', (err, rows, fileds) => {
//   if (err) {
//     throw err;
//   }
//   console.log('the reslut is: ', rows[0]);
// });

// connection.end();
export default {
  insert: 'INSERT INTO user SET ?',//插入单条数据
  update: 'UPDATE user SET ? WHERE id = ?',//更新单条数据
  delete: 'DELETE FROM user WHERE FIND_IN_SET (id, ?)',//删除多条数据id='1,2,3'
  queryAll: 'SELECT * FROM user',                      //查询所有的数据
  getUserById: 'SELECT * FROM user WHERE FIND_IN_SET (id, ?)',//根据id='1,2,3'查询多条数据
  getUser: 'SELECT * FROM user WHERE id = ? AND name = ?'//合并查询
}

