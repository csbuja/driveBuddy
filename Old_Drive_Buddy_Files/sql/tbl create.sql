drop table if exists user;
create table user(
	userid int not null,
	primary key(userid)
);

drop table if exists resturant;
create table resturant(
	resturant_id int not null,
	name varchar(255),
	foodtype int not null,
	cost int not null,
	rate double not null
	primary key(resturant_id)
);

drop table if exists user_res;
create table user_res(
	userid int not null,
	resturant_id int not null,
	time timestamp,
	primary key (userid, resturant_id),
	foreign key userid references user,
	foreign key resturant_id references resturant
);

drop table if exists sensordata;
create table sensordata(
	userid int not null,
	time timestamp,
	lon double,
	lat double,
	status int,
	primary key (userid, timestamp),
	foreign key userid references user
);

