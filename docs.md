# Documents
Usage for ipfs-lib
See the test/test_ipfs.js for more details.

# JSON API

* [JSON-RPC methods](#json-rpc-methods)   
	* [jt_issueToken](#jt_issueToken)   
	* [jt_createToken](#jt_createToken)
	* [jt_removeToken](#jt_removeToken)
	* [jt_transferToken](#jt_transferToken)
	* [jt_ownerOf](#jt_ownerOf)
	* [jt_tokensOf](#jt_tokensOf)
	* [jt_getTokenByHash](#jt_getTokenByHash)
	* [jt_getTokenByIndex](#jt_getTokenByIndex)
	* [jt_getTokenCount](#jt_getTokenCount)
	* [jt_getTokenInfoByHash](#jt_getTokenInfoByHash)
	* [jt_createData](#jt_createData)
	* [jt_removeData](#jt_removeData)
	* [jt_uploadData](#jt_uploadData)
	* [jt_downloadData](#jt_downloadData)
	* [jt_uploadFile](#jt_uploadFile)
	* [jt_downloadFile](#jt_downloadFile)

***

#### <a name="jt_issueToken"></a>jt_issueToken 发行类erc721的Token

发行类似erc721的token

##### Parameters 参数

- `from`:`ADDRESS`: 发行token的帐户地址
- `to`:`ADDRESS`:创建token的帐户地址
- `token_info`:`OBJECT`: token的定义信息
	- `name`:`STRING`: 类erc721的token的名称   
	- `symbol`:`STRING`: 类erc721的token的简称
	- `total_supply`:`INT` | `unlimited`: 该token的总供应量  
	- `items`:`LIST`：定义该token的属性
  		- `name`:`STRING`: 该属性的名称  
	  	- `type`:`STRING`: 该属性的类型，现支持八种类型，boolean, integer, string, number, binary, file, list, map, 示例如下见<a href="#token_item_type_example">Token属性数据类型示例</a>
  		- `desc`:`STRING`: 该属性描述, 可以为空

1. `DATA`, 所发行Token的哈希字符串

```js
"params":[
	{
		"from":"jw27f8oUXpJtM4YeATNE9ozSrzFRRxG6R5",
		"to":"jQfvETFtVeQGXQZbMTxUm5VHgSA145ucPR", 
		"token_info":{
			"name":"TEST", 
			"symbol":"test", 
			"total_supply":100,
			"items":[
				{
					"name":"code",
					"type":"string",
					"desc":"the code of the token"
				},
				{
					"name":"quality",
					"type":"string",
					"desc":"the quality of the token"
				},
				{
					"name":"weight",
					"type":"number",
					"desc":"the weight of the token"
				}
			]
		}
	}
]
```

##### Returns 返回值

- `transaction`:`HASH` - 返回区块链上的交易哈希，当交易不存在时返回0哈希
- `hash`:`HASH` - 返回该token定义的hash, 后续jt_createToken的时候要用到
- `gas`: `OBJECT` - 对于需要消耗gas的调用，返回消耗的gas数量及对应的交易哈希

##### Example 例子
```js
// Request 请求
curl -X POST --data '{
	"jsonrpc":"2.0",
	"method":"jt_issueToken",
	"params":[
		{
			"from":"jw27f8oUXpJtM4YeATNE9ozSrzFRRxG6R5",
			"to":"jQfvETFtVeQGXQZbMTxUm5VHgSA145ucPR", 
			"token_info":{
				"name":"TEST", 
				"symbol":"test", 
				"total_supply":100,
				"items":[
					{
						"name":"code",
						"type":"string",
						"desc":"the code of the token"
					},
					{
						"name":"quality",
						"type":"string",
						"desc":"the quality of the token"
					},
					{
						"name":"weight",
						"type":"string",
						"desc":"the weight of the token"
					}
				]
			}
		}
	],
	"id":1
}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": [
        {
            "transaction": "1684C9321EA993D0C6AA558C5E0DD855F66A67C944AD1C4A7BD2CB3A59B24C69",
            "hash": "1414C09094153EAE9C1D3FB255EEDC7090167DD461F413BCA1DD5C9706283A5A"
        }
    ],
    "status": "success"
}

// 如果是需要消耗gas的话，返回结果如下
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": [
        {
            "transaction": "1684C9321EA993D0C6AA558C5E0DD855F66A67C944AD1C4A7BD2CB3A59B24C69",
            "hash": "1414C09094153EAE9C1D3FB255EEDC7090167DD461F413BCA1DD5C9706283A5A",
            "gas": {
                "gas": 1000000000,
                "transaction": "815333EAD19B4E7D839BC8B73F72E7EF148F461A1CB09BEADFCDFFAA3A18C494"
            }
        }
    ],
    "status": "success"
}
```

***

#### jt_createToken 根据发行的Token种类，创建具体每一个唯一的Token

创建类似erc721的token

##### Parameters 参数

- `from`:`ADDRESS`: 创建token的帐户地址[建议为jt_issueToken的to]
- `to`:`ADDRESS`:接收token的帐户地址
- `token`:`OBJECT`: token的定义信息
	- `info`:`HASH`: 类erc721的定义token的hash, 见jt_issueToken返回值
	- `uri`:`STRING`: 类erc721的token的uri, erc721标准属性
	- `items`:`LIST`：该token的属性
  		- `name`:`STRING`: 该属性的名称  
	  	- `value`:`STRING`: 该属性的值，要符合jt_issueToken中的定义

```js
params: [
  {
		"from":"jw27f8oUXpJtM4YeATNE9ozSrzFRRxG6R5",
		"to":"jQfvETFtVeQGXQZbMTxUm5VHgSA145ucPR",
		"token":{
			"info":"1414C09094153EAE9C1D3FB255EEDC7090167DD461F413BCA1DD5C9706283A5A", 
			"uri":"http://www.jingtum.com", 
			"items":[
				{
					"name":"code",
					"value":"002"
				},
				{
					"name":"quality",
					"value":"99.99999%"
				},
				{
					"name":"weight",
					"value":"10"
				}
			]
		}
	}
]
```

##### Returns 返回值

- `transaction`:`HASH` - 返回在区块链上的交易哈希，当交易不存在时返回0哈希
- `hash`:`HASH` - 返回该token的唯一的哈希
- `gas`: `OBJECT` - 对于需要消耗gas的调用，返回消耗的gas数量及对应的交易哈希

##### Example 例子
```js
// Request 请求
curl -X POST --data '{
	"jsonrpc":"2.0",
	"method":"jt_createToken",
	"params":[
		{
			"from":"jw27f8oUXpJtM4YeATNE9ozSrzFRRxG6R5",
			"to":"jQfvETFtVeQGXQZbMTxUm5VHgSA145ucPR",
			"token":{
				"info":"1414C09094153EAE9C1D3FB255EEDC7090167DD461F413BCA1DD5C9706283A5A", 
				"uri":"http://www.jingtum.com", 
				"items":[
					{
						"name":"code",
						"value":"002"
					},
					{
						"name":"quality",
						"value":"99.99999%"
					},
					{
						"name":"weight",
						"value":"10"
					}
				]
			}
		}
	],
	"id":1
}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": [
        {
            "transaction": "2424716B3F000B2DC6698D8FC17DDC569E78500B27DF839C88576735DE1CCC3F",
            "hash": "8C6B700771D452DD89158FF498E2114763055B1F7C0FBCE01D10BB24FF86FC68"
        }
    ],
    "status": "success"
}

// 如果是需要消耗gas的话，返回结果如下
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": [
        {
            "transaction": "2424716B3F000B2DC6698D8FC17DDC569E78500B27DF839C88576735DE1CCC3F",
            "hash": "8C6B700771D452DD89158FF498E2114763055B1F7C0FBCE01D10BB24FF86FC68",
            "gas": {
                "gas": 1000000000,
                "transaction": "815333EAD19B4E7D839BC8B73F72E7EF148F461A1CB09BEADFCDFFAA3A18C494"
            }
        }
    ],
    "status": "success"
}
```

***

#### <a name="jt_removeToken"></a>jt_removeToken 删除token

删除（销毁）类似erc721的token

##### Parameters 参数

- `from`:`ADDRESS`: 发行token的帐户地址
- `to`:`ADDRESS`:创建token的帐户地址
- `token`:`HASH`: 该token的唯一的哈希

```js
params: [
  {
		"from":"jQfvETFtVeQGXQZbMTxUm5VHgSA145ucPR", 
		"to":"jw27f8oUXpJtM4YeATNE9ozSrzFRRxG6R5",
		"token":"8C6B700771D452DD89158FF498E2114763055B1F7C0FBCE01D10BB24FF86FC68"
	}
]
```

##### Returns 返回值

同 `jt_createToken` 返回值定义

##### Example 例子
```js
// Request 请求
curl -X POST --data '{
	"jsonrpc":"2.0",
	"method":"jt_transferToken",
	"params":[
		{
			"from":"jQfvETFtVeQGXQZbMTxUm5VHgSA145ucPR", 
			"to":"jw27f8oUXpJtM4YeATNE9ozSrzFRRxG6R5",
			"token":"8C6B700771D452DD89158FF498E2114763055B1F7C0FBCE01D10BB24FF86FC68"
		}
	],
	"id":1
}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": [
        {
            "transaction": "F1EA1514085AECDA49F592E9A85C21A624A9B6C902D4A8189793370BA65A53E5",
            "hash": "8C6B700771D452DD89158FF498E2114763055B1F7C0FBCE01D10BB24FF86FC68"
        }
    ],
    "status": "success"
}

// 如果是需要消耗gas的话，返回结果如下
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": [
        {
            "transaction": "F1EA1514085AECDA49F592E9A85C21A624A9B6C902D4A8189793370BA65A53E5",
            "hash": "8C6B700771D452DD89158FF498E2114763055B1F7C0FBCE01D10BB24FF86FC68",
            "gas": {
                "gas": 1000000000,
                "transaction": "815333EAD19B4E7D839BC8B73F72E7EF148F461A1CB09BEADFCDFFAA3A18C494"
            }
        }
    ],
    "status": "success"
}
```

***

#### <a name="jt_transferToken"></a>jt_transferToken 转移token

转移类似erc721的token

##### Parameters 参数

- `from`:`ADDRESS`: 发行token的帐户地址
- `to`:`ADDRESS`:创建token的帐户地址
- `token`:`HASH`: 该token的唯一的哈希

```js
params: [
  {
		"from":"jQfvETFtVeQGXQZbMTxUm5VHgSA145ucPR", 
		"to":"jw27f8oUXpJtM4YeATNE9ozSrzFRRxG6R5",
		"token":"8C6B700771D452DD89158FF498E2114763055B1F7C0FBCE01D10BB24FF86FC68"
	}
]
```

##### Returns 返回值

同 `jt_createToken` 返回值定义

##### Example 例子
```js
// Request 请求
curl -X POST --data '{
	"jsonrpc":"2.0",
	"method":"jt_transferToken",
	"params":[
		{
			"from":"jQfvETFtVeQGXQZbMTxUm5VHgSA145ucPR", 
			"to":"jw27f8oUXpJtM4YeATNE9ozSrzFRRxG6R5",
			"token":"8C6B700771D452DD89158FF498E2114763055B1F7C0FBCE01D10BB24FF86FC68"
		}
	],
	"id":1
}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": [
        {
            "transaction": "F1EA1514085AECDA49F592E9A85C21A624A9B6C902D4A8189793370BA65A53E5",
            "hash": "8C6B700771D452DD89158FF498E2114763055B1F7C0FBCE01D10BB24FF86FC68"
        }
    ],
    "status": "success"
}

// 如果是需要消耗gas的话，返回结果如下
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": [
        {
            "transaction": "F1EA1514085AECDA49F592E9A85C21A624A9B6C902D4A8189793370BA65A53E5",
            "hash": "8C6B700771D452DD89158FF498E2114763055B1F7C0FBCE01D10BB24FF86FC68",
            "gas": {
                "gas": 1000000000,
                "transaction": "815333EAD19B4E7D839BC8B73F72E7EF148F461A1CB09BEADFCDFFAA3A18C494"
            }
        }
    ],
    "status": "success"
}
```

***

#### <a name="jt_ownerOf"></a>jt_ownerOf 查询token的拥有者

查询token的拥有者

##### Parameters 参数

1. `HASH`, 代表token的唯一哈希，同jt_createToken或者jt_transferToken返回的`hash`值

```js
params: ["C0CA0215D1530B2A138FB069DB4B9593F2A6D8F98087EA12959A51DF05ADD03D"]
```

##### Returns 返回值

`ADDRESS` - 该token的拥有者的地址

##### Example 例子
```js
// Request 请求
curl -X POST --data '{
	"jsonrpc":"2.0",
	"method":"jt_ownerOf",
	"params":["C0CA0215D1530B2A138FB069DB4B9593F2A6D8F98087EA12959A51DF05ADD03D"],
	"id":1
}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": "jQfvETFtVeQGXQZbMTxUm5VHgSA145ucPR",
    "status": "success"
}
```

***

#### <a name="jt_tokensOf"></a>jt_tokensOf 查询某个地址拥有哪些token

查询某个地址拥有哪些token

##### Parameters 参数

1. `ADDRESS`, 要查询的帐户的地址

```js
params: ["jQfvETFtVeQGXQZbMTxUm5VHgSA145ucPR"]
```

##### Returns 返回值

`LIST` - 返回token的概要信息列表
- `date`: `STRING` token的创建的日期
- `info`: `HASH` token的定义的哈希
- `invoice`:  `HASH` token的指纹信息
- `symbol`: `STRING` token所属的token类型的简称
- `token`: `HASH` token的唯一的哈希, 可在jt_getToken中用来查询token详细信息
- `tx`: `HASH` token生成所有的区块链的交易的哈希

##### Example 例子
```js
// Request 请求
curl -X POST --data '{
	"jsonrpc":"2.0",
	"method":"jt_tokensOf",
	"params":["jQfvETFtVeQGXQZbMTxUm5VHgSA145ucPR"],
	"id":1
}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": [
        {
            "date": "2018-09-30T22:54:20+08:00",
            "info": "1414C09094153EAE9C1D3FB255EEDC7090167DD461F413BCA1DD5C9706283A5A",
            "invoice": "F8F0B74598FD1E512C846697680EEA12A33EDAB618296B87D5C87CBDEBACBED9",
            "symbol": "test",
            "token": "C0CA0215D1530B2A138FB069DB4B9593F2A6D8F98087EA12959A51DF05ADD03D",
            "tx": "032276039CD21A826D9728537B44CDBFC05719C7BB909136A670366625190C77"
        }
    ],
    "status": "success"
}
```

***

#### <a name="jt_getTokenByHash"></a>jt_getTokenByHash 通过Token的哈希查询token的具体信息

查询token的具体信息

##### Parameters 参数

1. `HASH`, token的唯一哈希，见jt_createToken, jt_transferToken或者jt_tokensOf中返回的hash值

```js
params: ["C0CA0215D1530B2A138FB069DB4B9593F2A6D8F98087EA12959A51DF05ADD03D"]
```

##### Returns 返回值

`OBJECT` - token的详细信息

##### Example 例子
```js
// Request 请求
curl -X POST --data '{
	"jsonrpc":"2.0",
	"method":"jt_getTokenByHash",
	"params":["C0CA0215D1530B2A138FB069DB4B9593F2A6D8F98087EA12959A51DF05ADD03D"],
	"id":1
}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": {
        "Hash": "C0CA0215D1530B2A138FB069DB4B9593F2A6D8F98087EA12959A51DF05ADD03D",
        "Id":"857DDB5EBFEBE2A92DB38D95E6F7649AD846D61F249AB7AE81D9EDD890C07041",
        "Index":2,
        "Info": "1414C09094153EAE9C1D3FB255EEDC7090167DD461F413BCA1DD5C9706283A5A",
        "Items": [
            {
                "Name": "code",
                "Value": "001"
            },
            {
                "Name": "quality",
                "Value": "99.99999%"
            },
            {
                "Name": "weight",
                "Value": "10"
            }
        ],
        "Parent":"857DDB5EBFEBE2A92DB38D95E6F7649AD846D61F249AB7AE81D9EDD890C07041",
        "TokenURI": "http://www.jingtum.com"
    },
    "status": "success"
}
```
***

#### <a name="jt_getTokenByIndex"></a>jt_getTokenByIndex 通过Info的Hash及Index查询token的具体信息

查询token的具体信息

##### Parameters 参数

1. `HASH`, Token Info的唯一哈希，见jt_issueToken中返回的hash值
2. `INT`, Token在所在的Token Info中Index（与创建顺序一致)

```js
params: ["C0CA0215D1530B2A138FB069DB4B9593F2A6D8F98087EA12959A51DF05ADD03D", 2]
```

##### Returns 返回值

`OBJECT` - token的详细信息

##### Example 例子
```js
// Request 请求
curl -X POST --data '{
	"jsonrpc":"2.0",
	"method":"jt_getTokenByIndex",
	"params":["C0CA0215D1530B2A138FB069DB4B9593F2A6D8F98087EA12959A51DF05ADD03D", 2],
	"id":1
}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": {
        "Hash": "C0CA0215D1530B2A138FB069DB4B9593F2A6D8F98087EA12959A51DF05ADD03D",
        "Id":"857DDB5EBFEBE2A92DB38D95E6F7649AD846D61F249AB7AE81D9EDD890C07041",
        "Index":2,
        "Info": "1414C09094153EAE9C1D3FB255EEDC7090167DD461F413BCA1DD5C9706283A5A",
        "Items": [
            {
                "Name": "code",
                "Value": "001"
            },
            {
                "Name": "quality",
                "Value": "99.99999%"
            },
            {
                "Name": "weight",
                "Value": "10"
            }
        ],
        "Parent":"857DDB5EBFEBE2A92DB38D95E6F7649AD846D61F249AB7AE81D9EDD890C07041",
        "TokenURI": "http://www.jingtum.com"
    },
    "status": "success"
}
```

***

#### <a name="jt_getTokenCount"></a> jt_getTokenCount 获取某种Token当前数量

返回某种Token的当前数量


##### Parameters 参数

1. `HASH` - Token Info的哈希

```js
params: [
“5FBA28FF069A25509B71ADA3CF2B3A22E00867FC54186B878117986B57509534”
]
```

##### Returns 返回值

`QUANTITY` - 该地址发起的交易数.


##### Example 例子
```js
// Request 请求
curl -X POST --data '{"jsonrpc":"2.0","method":"jt_getTokenCount","params":["5FBA28FF069A25509B71ADA3CF2B3A22E00867FC54186B878117986B57509534"],"id":1}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
	"id":1,
	"jsonrpc":"2.0",
	"result":5,
	"status":"success"
}
```


***

#### <a name="jt_getTokenInfoByHash"></a>jt_getTokenInfoByHash 查询token定义的具体信息

查询token定义的具体信息

##### Parameters 参数

1. `HASH`, Token定义的Info信息，见jt_issueToken或者jt_tokensOf中返回的hash值

```js
params: ["1414C09094153EAE9C1D3FB255EEDC7090167DD461F413BCA1DD5C9706283A5A"]
```

##### Returns 返回值

`OBJECT` - token的具体定义信息

##### Example 例子
```js
// Request 请求
curl -X POST --data '{
	"jsonrpc":"2.0",
	"method":"jt_getTokenInfoByHash",
	"params":["1414C09094153EAE9C1D3FB255EEDC7090167DD461F413BCA1DD5C9706283A5A"],
	"id":1
}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": {
        "Name": "TEST",
        "Symbol": "test",
        "TotalSupply": 100,
        "Items": [
            {
                "Name": "code",
                "Type": "string",
                "Desc": "the code of the token"
            },
            {
                "Name": "quality",
                "Type": "string",
                "Desc": "the quality of the token"
            },
            {
                "Name": "weight",
                "Type": "number",
                "Desc": "the weight of the token"
            }
        ]
    },
    "status": "success"
}
```

***

#### <a name="jt_createData"></a>jt_createData 存证数据

存证数据并同步到各个节点

##### Parameters 参数

1. `OBJECT` - 交易对象
  - `from`: `ADDRESS` - 交易发起一方的地址
  - `to`: `ADDRESS` - (当创建新交易时可选) 交易所指向的地址
  - `fee`: `STRING`  - (可选，默认12) 执行交易所需提供的交易费用
  - `secret`: `STRING` - (可选) 注意：此时secret将在网络上明文传输，存在安全隐患
  - `data`: `ARRAY` - 一个Hash256字符串的数组，其中的数据或者文件，可通过jt_uploadFile及jt_uploadData上传, 将记录在memo数组里

 ```js
 ["646DB9E90DF8D6F31F0F04DE6A99F4F31A11712A544BBEA3DBEDFD7A7EF4F05B"]
 ```

##### Returns 返回值

- `transaction`:`HASH` - 返回区块链上的交易哈希，当交易不存在时返回0哈希
	使用 [jt_getTransactionReceipt](#jt_getTransactionReceipt) 来获取交易收据
	
- `hash`:`HASH` - 返回该数据定义的hash
- `gas`: `OBJECT` - 对于需要消耗gas的调用，返回消耗的gas数量及对应的交易哈希

##### Example 例子
```js
// Request 请求
curl -X POST --data '{"jsonrpc":"2.0","method":"jt_createData","params":[{"from":"jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh","to":"j9VSrHSiZPiJBPUS6iwYiT8yfy8iFbeR4E","value":"1", "data":["646DB9E90DF8D6F31F0F04DE6A99F4F31A11712A544BBEA3DBEDFD7A7EF4F05B"]}],"id":1}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
{
            "hash": "20C756B7EB35C479370FD6D4C44EAE63C7358510B1E0B3316D6628D8F73696BC",
            "transaction": "5ECE245186E97CA309947C7E06AD817BC074567C042D0C7ABB1EF038359D0C60"
        }
  ],
  "status": "success"
}
```


***

#### <a name="jt_removeData"></a>jt_removeData 删除数据

从各个节点删除数据

##### Parameters 参数

1. `OBJECT` - 交易对象
  - `from`: `ADDRESS` - 交易发起一方的地址
  - `to`: `ADDRESS` - (当创建新交易时可选) 交易所指向的地址
  - `fee`: `STRING`  - (可选，默认12) 执行交易所需提供的交易费用
  - `secret`: `STRING` - (可选) 注意：此时secret将在网络上明文传输，存在安全隐患
  - `data`: `ARRAY` - 一个Hash256字符串的数组，其中的数据或者文件，可通过jt_uploadFile及jt_uploadData上传, 并通过jt_createData记录在memo数组里

 ```js
 ["646DB9E90DF8D6F31F0F04DE6A99F4F31A11712A544BBEA3DBEDFD7A7EF4F05B"]
 ```
 
##### Returns 返回值

- `transaction`:`HASH` - 返回区块链上的交易哈希，当交易不存在时返回0哈希
	使用 [jt_getTransactionReceipt](#jt_getTransactionReceipt) 来获取交易收据
	
- `hash`:`HASH` - 返回该数据定义的hash
- `gas`: `OBJECT` - 对于需要消耗gas的调用，返回消耗的gas数量及对应的交易哈希

##### Example 例子
```js
// Request 请求
curl -X POST --data '{"jsonrpc":"2.0","method":"jt_createData","params":[{"from":"jHb9CJAWyB4jr91VRWn96DkukG4bwdtyTh","to":"j9VSrHSiZPiJBPUS6iwYiT8yfy8iFbeR4E","value":"1", "data":["646DB9E90DF8D6F31F0F04DE6A99F4F31A11712A544BBEA3DBEDFD7A7EF4F05B"]}],"id":1}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
{
            "hash": "20C756B7EB35C479370FD6D4C44EAE63C7358510B1E0B3316D6628D8F73696BC",
            "transaction": "5ECE245186E97CA309947C7E06AD817BC074567C042D0C7ABB1EF038359D0C60"
        }
  ],
  "status": "success"
}
```


***


#### <a name="jt_uploadData"></a>jt_uploadData 上传数据

上传数据至数据缓存区，并返回数据的Hash256, 可以在<a href="#jt_createToken">jt_createToken</a>中的file类型使用

##### Parameters 参数

1. `DATA` - 十六进制字符串

##### Returns 返回值

`HASH`: 数据对应的Hash256的字符串
`INT`: 数据对应的字节数

##### Example 例子

```js
// Request 请求
curl -X POST --data '{"jsonrpc":"2.0","method":"jt_uploadData","params":["0294535FEE309F280DC4CF9F4134ECC909F8521CF51FEB7D72454E77F929DCB8C9","3044022026F2ABED3AFF2D28F1A5E5AF93C8B4FE8DF771406AF5B746F4A057582303BDC8022061A0D542BF670EF5175F084F66275561C3263A77F37E847297ED7FAE89534214"],"id":1}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
        [
            "A4F6FEFB87AAEA5FF83D3671130C51F7F23E73612430C53EE116526275C9BE47",
            "00A3A563873C2CBE4AE003ED09B74BDCD91A32DA1C93FB24E05BD5DBC9CB6680"
        ],
        [
            33,
            70
        ]
    ],
  "status": "success"
}
```

***

#### <a name="jt_downloadData"></a>jt_downloadData 下载数据

下载数据

##### Parameters 参数

1. `HASH` - 十六进制字符串

##### Returns 返回值

`DATA`: Hash256对应的原始数据

##### Example 例子

```js
// Request 请求
curl -X POST --data '{"jsonrpc":"2.0","method":"jt_downloadData","params":["A4F6FEFB87AAEA5FF83D3671130C51F7F23E73612430C53EE116526275C9BE47",
		"00A3A563873C2CBE4AE003ED09B74BDCD91A32DA1C93FB24E05BD5DBC9CB6680"],"id":1}' http://localhost:7545/v1/jsonrpc

// Result 结果
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
        [
            "0294535FEE309F280DC4CF9F4134ECC909F8521CF51FEB7D72454E77F929DCB8C9",
        "3044022026F2ABED3AFF2D28F1A5E5AF93C8B4FE8DF771406AF5B746F4A057582303BDC8022061A0D542BF670EF5175F084F66275561C3263A77F37E847297ED7FAE89534214"
        ]
    ],
  "status": "success"
}
```

***

#### <a name="jt_uploadFile"></a>jt_uploadFile 上传文件

上传文件至数据缓存区，并返回数据的Hash256, 可以在<a href="#jt_createToken">jt_createToken</a>中的file类型使用

##### Parameters 参数

1. 与网络浏览器中多文件上传接口兼容

```
<form enctype="multipart/form-data" action="/v1/jsonrpc/jt_uploadFile" method="post">
 <input type="file" name="file" multiple="multiple">
 <input type="submit" value="upload">
</form>
```
或通过访问API接口<a href="http://localhost:7544/v1/jsonrpc/jt_uploadFile">http://localhost:7544/v1/jsonrpc/jt_uploadFile</a>有简单页面，访问路径是/v1/jsonrpc/jt_uploadFile

##### Returns 返回值

`HASH`: 文件对应的Hash256的字符串
`STRING`: 文件对应的文件名
`INT`: 文件对应的字节数

##### Example 例子

```js
// Request 请求
curl -X POST http://localhost:8545/v1/jsonrpc/jt_uploadFile -F "file=@/Think.pdf"

// Result 结果
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": [
    [
        "FED6711D6963EB09EFE10561D26D0C6875443A1C283A41C1674C6489F2F8ED84",
        2837592,
        "Think.pdf"
    ]
],
  "status": "success"
}
```

***

#### <a name="jt_downloadFile"></a>jt_downloadFile 下载文件

下载文件

##### Parameters 参数

1. `HASH` - 十六进制字符串
2. `NAME` - 下载后的文件名（可选，默认为HASH值）

##### Returns 返回值

`FILE`: 文件

##### Example 例子

```js
// Request 请求
curl -X POST --data '{"jsonrpc":"2.0","method":"jt_downloadFile","params":["FED6711D6963EB09EFE10561D26D0C6875443A1C283A41C1674C6489F2F8ED84"],"id":1}' http://localhost:7545/v1/jsonrpc > /Think.pdf

// Result 结果
Think.pdf文件
```