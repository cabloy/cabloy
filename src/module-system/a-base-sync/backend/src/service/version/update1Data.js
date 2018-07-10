const tables = {
  aUser: `
          CREATE TABLE aUser (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            disabled int(11) DEFAULT '0',
            userName varchar(50) DEFAULT NULL,
            realName varchar(50) DEFAULT NULL,
            email varchar(50) DEFAULT NULL,
            mobile varchar(50) DEFAULT NULL,
            avatar varchar(255) DEFAULT NULL,
            motto varchar(255) DEFAULT NULL,
            locale varchar(255) DEFAULT NULL,
            anonymous int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aUserAgent: `
          CREATE TABLE aUserAgent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            userIdAgent int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAuthProvider: `
          CREATE TABLE aAuthProvider (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            disabled int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            providerName varchar(50) DEFAULT NULL,
            config json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aAuth: `
          CREATE TABLE aAuth (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            providerId int(11) DEFAULT '0',
            profileId varchar(255) DEFAULT NULL,
            profile json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aRole: `
          CREATE TABLE aRole (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleName varchar(50) DEFAULT NULL,
            leader int(11) DEFAULT '0',
            catalog int(11) DEFAULT '0',
            \`system\` int(11) DEFAULT '0',
            sorting int(11) DEFAULT '0',
            roleIdParent int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleRef: `
          CREATE TABLE aRoleRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdParent int(11) DEFAULT '0',
            level int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleInc: `
          CREATE TABLE aRoleInc (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdInc int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleIncRef: `
          CREATE TABLE aRoleIncRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdInc int(11) DEFAULT '0',
            roleIdSrc int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleExpand: `
          CREATE TABLE aRoleExpand (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdBase int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aUserRole: `
          CREATE TABLE aUserRole (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtomClass: `
          CREATE TABLE aAtomClass (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            atomClassName varchar(255) DEFAULT NULL,
            atomClassIdParent int(11) DEFAULT '0',
            public int(11) DEFAULT '0',
            flow int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtom: `
          CREATE TABLE aAtom (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            atomEnabled int(11) DEFAULT '0',
            atomFlow int(11) DEFAULT '0',
            atomFlag int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            atomName varchar(255) DEFAULT NULL,
            userIdCreated int(11) DEFAULT '0',
            userIdUpdated int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtomAction: `
          CREATE TABLE aAtomAction (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            code int(11) DEFAULT '0',
            name varchar(50) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aLabel: `
          CREATE TABLE aLabel (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            labels JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aAtomLabel: `
          CREATE TABLE aAtomLabel (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            labels JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aAtomLabelRef: `
          CREATE TABLE aAtomLabelRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            labelId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtomStar: `
          CREATE TABLE aAtomStar (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            star int(11) DEFAULT '1',
            PRIMARY KEY (id)
          )
        `,
  aRoleRight: `
          CREATE TABLE aRoleRight (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            action int(11) DEFAULT '0',
            scope JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aRoleRightRef: `
          CREATE TABLE aRoleRightRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleRightId int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            action int(11) DEFAULT '0',
            roleIdScope int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aFunction: `
          CREATE TABLE aFunction (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            title varchar(255) DEFAULT NULL,
            scene int(11) DEFAULT '0',
            autoRight int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            action int(11) DEFAULT '0',
            sorting int(11) DEFAULT '0',
            menu int(11) DEFAULT '0',
            public int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aFunctionStar: `
          CREATE TABLE aFunctionStar (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            functionId int(11) DEFAULT '0',
            star int(11) DEFAULT '1',
            PRIMARY KEY (id)
          )
        `,
  aFunctionLocale: `
          CREATE TABLE aFunctionLocale (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            functionId int(11) DEFAULT '0',
            locale varchar(50) DEFAULT NULL,
            titleLocale varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aRoleFunction: `
          CREATE TABLE aRoleFunction (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            functionId int(11) DEFAULT '0',
            roleRightId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
};

const views = {
  aViewUserRoleRef: `
create view aViewUserRoleRef as
  select a.iid,a.userId,a.roleId,b.roleIdParent,b.level from aUserRole a
    inner join aRoleRef b on a.roleId=b.roleId
  `,
  aViewUserRoleExpand: `
create view aViewUserRoleExpand as
  select a.iid,a.userId,a.roleId,b.roleIdBase,b.id as roleExpandId from aUserRole a
    left join aRoleExpand b on a.roleId=b.roleId
  `,
  aViewUserRightAtomClass: `
create view aViewUserRightAtomClass as
  select a.iid,a.userId as userIdWho,a.roleExpandId,a.roleId,a.roleIdBase,b.id as roleRightId,b.atomClassId,b.action,b.scope from aViewUserRoleExpand a
    inner join aRoleRight b on a.roleIdBase=b.roleId
  `,
  aViewUserRightAtomClassUser: `
create view aViewUserRightAtomClassUser as
  select a.iid,a.userId as userIdWho,b.atomClassId,b.action,c.userId as userIdWhom from aViewUserRoleExpand a
    inner join aRoleRightRef b on a.roleIdBase=b.roleId
    inner join aViewUserRoleRef c on b.roleIdScope=c.roleIdParent
  `,
  aViewUserRightAtom: `
create view aViewUserRightAtom as
  select a.iid, a.id as atomId,a.userIdCreated as userIdWhom,b.userIdWho,b.action from aAtom a,aViewUserRightAtomClassUser b
    where a.deleted=0 and a.atomEnabled=1
      and a.atomClassId=b.atomClassId
      and a.userIdCreated=b.userIdWhom
  `,
  aViewUserRightFunction: `
create view aViewUserRightFunction as
  select a.iid,a.userId as userIdWho,a.roleExpandId,a.roleId,a.roleIdBase,b.id as roleFunctionId,b.functionId from aViewUserRoleExpand a
    inner join aRoleFunction b on a.roleIdBase=b.roleId
  `,
};

const functions = {
};

const procedures = {
  aSelectAtoms: `
create procedure aSelectAtoms (in _tableName varchar(50),in __where text,in __orders text,in __limit text,in _iid int,in _userIdWho int,in _star int,in _label int)
begin
  -- tables
  -- a: aAtom
  -- b: aAtomClass
  -- c: aViewUserRightAtom
  -- d: aAtomStar
  -- e: aAtomLabelRef
  -- f: {item}
  -- g: aUser

  declare _where,_orders,_limit text;
  declare _starField,_starJoin,_starWhere text;
  declare _labelField,_labelJoin,_labelWhere text;
  declare _itemField,_itemJoin text;

  if __where<>'' then
    set _where=concat(__where,' AND');
  else
    set _where=' WHERE';
  end if;

  if __orders<>'' then
    set _orders=__orders;
  else
    set _orders='';
  end if;

  if __limit<>'' then
    set _limit=__limit;
  else
    set _limit='';
  end if;

  if _star<>0 then
    set _starJoin=' inner join aAtomStar d on a.id=d.atomId';
    set _starWhere=concat(' and d.iid=',_iid,' and d.userId=',_userIdWho,' and d.star=1');
  else
    set _starJoin='';
    set _starWhere='';
  end if;
    set _starField=concat(
        ',(select d2.star from aAtomStar d2 where d2.iid=',_iid,' and d2.atomId=a.id and d2.userId=',_userIdWho,') as star'
      );

  if _label<>0 then
    set _labelJoin=' inner join aAtomLabelRef e on a.id=e.atomId';
    set _labelWhere=concat(' and e.iid=',_iid,' and e.userId=',_userIdWho,' and e.labelId=',_label);
  else
    set _labelJoin='';
    set _labelWhere='';
  end if;
    set _labelField=concat(
        ',(select e2.labels from aAtomLabel e2 where e2.iid=',_iid,' and e2.atomId=a.id and e2.userId=',_userIdWho,') as labels'
      );

  if _tableName<>'' then
    set _itemField='f.*,';
    set _itemJoin=concat(' inner join ',_tableName,' f on f.atomId=a.id');
  else
    set _itemField='';
    set _itemJoin='';
  end if;

  set @sql=concat(
    'select ',_itemField,'a.id as atomId,a.itemId,a.atomEnabled,a.atomFlag,a.atomFlow,a.atomClassId,a.atomName,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,b.module,b.atomClassName,b.atomClassIdParent,g.userName,g.avatar',_starField,_labelField,' from aAtom a',
    ' inner join aAtomClass b on a.atomClassId=b.id',
    ' inner join aUser g on a.userIdCreated=g.id',
    _itemJoin,
    _starJoin,
    _labelJoin,
    _where,
    ' (',
    '  a.deleted=0 and a.iid=', _iid,
    _starWhere,
    _labelWhere,
    '    and (',
    '           (a.userIdCreated=',_userIdWho,') or',
    '             (a.atomEnabled=1 and (',
    '               (',
    '                 a.atomFlow=1 and (',
    '                   (exists(select c.atomId from aViewUserRightAtom c where c.iid=',_iid,' and a.id=c.atomId and c.action>2 and c.userIdWho=',_userIdWho,')) or',
    '                   (a.userIdCreated=',_userIdWho,' and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=',_iid,' and a.atomClassId=c.atomClassId and c.action>2 and c.scope=0 and c.userIdWho=',_userIdWho,'))',
    '                 )',
    '               ) or (',
    '                 a.atomFlow=0 and (',
    '                   b.public=1 or exists(select c.atomId from aViewUserRightAtom c where c.iid=',_iid,' and a.id=c.atomId and c.action=2 and c.userIdWho=',_userIdWho,')',
    '                 )',
    '                )',
    '             ))',
    '        )',
    ' )',
    _orders,
    _limit
  );

  prepare stmt from @sql;
  execute stmt;
  deallocate prepare stmt;

end
`,
  aGetAtom: `
create procedure aGetAtom (in _tableName varchar(50),in _atomId int,in _iid int,in _userIdWho int)
begin
  -- tables
  -- a: aAtom
  -- b: aAtomClass
  -- d: aAtomStar
  -- e: aAtomLabelRef
  -- f: {item}
  -- g: aUser

  declare _starField,_labelField text;
  declare _itemField,_itemJoin text;

  set _starField=concat(
        ',(select d.star from aAtomStar d where d.iid=',_iid,' and d.atomId=a.id and d.userId=',_userIdWho,') as star'
      );

  set _labelField=concat(
        ',(select e.labels from aAtomLabel e where e.iid=',_iid,' and e.atomId=a.id and e.userId=',_userIdWho,') as labels'
      );

  if _tableName<>'' then
    set _itemField='f.*,';
    set _itemJoin=concat(' inner join ',_tableName,' f on f.atomId=a.id');
  else
    set _itemField='';
    set _itemJoin='';
  end if;

  set @sql=concat(
    'select ',_itemField,'a.id as atomId,a.itemId,a.atomEnabled,a.atomFlag,a.atomFlow,a.atomClassId,a.atomName,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,b.module,b.atomClassName,b.atomClassIdParent,g.userName,g.avatar',_starField,_labelField,' from aAtom a',
    ' inner join aAtomClass b on a.atomClassId=b.id',
    ' inner join aUser g on a.userIdCreated=g.id',
    _itemJoin,
    ' where a.id=', _atomId,
    '   and a.deleted=0 and a.iid=', _iid
  );

  prepare stmt from @sql;
  execute stmt;
  deallocate prepare stmt;

end
`,
  aCheckRightRead: `
create procedure aCheckRightRead (in _iid int,in _userIdWho int,in _atomId int)
begin

  select a.* from aAtom a
   left join aAtomClass b on a.atomClassId=b.id
    where (
     a.deleted=0 and a.iid=_iid and a.id=_atomId
     and (
            (a.userIdCreated=_userIdWho) or
            (a.atomEnabled=1 and (
              (
                a.atomFlow=1 and (
                  (exists(select c.atomId from aViewUserRightAtom c where c.iid=_iid and a.id=c.atomId and c.action>2 and c.userIdWho=_userIdWho)) or
                  (a.userIdCreated=_userIdWho and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=_iid and a.atomClassId=c.atomClassId and c.action>2 and c.scope=0 and c.userIdWho=_userIdWho))
                )
              ) or (
                a.atomFlow=0 and (
                  b.public=1 or exists(select c.atomId from aViewUserRightAtom c where c.iid=_iid and a.id=c.atomId and c.action=2 and c.userIdWho=_userIdWho)
                )
              )
            ))
          )
    );

end
`,
  aCheckRightUpdate: `
create procedure aCheckRightUpdate (in _iid int,in _userIdWho int,in _atomId int,in _action int,in _actionFlag varchar(255))
begin

  select a.* from aAtom a
    where (
     a.deleted=0 and a.iid=_iid and a.id=_atomId
     and (
            (a.atomEnabled=0 and a.userIdCreated=_userIdWho) or
            (a.atomEnabled=1 and (
              (exists(select c.atomId from aViewUserRightAtom c where c.iid=_iid and a.id=c.atomId and c.action=_action and (_actionFlag='' or find_in_set(a.atomFlag,_actionFlag)>0 ) and c.userIdWho=_userIdWho)) or
              (a.userIdCreated=_userIdWho and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=_iid and a.atomClassId=c.atomClassId and c.action=_action and (_actionFlag='' or find_in_set(a.atomFlag,_actionFlag)>0 ) and c.scope=0 and c.userIdWho=_userIdWho))
            ))
          )
    );

end
`,
  aCheckRightAction: `
create procedure aCheckRightAction (in _iid int,in _userIdWho int,in _atomId int,in _action int,in _actionFlag varchar(255))
begin

  select a.* from aAtom a
    where (
     a.deleted=0 and a.iid=_iid and a.id=_atomId and a.atomEnabled=1
     and (
            (exists(select c.atomId from aViewUserRightAtom c where c.iid=_iid and a.id=c.atomId and c.action=_action and (_actionFlag='' or find_in_set(a.atomFlag,_actionFlag)>0 ) and c.userIdWho=_userIdWho)) or
            (a.userIdCreated=_userIdWho and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=_iid and a.atomClassId=c.atomClassId and c.action=_action and (_actionFlag='' or find_in_set(a.atomFlag,_actionFlag)>0 ) and c.scope=0 and c.userIdWho=_userIdWho))
          )
    );

end
`,
  aCheckRightCreate: `
create procedure aCheckRightCreate (in _iid int,in _userIdWho int,in _atomClassId int)
begin

  select a.* from aAtomClass a
    inner join aViewUserRightAtomClass b on a.id=b.atomClassId
      where b.iid=_iid and b.atomClassId=_atomClassId and b.action=1 and b.userIdWho=_userIdWho;

end
`,
  aCheckRightFunction: `
create procedure aCheckRightFunction (in _iid int,in _userIdWho int,in _functionId int)
begin

  select a.* from aFunction a
    where a.deleted=0 and a.iid=_iid and a.id=_functionId
      and ( a.public=1 or
            exists(select c.functionId from aViewUserRightFunction c where c.iid=_iid and c.functionId=_functionId and c.userIdWho=_userIdWho)
          );

end
`,
  aSelectFunctions: `
create procedure aSelectFunctions (in __where text,in __orders text,in __limit text,in _iid int,in _userIdWho int,in _star int,in _locale varchar(50))
begin
  -- tables
  -- a: aFunction
  -- b: aFunctionLocale
  -- c: aViewUserRightFunction
  -- d: aFunctionStar
  -- e: aAtomClass

  declare _where,_orders,_limit text;
  declare _starField,_starJoin,_starWhere text;
  declare _localeField,_localeJoin,_localeWhere text;

  if __where<>'' then
    set _where=concat(__where,' AND');
  else
    set _where=' WHERE';
  end if;

  if __orders<>'' then
    set _orders=__orders;
  else
    set _orders='';
  end if;

  if __limit<>'' then
    set _limit=__limit;
  else
    set _limit='';
  end if;

  if _star<>0 then
    set _starField='';
    set _starJoin=' inner join aFunctionStar d on a.id=d.functionId';
    set _starWhere=concat(' and d.iid=',_iid,' and d.userId=',_userIdWho,' and d.star=1');
  else
    set _starField=concat(
        ',(select d.star from aFunctionStar d where d.iid=',_iid,' and d.functionId=a.id and d.userId=',_userIdWho,') as star'
      );
    set _starJoin='';
    set _starWhere='';
  end if;

  if _locale<>'\'\'\'\'' then
    set _localeField=',b.titleLocale';
    set _localeJoin=' inner join aFunctionLocale b on a.id=b.functionId';
    set _localeWhere=concat(' and b.iid=',_iid,' and b.locale=',_locale);
  else
    set _localeField='';
    set _localeJoin='';
    set _localeWhere='';
  end if;

  set @sql=concat(
    'select a.*,e.atomClassName,e.atomClassIdParent',_localeField,_starField,' from aFunction a',
    ' left join aAtomClass e on a.atomClassId=e.id',
    _localeJoin,
    _starJoin,
    _where,
    ' (',
    '  a.deleted=0 and a.iid=', _iid,
    _localeWhere,
    _starWhere,
    '    and ( a.public=1',
    '          or exists(select c.functionId from aViewUserRightFunction c where c.iid=',_iid,' and a.id=c.functionId and c.userIdWho=',_userIdWho,')',
    '        )',
    ' )',
    _orders,
    _limit
  );

  prepare stmt from @sql;
  execute stmt;
  deallocate prepare stmt;

end
`,
  aCheckFunctionLocales: `
create procedure aCheckFunctionLocales (in _iid int,in _locale varchar(50))
begin

  select a.* from aFunction a
    where a.iid=_iid and a.menu=1
      and not exists(
        select b.id from aFunctionLocale b
          where b.iid=_iid and b.locale=_locale and b.functionId=a.id
            and (b.titleLocale is not null and b.titleLocale<>'')
        );

end
`,
  aBuildRoles: `
create procedure aBuildRoles (in _iid int)
begin

  call aBuildRolesRemove(_iid);
  call aBuildRolesAdd(_iid,0);

end
`,
  aBuildRolesRemove: `
create procedure aBuildRolesRemove (in _iid int)
begin

  delete from aRoleRef where aRoleRef.iid=_iid;
  delete from aRoleIncRef where aRoleIncRef.iid=_iid;
  delete from aRoleExpand where aRoleExpand.iid=_iid;

end
`,
  aBuildRolesAdd: `
create procedure aBuildRolesAdd (in _iid int,in _roleIdParent int)
begin
  declare _done int default false;
  declare _id,_catalog int;
  declare _roleIds,_catalogs json;
  declare i,_roleCount int;
  declare _cur cursor for select a.id,a.catalog from aRole a where a.iid=_iid and a.roleIdParent=_roleIdParent;
  declare continue handler for not found set _done=true;

  SET @@session.max_sp_recursion_depth = 128;

  -- roleIds

  set _roleIds=json_array();
  set _catalogs=json_array();

  open _cur;

  set i=0;
  read_loop: loop
    fetch _cur into _id,_catalog;
    if _done then
        leave read_loop;
    end if;
    set _roleIds=json_set(_roleIds,concat('$[',i,']'),_id);
    set _catalogs=json_set(_catalogs,concat('$[',i,']'),_catalog);
    set i=i+1;
  end loop;

  close _cur;

  -- build roles

  set _roleCount=json_length(_roleIds);
  set i=0;
  while i<_roleCount do
    set _id=json_extract(_roleIds,concat('$[',i,']'));
    set _catalog=json_extract(_catalogs,concat('$[',i,']'));
    call aBuildRoleRef(_iid,_id);
    call aBuildRoleIncRef(_iid,_id);
    call aBuildRoleExpand(_iid,_id);
    if _catalog=1 then
      call aBuildRolesAdd(_iid,_id);
    end if;
    set i=i+1;
  end while;

end
`,
  aBuildRoleRef: `
create procedure aBuildRoleRef (in _iid int,in _roleId int)
begin
  declare _level,_roleIdParent int;

  set _level=0;
  set _roleIdParent=_roleId;

  while _level<>-1 do
    insert into aRoleRef(iid,roleId,roleIdParent,level)
      values(_iid,_roleId,_roleIdParent,_level);
    set _roleIdParent=(select a.roleIdParent from aRole a where a.iid=_iid and a.id=_roleIdParent);
    if _roleIdParent<>'' then
      set _level=_level+1;
    else
      set _level=-1;
    end if;
  end while;

end
`,
  aBuildRoleIncRef: `
create procedure aBuildRoleIncRef (in _iid int,in _roleId int)
begin

  insert into aRoleIncRef(iid,roleId,roleIdInc,roleIdSrc)
    select _iid,_roleId,a.roleIdInc,a.roleId from aRoleInc a
      where a.iid=_iid and a.roleId in (select b.roleIdParent from aRoleRef b where b.iid=_iid and b.roleId=_roleId);

end
`,
  aBuildRoleExpand: `
create procedure aBuildRoleExpand (in _iid int,in _roleId int)
begin

  insert into aRoleExpand(iid,roleId,roleIdBase)
    select a.iid,a.roleId,a.roleIdParent from aRoleRef a
      where a.iid=_iid and a.roleId=_roleId;

  insert into aRoleExpand(iid,roleId,roleIdBase)
    select a.iid,a.roleId,a.roleIdInc from aRoleIncRef a
      where a.iid=_iid and a.roleId=_roleId;

end
`,
};

module.exports = {
  tables,
  views,
  functions,
  procedures,
};
