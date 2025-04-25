# Faculty Event Management App

## Basic Development Guideline

Before starting the development process, you must seed your database with the following seeding commands:

```shell
pnpm db:seed:user
pnpm db:seed:room
pnpm db:seed:calendar-shareable
pnpm db:seed:group-shareable
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

This project was bootstrapped with create-t3-app ([https://create.t3.gg](https://create.t3.gg/))

## Google APIs Setup (Service Account + Admin SDK + Calendar)

This guide explains how to set up **Google APIs** for **Calendar** and **Admin SDK Directory** access using a **Google Service Account** with **Domain-Wide Delegation**, to then integrate those APIs with the FEMS app.

#### 1️. Enable Required APIs

In the [Google Cloud Console](https://console.cloud.google.com):

- Go to **APIs & Services > Library**
- Enable the following:
  - **Google Calendar API**
  - **Admin SDK API**

#### 2️. Create a Service Account

- Go to **IAM & Admin > Service Accounts**
- Click **"Create Service Account"**
- Give it a name and description
- Once created:
  - Navigate to the service account
  - Go to the **"Keys"** tab
  - Click **"Add Key > Create New Key"**
    - Choose **JSON**
    - Save the key securely (used as `keyFile` in your app)

#### 3️. Enable Domain-Wide Delegation

- Open the service account
- Click **"Edit"**, then **"Show Domain-Wide Delegation"**
- Check **"Enable G Suite Domain-wide Delegation"**
- Save and **note the Client ID**

#### 4️. Grant API Scopes in Google Workspace

In your [Google Admin Console](https://admin.google.com):

- Go to **Security > Access and data control > API controls**
- Under **Domain-wide Delegation**, click **"Manage Domain Wide Delegation"**
- Click **"Add new"**:
  - **Client ID**: Paste your service account’s client ID
  - **OAuth Scopes**: (comma-separated)
    ```text
    https://www.googleapis.com/auth/calendar,
    https://www.googleapis.com/auth/calendar.events,
    https://www.googleapis.com/auth/admin.directory.resource.calendar,
    https://www.googleapis.com/auth/admin.directory.group,
    https://www.googleapis.com/auth/admin.directory.group.member
    ```

#### 5️. Summary of OAuth Scopes Used

| OAuth Scope                                                         | Purpose                   |
| ------------------------------------------------------------------- | ------------------------- |
| `https://www.googleapis.com/auth/calendar`                          | Full calendar access      |
| `https://www.googleapis.com/auth/calendar.events`                   | Manage calendar events    |
| `https://www.googleapis.com/auth/admin.directory.resource.calendar` | Manage calendar resources |
| `https://www.googleapis.com/auth/admin.directory.group`             | Manage Workspace groups   |
| `https://www.googleapis.com/auth/admin.directory.group.member`      | Manage group members      |
