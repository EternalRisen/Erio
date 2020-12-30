# Erio-bot

# Requirements
- node.js
- PostgreSQL (optional)

## Setup
 - run `npm install`
 - create a `.env` with the following contents:
     ```
     TOKEN=token
     PREFIX=prefix
     ADMINS=admin1,admin2,use_discord_ids
     BOTLOG=channel_id_for_botlog
     GITREPO=your_repo
     PORT=port_for_webserver
     PGUSER=postgres_username
     PGPASSWORD=postgres_user_password
     PGHOST=hostname_or_ip_of_db
     PGPORT=port_of_db
     PGDATABASE=database_name
     ```
- run `npm run start` and it will automatically build the rest for you (optionally you can run `npm run build` followed by `node www-dist/server/app.js`).
