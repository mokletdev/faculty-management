# Faculty Event Management App

Before starting the development process, you must seed your database with the following seeding commands:

```shell
pnpm db:seed:user
pnpm db:seed:room
pnpm db:seed:calendar-shareable
```

or just

```shell
pnpm db:seed:all
```

After that, copy the contents in `.env.example` to a new file called `.env` and fill in the variables' value.

You can build the project with:

```shell
pnpm build
```

This project was bootstrapped by create-t3-app ([https://create.t3.gg](https://create.t3.gg/))
