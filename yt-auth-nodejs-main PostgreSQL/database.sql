DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS userverification;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS folders;

CREATE TABLE IF NOT EXISTS public.users
(
    userid character varying(100) PRIMARY KEY,
    name character varying(50) ,
    email character varying(50) ,
    password character varying(100) ,
    passwordresettoken character varying(100) ,
    resettokencreatedat date,
    encodedtotpkey character varying(100) ,
    twofactorforced boolean DEFAULT false,
    twofactorenabled boolean DEFAULT false);

CREATE TABLE IF NOT EXISTS public.userverification
(
    userid character varying(100) ,
    uniquestring character varying(100) ,
    createdat bigint,
    expiredat bigint,
    CONSTRAINT FK_userverification_users FOREIGN KEY(userid)
        REFERENCES users(userid));

CREATE TABLE IF NOT EXISTS public.folders
(
    folderid character varying(100) PRIMARY KEY,
	userid character varying(100),
    name character varying(100),
    foldersize character varying(50),
    createdat bigint,
    updatedat bigint,
    CONSTRAINT FK_folders_users FOREIGN KEY(userid)
        REFERENCES users(userid));

CREATE TABLE IF NOT EXISTS public.files
(
    fileid character varying(100) PRIMARY KEY,
    userid character varying(100),
    name character varying(100),
    minetype character varying(25),
    filesize character varying(25),
    createdat bigint,
    updatedat bigint,
    CONSTRAINT FK_files_users FOREIGN KEY(userid)
        REFERENCES users(userid));



