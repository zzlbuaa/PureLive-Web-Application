#### POST /users/login

```
Request  
{  
 "email": "", "password":"",}  
```

#### GET /reservation/unfinished/:userId

```
[
    {
        "reservationId": 1,
        "reserveDate": "2019-02-23T19:15:09.000Z",
        "houseReview": "Great",
        "guestReview": "He is really good!",
        "payment": 152,
        "houseId": 2,
        "userId": 5252,
        "startDate": "2019-02-24",
        "leaveDate": "2019-02-26",
        "resScore": 0,
        "finished": 0
    }
]
```

#### GET /reservation/unfinished/:userId

```
Similar to GET /reservation/finished/:userId
```

#### POST /houses/postHouse

Request

```
{
    "user_id" : 2,
    "availableDates" : "2019-04-01",
    "price" : 333,
    "address" : "999 E University Ave",
    "city" : "Urbana",
}
```

Response

```
{"result" : true}
```

#### POST /houses/update

Request: should be a subset of these attributes, but house_id is compulsory

```
{
    "house_id" : 17,
    "user_id" : 2,
    "availableDates" : "2019-04-01",
    "price" : 333,
    "address" : "999 E University Ave",
    "city" : "Urbana"
}
```

Response

```
{"result" : true}
```

#### POST /houses/delete

Request

```
{"house_id" : 17}
```

Response

```
{"result" : true}
```

#### GET /houses/myhouse/:user_id

```
[
    {
        "house_id": 17,
        "availableDates": "1970-01-01",
        "price": 0,
        "address": "",
        "city": "London",
        "user_id": 5252,
        "avgScore": 0,
        "finishedRes": 0,
        "imgDir": "/12.jpg"
    },
    {
        "house_id": 20,
        "availableDates": "2019-04-01",
        "price": 5900,
        "address": "address",
        "city": "Champaign",
        "user_id": 5252,
        "avgScore": 0,
        "finishedRes": 0,
        "imgDir": "/15.jpg"
    }
]
```

#### GET /houses/index

```
get 6 random houses for index page
```

#### Search Bar: POST /search/info

Request

```
"city" : "Urbana",
"startDate" : "2019-04-12",
"leaveDate" : "2019-04-15",
"user_id" : "5252", (optional)
"price" : "DESC"/"ASC", (optional)
"score" : "DESC"/"ASC" (optional)
```

Response

```
house information for the requested search
```

#### POST /users/registerUsers 

Request

```
"gender": "male",
"age": 38,
"firstname": "Rick",
"lastname": "Grimmes",
"password": "uiuc2052",
"user_name": "RickNo1",
"user_phone": "2177215656",
"user_email": "rick001@outlook.com"
```

Response

```
True or False (User name has been used)
```

#### POST /users/login

Request

```
"user_name" : "qkhada", 
"password" : "12346"
```

Response

```
If no such user or password wrong, return False

If true, return
{
 confirmDetails: true,
 user_id,
 firstname,
 lastname,
 user_phone,
 user_email
}
```


Advanced functions

1. Recommendation based on user tags
   - House tags: Luxury/Exclusive Stay, Downtown, Free Parking, Comfy Cozy Space, Quiet Room, Easy Transportation, Fantastic View
   - User tags: Single, In a Relationship,
   - Algorithm
     - First, select user's unfinished reservation after current date, then select other users having unfinished reservation to the same city.
     - Rank these users based on user tag, finished reservation house tag, price, age, gender
     - 
2. Visualization


#### GET /houses/houseDetail/:houseId
house详情页相关数据

Request
```
{ 
 houseId
}
```
Response
```
{
 address, 
 cityName, 
 house tag, 
 avgScore, 
 price per night
}
```
#### GET /info/countHouse/:cityname
return the number of houses in the city you search

Request
```
{
 cityname
}
```
Response
```
{
countHouse
}
```

#### GET /info/avgPrice/:cityname
return average prices of the city you search

Request
```
{
 cityname
}
```
Response
```
{
 avgPrice
}
```

#### GET /info/range/:cityname
Return price range for data visualization, return a list.
 * For element in the list, if null, front-end should give 0 after iterating the list

Request
```
{
cityname
}
```
Response
```
{
 countRangeA (0-100)
 countRangeB (100-300)
 countRangeC (300-500)
 countRangeD (>= 500)
}
```
