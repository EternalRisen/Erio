const queries = [
    `
    CREATE TABLE IF NOT EXISTS servers (
        serverid varchar(50),
        servername varchar(50) NOT NULL,
        modlog varchar(50),
        muterole varchar(50),
        CONSTRAINT pk_servers PRIMARY KEY (serverid)
    );
    
    CREATE TABLE IF NOT EXISTS blacklist (
        userid varchar(50) NOT NULL,
        username varchar(50) NOT NULL,
        CONSTRAINT pk_blacklisted PRIMARY KEY (userid)
    );
    
    CREATE TABLE IF NOT EXISTS roles (
        roleid varchar(50) NOT NULL,
        serverid varchar(50) NOT NULL,
        rolename varchar(50) NOT NULL,
        roleposition varchar(50),
        removeable boolean,
        CONSTRAINT pk_roles PRIMARY KEY (roleid),
        CONSTRAINT fk_servers FOREIGN KEY (serverid) REFERENCES servers(serverid)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS welcome_messages (
        welcome_message varchar(1500),
        welcome_image varchar(150),
        serverid varchar(50) NOT NULL,
        CONSTRAINT fk_servers FOREIGN KEY (serverid) REFERENCES servers(serverid)
    );

    ALTER TABLE IF EXISTS servers
    ADD COLUMN IF NOT EXISTS welcomechannel varchar(18);
    `
];

exports.queries = queries;
