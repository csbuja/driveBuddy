drop table if exists sensordata;
drop table if exists user_res;
drop table if exists restaurant;
drop table if exists user;
drop table if exists survey;
create table user(
	userid int not null primary key
);

create table survey(
	userid int not null,
	restaurant_id varchar(255) not null,
	name varchar(255),
	foodtype varchar(255) not null,
	cost int,
	rate double not null,
	primary key (userid, restaurant_id),
	foreign key (userid) references user(userid)
);

create table restaurant(
	restaurant_id varchar(255) not null  primary key,
	name varchar(255),
	foodtype varchar(255) not null,
	cost int,
	rate double not null
);

create table user_res(
	userid int not null,
	restaurant_id varchar(255) not null,
	time timestamp DEFAULT CURRENT_TIMESTAMP,
	primary key (userid, time),
	foreign key (userid) references user(userid),
	foreign key (restaurant_id) references restaurant(restaurant_id)
);

create table sensordata(
	userid int not null,
	lon double,
	lat double,
	status int,
	time timestamp DEFAULT CURRENT_TIMESTAMP,
	primary key (userid, time),
	foreign key (userid) references user(userid)
	
);

#insert into user (userid) values (0);
#insert an root user with userid 0;