drop table if exists foodcollection;
create table foodcollection(
	userid int not null,
	name varchar(255),
	lon double,
	lat double
);

drop table if exists gascollection;
create table gascollection(
	userid int not null,
	name varchar(255),
	lon double,
	lat double
);

drop table if exists sensordata;
create table sensordata(
	userid int not null,
	time long,
	lon double,
	lat double,
	status int
);

