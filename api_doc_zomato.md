## Page 1
1) List of city (Get)
> Local: http://localhost:9100/location

> Live:  https://app1api.herokuapp.com/location

2) List of restaurant (Get)
> Local: http://localhost:9100/restaurants

> Live:  https://app1api.herokuapp.com/restaurants

3) Restaurant on the basis of city  (Get)
> Local: http://localhost:9100/restaurants?stateId=3

> Live:  https://app1api.herokuapp.com/restaurants?stateId=3

4) List of QuickSearch (Get)
> Local: http://localhost:9100/mealtype

> Live:  https://app1api.herokuapp.com/mealtype

## Page 2
1)  List of restaurant on basis of meal (Get)
> Local: http://localhost:9100/restaurants?mealId=5

> Live:  https://app1api.herokuapp.com/restaurants?mealId=5

2) List of restaurant on the basis of meal and State (Get)
> Local: http://localhost:9100/restaurants?mealId=5&stateId=2

> Live:  https://app1api.herokuapp.com/restaurants?mealId=5&stateId=2

3) Filter on basis of cuisine (Get)
> Local: http://localhost:9100/filter/1?cuisineId=2

> Live:  https://app1api.herokuapp.com/filter/1?cuisineId=2

4) Filter on basis of cost (Get)
> Local: http://localhost:9100/filter/1?lcost=700&hcost=1200

> Live:  https://app1api.herokuapp.com/filter/1?lcost=700&hcost=1200

5) Sort on basis of cost (Get)
> Local: http://localhost:9100/filter/1?lcost=500&hcost=1200&sort=-1

> Live:  https://app1api.herokuapp.com/filter/1?lcost=500&hcost=1200&sort=-1


## Page 3
1) Details of the restaurant (Get)
> Local: http://localhost:9100/details/5

> Live:  https://app1api.herokuapp.com/details/5


2) Menu of the restaurant (Get)
> Local: http://localhost:9100/menu/7

> Live:  https://app1api.herokuapp.com/menu/7


## Page 4
1) Menu details (selected item)      (Post)
> Local: http://localhost:9100/menuItem

> Live:  https://app1api.herokuapp.com/menuItem

Use Example: [1,4,6]


2) Place order (Post)
> Local: http://localhost:9100/placeOrder
> Live:  https://app1api.herokuapp.com/placeOrder

Use Example: 
{
        "orderId": 2,
        "name": "test",
        "email": "test@test.com",
        "address": "Hno 54, Sector 14",
        "phone": 1234567890,
        "cost": 345,
        "menuItem": [4, 3, 5],
        "status": "In Transit",
        "bank_name": "Axis Bank"
}


## Page 5
1) List of order placed                          (Get) 
> Local: http://localhost:9100/orders

> Live: https://app1api.herokuapp.com/orders


2) List of order placed of particular user       (Get)
> Local: http://localhost:9100/orders?email=amit@gmail.com

> Live:  https://app1api.herokuapp.com/orders?email=amit@gmail.com


3) Update order status                           (Put)
> Local: http://localhost:9100/updateOrder/2

> Live:  https://app1api.herokuapp.com/updateOrder/2

Use Example:
{
    "status": "TAX_SUCCESS",
    "bank_name": "SBI",
    "date": "02/06/2022"
}


////////////////////////////////
## Delete orders                                 (Delete)
> Local: http://localhost:9100/deleteOrder/628c485d93399d546c136d84

> Live:  https://app1api.herokuapp.com/deleteOrder/628c485d93399d546c136d84

