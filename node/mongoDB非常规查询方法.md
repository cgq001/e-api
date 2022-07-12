## 查询数组JSON
```json

{
  "_id": ObjectId("5cf774a317d273d688fffffc"),
  "_class": "com.sunshine.aunt.model.po.ContractItemExpenseStatistics",
  "statisticsDatetime": "2019-05-22",
  "statisticsList": [
    {
      "ic": "0600",
      "sit": "2",
      "a1": "660.00",
      "a2": "420.00",
      "a3": "5496.00",
      "a4": "3860.00",
      "a5": "0",
      "a6": "0",
      "a7": "0",
      "tt": "2716.00"
    },
  ],
  "storeId": 1297,
  "parentStoreId": 2,
  "storeType": "B"
},
/*5createdAt: 2019/6/5下午3: 52: 03*/{
  "_id": ObjectId("5cf774a317d273d688fffffb"),
  "_class": "com.sunshine.aunt.model.po.ContractItemExpenseStatistics",
  "statisticsDatetime": "2019-05-18",
  "statisticsList": [
    {
      "ic": "0100",
      "sit": "1",
      "a1": "320.00",
      "a2": "304.00",
      "a3": "3042.00",
      "a4": "0",
      "a5": "0",
      "a6": "0",
      "a7": "0",
      "tt": "3666.00"
    }
  ],
  "storeId": 20089,
  "parentStoreId": 20079,
  "storeType": "D"
},
/*6createdAt: 2019/6/5下午3: 52: 03*/{
  "_id": ObjectId("5cf774a317d273d688fffffa"),
  "_class": "com.sunshine.aunt.model.po.ContractItemExpenseStatistics",
  "statisticsDatetime": "2019-05-04",
  "statisticsList": [
    {
      "ic": "0600",
      "sit": "2",
      "a1": "310.00",
      "a2": "70.00",
      "a3": "1400.00",
      "a4": "0",
      "a5": "0",
      "a6": "0",
      "a7": "0",
      "tt": "1780.00"
    }
  ],
  "storeId": 20082,
  "parentStoreId": 20079,
  "storeType": "D"
},
/*7createdAt: 2019/6/5下午3: 52: 03*/{
  "_id": ObjectId("5cf774a317d273d688fffff9"),
  "_class": "com.sunshine.aunt.model.po.ContractItemExpenseStatistics",
  "statisticsDatetime": "2019-05-10",
  "statisticsList": [
    {
      "ic": "0600",
      "sit": "2",
      "a1": "0.00",
      "a2": "60.00",
      "a3": "1300.00",
      "a4": "1300.00",
      "a5": "0",
      "a6": "0",
      "a7": "0",
      "tt": "60.00"
    },
  ],
  "storeId": 20080,
  "parentStoreId": 20079,
  "storeType": "D"
}
```
```js
db.test.aggregate(
{$match: {storeId:1297}}
,{$unwind: "$statisticsList"}
,{$match: {"statisticsList.ic":{$in: ["0100", "0600"]}}}
,{$group: { 
    _id: "$_id",
    storeId:{$first: "$storeId"},
    storeType:{$first: "$storeType"},
    statisticsDatetime:{$first: "$statisticsDatetime"},
    statisticsList:{$push:"$statisticsList"}
}})
```