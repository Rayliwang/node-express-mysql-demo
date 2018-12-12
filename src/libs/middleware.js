import logger from 'morgan';

import validator from '../libs/validate';
// 请求参数校验
export function validate(schema) {
  return (req, res, next) => {
    const { path, method } = req;
    const { expires, source } = req.query;
    req.check(validator[schema]);

    const asyncErrs = req.getValidationResult();
    
    asyncErrs.then(result => {
      if (expires && new Date(expires + 'T23:59:59Z') <= new Date()) {
        return next(new Error('有效期须大于当前时间'));
      }
      if (!result.isEmpty()) {
        const arr = result.array();
        const err = {
          status: 400,
          msg: '请求传参错误: ' + JSON.stringify(arr.map((item, idx) => {
            return idx % 2 === 0 ? `params: ${item.location} ${arr[idx].msg}` : `params: ${item.location} ${item.msg}`;
          }).filter(i => i))
        };
        return next(err);
      }
      return next();
    });
  };
}
/* 404错误 */
export function notFound(req, res, next) {
  const error = {
    status: 404,
    msg: 'Not Found'
  };
  next(error);
}
/* 统一错误处理 */
export function errorHandler(err, req, res, next) {
  // err.msg.status.msg {data: {...}, status: {code: 3, msg: '错误信息'}}
  // err.msg.msg {data: {...}, code: 10010, msg: '错误消息'}
  // err.msg '错误消息'
  if (!(err instanceof Error)) {
    let msg = err.msg;
    if (err.status && err.status.msg) {
      msg = err.status.msg;
    }
    if (err.msg && err.msg.msg) {
      msg = err.msg.msg;
    }
    if (err.Message) {
      msg = err.Message;
    }
    if (err.message) {
      msg = err.message;
    }
    if (err.detail) {
      msg = err.detail;
    }
    logger(`${req.method} ${req.originalUrl} ${JSON.stringify(msg)}`);
    // 分别对应token鉴权失败、jwt鉴权失败、参数错误、404、业务层返回的错误
    if (err.status === 404) {
      return res.status(404).json({error: '没有此接口'});
    } else if (msg.indexOf('is required') !== -1) {
      res.status(400).json({
        error: `${msg.split(' ')[0]}缺失`
      });
    } else if (msg.indexOf('the type of') !== -1) {
      res.status(400).json({
        error: `${msg.split(' ')[3]}类型错误`
      });
    } else if (msg.indexOf('the format of') !== -1) {
      res.status(400).json({
        error: '密码必须为英文或者数字组合大于等于6位'
      });
    } else if (msg.indexOf('the value of') !== -1) {
      res.status(400).json({
        error: `${msg.split(' ')[3]}值错误`
      });
    } else if (msg.indexOf('failed') !== -1) {
      res.status(400).json({
        error: '系统正忙，请稍后再试...'
      });
    } else if (msg.indexOf('authorization') !== -1) {
      res.status(403).json({
        error: '没有权限'
      });
    } else if (/.*[\u4e00-\u9fa5]+.*$/.test(msg)) { // 中文直接返回
      res.status(400).json({
        error: msg
      });
    } else if (ERROR_MSG[msg]) {
      res.status(400).json({
        error: ERROR_MSG[msg]
      });
    } else if (msg.indexOf('not exist') !== -1) {
      res.status(400).json({
        error: `${msg.split(' ')[0]}不存在`
      });
    } else if (msg.indexOf('exist') !== -1) {
      res.status(400).json({
        error: `${msg.split(' ')[0]}已存在`
      });
    } else if (msg.indexOf('invalid') !== -1) {
      res.status(400).json({
        error: `无效的${msg.split(' ')[1]}`
      });
    } else {
      res.status(500).json({
        error: '系统正忙，请稍后再试...'
      });
    }
  } else {
    logger(`${req.method} ${req.originalUrl} ${err.name} ${err.message} ${processStackMsg(err)}`);
    if (err.name === 'FetchError') {
      res.status(500).json({
        error: '系统正忙，请稍后再试...'
      });
    } else if (err.name === 'SyntaxError') {
      const place = err.stack.replace(/\n/gi, '').split(/\bat\b/).slice(3, 4).join('@').replace(/\?[^:]+/gi, '').slice(-21, -11);
      const row = err.stack.replace(/\n/gi, '').split(/\bat\b/).slice(3, 4).join('@').replace(/\?[^:]+/gi, '').slice(-10, -7);
      if (place === 'utility.js' && /^(191|196|202)$/.test(Number(row))) {
        res.status(500).json({
          error: '数据已污染，解析JSON字符串出错'
        });
      } else if (place === 'utility.js' && /^(168|174|179)$/.test(Number(row))) {
        res.status(400).json({
          error: '请求body中metedata错误，请检查'
        });
      } else {
        res.status(400).json({
          error: '请求JSON格式错误，请检查！'
        });
      }
    } else if (err.name === 'StorageError') {
      res.status(400).json({
        error: '文件或图片不存在'
      });
    } else if (err.name === 'OAuth2Error' || err.name === 'ServerError' || err.name === 'InvalidArgumentError' || err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err.name === 'UnauthorizedError') {
      // 不传Authorization报"The access token was not found"
      // Authorization的value不写"Bearer "，报"Malformed auth header"
      // 如果Authorization过期或错误则报"The access token provided is invalid."
      // refresh_token错误报"Invalid refresh token"
      if (/.*[\u4e00-\u9fa5]+.*$/.test(err.message)) {
        res.set({
          'WWW-Authenticate': 'Basic realm=\"\"'  // eslint-disable-line
        }).status(401).json({
          error: err.message
        });
      } else if (err.message === 'Malformed auth header') {
        res.set({
          'WWW-Authenticate': 'Basic realm=\"\"'  // eslint-disable-line
        }).status(401).json({
          error: '无效token'
        });
      } else {
        res.set({
          'WWW-Authenticate': 'Basic realm=\"\"'  // eslint-disable-line
        }).status(401).json({
          error: ERROR_MSG[err.name] || ERROR_MSG[err.message] || '用户名或密码错误'
        });
      }
    } else if (err.name === 'Error') {
      res.status(400).json({
        error: err.message
      });
    } else {
      res.status(500).json({
        error: '系统正忙，请稍后再试...'
      });
    }
  }
}