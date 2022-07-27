DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS userverification;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS folders;
DROP TABLE IF EXISTS notification;

INSERT INTO public.users (userid, name,email,password,role,twofactorforced,twofactorenabled) VALUES ('3e95e443-aeca-4019-82c3-1c6b060f9106','Manager','manager.avatec@gmail.com','$2a$10$zF55v.nxr8/xJaKDiyoAY.fYaHu4R32Hvmt.HFYqU3XujnVxuLSg2','Manager',false,false);
SELECT * FROM public.users;
CREATE TABLE IF NOT EXISTS public.users
(
    userid character varying(100) PRIMARY KEY,
    name character varying(50),
    email character varying(50) ,
    password character varying(100) ,
    passwordresettoken character varying(100) ,
    role character varying(100),
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
	userid character varying(100) ,
    name character varying(100),
    foldersize character varying(50),
    activity json [],
    seen json,
    sharing json,
    downloadable json,
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
    activity json [],
    seen json,
    sharing json,
    downloadable json,
    createdat bigint,
    updatedat bigint,
    CONSTRAINT FK_files_users FOREIGN KEY(userid)
        REFERENCES users(userid));

CREATE TABLE IF NOT EXISTS public.notification
(
    notificationid character varying(100) PRIMARY KEY,
    sendfrom character varying(100),
    sendto character varying(100),
    subject character varying(100),
    nots character varying(100),
    details character varying(100),
    isSeen json,
    CONSTRAINT FK_files_users FOREIGN KEY(sendto)
        REFERENCES users(userid));


