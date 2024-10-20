This is APIs for ShoppyGlobe.

## APIs

- GET `/products` - Get all products
- GET `/products/:id` - Get product by ID
- POST `/auth/login` - Login
- POST `/auth/register` - Register
- POST `/cart` - Add to cart
- PUT `/cart/:id` - Update cart
- DELETE `/cart/:id` - Remove from cart

## Dependencies

- Prisma
- Express
- Bcrypt
- Jsonwebtoken
- Cors
- Nodemon

## Reason for choosing Prisma over Mongoose

- Prisma is a high-level API for MongoDB.
- Scaling is easy with Prisma because of it's edge case support.
- Prisma is a relational database.

## Installation

- Clone the repository

```bash
git clone https://github.com/Lunar-spec/ShoppyGlobe_APIs.git
cd shoppyglobe-api
```

- Navigate to the root directory
- Install the dependencies

```bash
pnpm install
```

- Start the server

```bash
pnpm nodemon
```

- Prisma Studio

```bash
pnpx prisma studio
```

## Usage

- Get all products
- Get product by ID
- Login
- Register
- Add to cart
- Update cart
- Remove from cart
