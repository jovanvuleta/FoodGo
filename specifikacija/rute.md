## Autentikacija
> rute počinju sa `api/administration/`

| Ruta     | Metoda | In                   | Out           |
|----------|--------|----------------------|---------------|
| login    | POST   | CustomerLogin        | LoginResponse |
| logout   | POST   | CustomerId (Long)    | Boolean       |
| register | POST   | CustomerRegistration | LoginResponse |


## Profil
> rute počinju sa `api/profile/`

| Ruta         | Metoda | In                | Out                |
|--------------|--------|-------------------|--------------------|
| edit         | POST   | CustomerProfile   | CustomerProfile    |
| get          | GET    | CustomerId (long) | CustomerProfile    |
| modAddresses | POST   | addresses         | CustomerProfile    |
| modFavFood   | POST   | favFood           | CustomerProfile    |
| modFavRest   | POST   | favRestaurants    | CustomerProfile    |
# Provertii out nije isti kao sto ovde pise

## Restaurant
> rute počinju sa `api/restaurant/`

| Ruta | Metoda | In                  | Out                |
|------|--------|---------------------|--------------------|
| all  | GET    |                     | List< Restaurant > |
| id   | GET    | RestaurantId (long) | Restaurant         |


## Meal
> rute počinju sa `api/meal/`

| Ruta | Metoda | In                  | Out          |
|------|--------|---------------------|--------------|
| id   | GET    | MealId (long)       | Meal         |


## Order
> rute počinju sa `api/order/`

| Ruta | Metoda | In                  | Out        |
|------|--------|---------------------|------------|
| send | POST   | Order               | Boolean    |
| edit | POST   | Order               | Order      |


## History
> rute počinju sa `api/history/`

| Ruta              | Metoda | In         | Out                |
|-------------------|--------|------------|--------------------|
| all               | GET    | CustomerId | List< Order >      |