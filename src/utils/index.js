export const responseJSON = function(res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '-100',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};