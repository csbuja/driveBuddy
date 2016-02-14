drop foodcollection if exist;
create table foodcollection(
	userid int not null,
	name varchar(255),
	lon double,
	lat double
);

drop gascollection if exist;
create table gascollection(
	userid int not null,
	name varchar(255),
	lon double,
	lat double
);

drop sensordata if exist;
create table sensordata(
	userid int not null,
	time long,
	temperature double,
	lon double,
	lat double,
	status int
);