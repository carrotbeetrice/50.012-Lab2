# 50.012 Networks Lab 2: Shopping API

> Submitted by Caryl Beatrice Aragon Peneyra (1004618)

## Setup + Run

Base url: `http://localhost:8080`

Run `docker-compose up`. The base url should return the following gif:

![unauthorized](./public/unauthorized.gif)

## Authentication

### **User Login**

`POST /users/login`

On successful login, returns user data and API key.

Login credentials are to be provided in request body.

Example request payload:

```
{
  username: 'Coy_Hermann10',
  password: 'qIP0oxXI_lys3o2'
}
```

Example response body:

```
// Successful login response
{
    "userData": {
        "name": {
            "firstname": "Janiya",
            "lastname": "Rippin"
        },
        "_id": "615de0629badb53f11420fbe", // Use this Id for shopping cart related requests
        "email": "Chet_Barton16@example.com",
        "username": "Coy_Hermann10",
        "phone": "555-977-4035"
    },
    "apiKey": "773f4d6d-ad7e-4fcf-9d90-96c6625528a5" // Add to all subsequent request headers
}
```

Unsuccessful login (incorrect/missing credentials or unregistered user) returns a status code of 400.

This API uses API key header authentication for every request. Add the following header for ALL requests after successful login:

`Api-Key: 773f4d6d-ad7e-4fcf-9d90-96c6625528a5 // API key`

### **User Registration**

`POST /users/register`

Registration credentials are to be provided in request body.

Example request body:

```
{
  email: '', // required
  username: '', // required
  password: '', // required
  firstname: '',
  lastname: '',
  phone: ''
}
```

On successful registration, returns a status code of 201 and the id of the newly registered user.

Unsuccessful registration if:

- email, username or password missing from payload, or
- An account exists with the provided email address, or
- User provides a username that is already taken

Returns a 400 status code.

## Root path

`GET /`

On successful authentication, returns the following gif:

![Success gif](./public/authorized.gif)

Otherwise,

![Unauthorized gif](./public/unauthorized.gif)

## Products

### **View products**

`GET /products`

Optional query parameters:

- sortBy
  - price - Sort by price
  - ratings - Sort by ratings
- count
- offset

Returns an array of products.

Example response body:

```
[
      {
        "rating": {
            "rate": 4.8,
            "count": 400
        },
        "_id": "615a8c7cb9e2a16322324409", // Use for cart requests
        "title": "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
        "price": 114,
        "description": "...",
        "category": {
            "_id": "615a8b62b9e2a163223243f6",
            "categoryName": "Electronics"
        },
        "image": "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg"
    },
    {
        "rating": {
            "rate": 2.9,
            "count": 250
        },
        "_id": "615a8c7cb9e2a1632232440a",
        "title": "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
        "price": 599,
        "description": "...",
        "category": {
            "_id": "615a8b62b9e2a163223243f6",
            "categoryName": "Electronics"
        },
        "image": "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg"
    }
]
```

## Shopping Cart

### **View shopping cart**

`GET /carts?userId=USER_ID`

Returns current user's shopping cart.

Required query parameters:

- userId: Id of user requesting for cart, e.g. `615de0629badb53f11420fbe`. User can be obtained from the response body of the login endpoint.

Example response:

```
{
    "_id": "615de0629badb53f11420fc0",
    "userId": {
        "_id": "615de0629badb53f11420fbe",
        "username": "Coy_Hermann10"
    },
    "products": [
        {
            "_id": "615e0b9271de6fce282fce6b",
            "product": {
                "_id": "615a8c7cb9e2a163223243fe",
                "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                "price": 109.95
            },
            "quantity": 2
        },
        {
            "product": {
                "_id": "615a8c7cb9e2a16322324404",
                "title": "White Gold Plated Princess",
                "price": 9.99
            },
            "quantity": 1,
            "_id": "615e6ff3c33c6f00d45d2195"
        }
    ]
}
```

If missing user id from request query parameters, returns a status code of 400.

### Add to shopping cart

`PUT /carts?userId=USER_ID&productId=PRODUCT_ID&quantity=QUANTITY`

Adds product into user's shopping cart, updates product quantity if product already in cart.

Required query parameters:

- userId: Id of user sending request
- productId: Id of product to be added to cart
- quantity: Quantity of products to add to cart; overrides existing quantity value if product exists in cart

On success, returns a status code of 200. This can be verified by through the GET request above for the user's cart.

Unsuccessful (returns status code 400) if:

- userId, productId, or quantity parameters are missing, or
- quantity is non-numeric (e.g. string)/ a non-integer number/ negative integer/ zero

### Remove from shopping cart

`DELETE /carts?userId=USER_ID&productId=PRODUCT_ID`

Remove item from user's shopping cart.

Required query parameters:

- userId: Id of user sending request
- productId: id of product to be removed from user's cart

On success, returns a status code of 200. This can be verified by through the GET request above for the user's cart.

Unsuccessful (returns status code 400) if:

- userId or productId missing from query parameters
- product is not in user's cart

## Idempotent Routes

`GET /`

`GET /products`

`GET /carts?userId=USER_ID`

All GET methods are idempotent. GET requests do not modify any resource and hence can be called multiple times without changing the result.

`PUT /carts?userId=USER_ID&productId=PRODUCT_ID&quantity=QUANTITY`

The PUT request checks if the given item exists in the user's cart. If item is not in the cart, the item is added. If the item exists in the cart, the quantity of the item is updated. Calling the PUT request multiple times for a new cart item is equivalent to adding the item to the cart via a single PUT request, while calling the request multiple times is equivalent to updating the item via a single PUT request. Hence this route is idempotent.

```
// PUT request code
let cart = await cartsModel
    .findOne({ userId: { _id: userId } })
    .populate("products.product", "id title price")
    .exec();

const productIndex = cart.products.findIndex((p) => {
    return p.product._id.toString() === productId;
});

if (productIndex > -1) { // Item exists in cart, update quantity
    let cartItem = cart.products[productIndex];
    cartItem.quantity = parseInt(quantity);
    cart.products[productIndex] = cartItem;
} else { // Item not in cart, add as new cart entry
    const newOrder = {
    product: mongoose.Types.ObjectId(productId),
    quantity: parseInt(quantity),
    };
    cart.products.push(newOrder);
}
await cart.save();
```

`DELETE /carts?userId=USER_ID&productId=PRODUCT_ID`

The DELETE route implemented only deletes the item from the cart if it exists in the user's cart. Subsequent DELETE requests for the same product hence does not update the cart.

```
// DELETE code
let cart = await cartsModel
    .findOne({ userId: { _id: userId } })
    .populate("products.product", "id title price")
    .exec();

const productIndex = cart.products.findIndex((p) => {
    return p.product._id.toString() === productId;
});

if (productIndex > -1) { // Only delete if item found in cart
    cart.products.splice(productIndex, 1);
    await cart.save();

    return res.sendStatus(200);
} else {
    return res.status(400).send("Item not in cart");
}
```

`POST /users/login`

Although the login route uses a POST method, there are no resources updated as it only checks for users in the database that have the given credentials. Calling this route multiple times would thus give the same outcome.

```
// Login code
const userData = await usersModel
    .findOne({ username, password }, "name email username phone")
    .exec();

if (userData) {
    return res.send({ userData, apiKey });
} else {
    return res.status(400).send("Invalid credentials");
}
```

`POST /users/register`

This route checks if the provided email and username are already taken by previous users, and does not add the new user if a match for the email and/or username is found in the database. Multiple POST requests for the same user would have the same result as a single request for the user.

```
// Register code
const existingUser = await usersModel
    .findOne({ $or: [{ email }, { username }] })
    .exec();

if (existingUser) {
    let message =
    existingUser.email === email
        ? "Account with this email already exists"
        : "Username already taken";
    return res.status(400).send(message); // Does not add into database
}
```
