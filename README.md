# node-express-mysql-demo  
Based on express and mysql a progress

接口目录
---------

- [获取数据列表](#获取数据列表)
- [新增数据](#新增数据)
- [更新数据](#更新数据)
- [删除数据](#删除数据)


获取数据列表
------------

#### HTTP Request

`GET /users`

#### Request Query String

| 参数名     | 类型       | 是否必填 | 说明 |
|:-----------|:-----------|:---------|:-----|
| id         | int,int... |          |      |
| name       | String     |          |      |
| favator    | String     |          |      |
| contacts   | String     |          |联系方式      |
| address    | String     |          | 家庭住址     |
| specal     | String     |          |  特长    |
| status     | String     |          |  用户状态    |
| metadata   | String     |          |   备注   |
| limit      | Int        |          | 请求数量，default 10 |
| offset     | Int        |          |  偏移量，default 0   |
| isAsc      | Boolen     |          | false-降序（默认），true-升序 |
| orderType  | String     |          | 0-按添加时间（默认）| 
<!-- | eagerLoading| Boolean   |          | false-仅返回用户列表, true-加载附加列表（默认）| -->

### Example

- [/users](http://localhost:3000/users)

#### Success Response

`HTTP 200 OK`

```javascritp
{ 
    "code": 100,
    "msg": "操作成功",
    "total": 2,

    "data": [
        {
            "id": 9,
            "favator": "789",
            "name": "小绿"
        },
        {
            "id": 10,
            "favator": "123",
            "name": "小红"
        }
    ]
}
```

新增数据
--------

#### HTTP Request

`POST /users`

#### Request Body

```javascript 
{
    "name": "小红", // Required
    "favator": "123",
    "phone": "12345678912", // Required 联系方式
    "address": "123", // Required 家庭住址
    "special": "", //特长
    "status": 0,
    "metadata": ""
}
```

#### Success Response

`HTTP 201 OK`

```javascript
{
    "code": 200,
    "msg": "添加成功"
}
```

更新数据
--------

#### HTTP Request

`PUT /users/:id`


#### Request Body

```javascript 
{ // /users/7

	"name": "小红", // 姓名
    "favator": "123",
    "phone": "12345678912", //联系方式
    "address": "123", //家庭住址
    "special": "", //特长
    "status": 0,
    "metadata": ""
}
```

#### Success Response

`HTTP 200 OK`

```javascript
{
    "code": 200,
    "msg": "更新成功"
}
```

删除数据
----------

#### HTTP Request

`DELETE /users`

#### Request Query String

| 参数名     | 类型       | 是否必填 | 说明   |
|:-----------|:-----------|:---------|:-------|
| id         | int,int... | YES      |        |

#### Success Response

`HTTP 200 OK`

```javascript
{
    "code": 200,
    "msg": "删除成功"
}
```


