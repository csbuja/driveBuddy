import csv
with open('data.csv', 'rb') as csvfile:
	spamreader = csv.reader(csvfile, delimiter=',')
	first = 0
	for row in spamreader:
		if first == 0:
			first = 1
		else:
			for i in range(1,4):
				if row[i] != "":
					print "insert into rate values(" + str(i) +",'" + row[0] + "'," + row[i] + ');'
