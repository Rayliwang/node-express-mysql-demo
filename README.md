# node_express_mysql_demo
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
| name       | Integer    |          |      |
| favator    | Integer    |          |      |

### Example

- [/users](http://localhost:3000/users)

#### Success Response

`HTTP 200 OK`

```javascritp
{ 
    "code": 100,
    "msg": "操作成功",
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
	"favator": "123",
	"name": "小红"
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

	"favator": "12345",
	"name": "小红"
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
| id         | int,int... | YES      | 映射Id |

#### Success Response

`HTTP 200 OK`

```javascript
{
    "code": 200,
    "msg": "删除成功"
}
```


