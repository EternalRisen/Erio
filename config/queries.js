const queries = [
    `CREATE TABLE IF NOT EXISTS servers (
        serverid varchar(50),
        servername varchar(50) NOT NULL,
        modlog varchar(50),
        muterole varchar(50),
        constraint pk_servers PRIMARY KEY (serverid)
    );
    
    CREATE TABLE IF NOT EXISTS blacklist (
        userid varchar(50) NOT NULL,
        username varchar(50) NOT NULL,
        constraint pk_blacklisted PRIMARY KEY (userid)
    );
    
    CREATE TABLE IF NOT EXISTS roles (
        roleid varchar(50) NOT NULL,
        serverid varchar(50) NOT NULL,
        rolename varchar(50) NOT NULL,
        roleposition varchar(50),
        removeable boolean,
        constraint pk_roles PRIMARY KEY (roleid),
        constraint fk_servers FOREIGN KEY (serverid) REFERENCES servers(serverid)
    );`
];

exports.queries = queries;
