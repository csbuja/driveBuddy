#inputs for the first 3 methods are:
#F1 =['indian', 'coffee']
# F2 = ['coffee']
# Fj = [F1]
# rates = [3]
def sqrt(n):
	return float(n)**.5

#method 1
def cos_sim(F1,F2,rate_j):
	s1 = set(F1)
	s2 = set(F2)
	return float(len(s1.intersection(s2))) / (sqrt(len(F1))*sqrt(len(F2)))

#method 2
def jaccard_sim(F1,F2,rate_j):
	s1 = set(F1)
	s2 = set(F2)
	return float(len(s1.intersection(s2)))/len(s1.union(s2))

def similarity_func(F1,F2,rate_j,simtype):
	if simtype == 'cos_sim':
		return cos_sim(F1,F2,rate_j)
	elif simtype == 'jaccard_sim':
		return jaccard_sim(F1,F2,rate_j)
	else:
		raise ValueError('Wrong simtype.')

#Fj is array of array of string, Fi is array of string, rate_j is array of float
def rate_i(Fj,Fi,rates,simtype):
	numerator =  0.0
	denomenator = 0.0
	if (simtype == 'cos_sim' or simtype == 'jaccard_sim') and len(rates) == len(Fj) :
		i=0
		for val in Fj:
			simvalue = similarity_func(val,Fi,i,simtype)
			numerator += (simvalue*rates[i])
			denomenator+=simvalue
			i+=1
		return numerator/denomenator #floats
	else:
		raise ValueError('Wrong simtype or bad lengths of Fj and rates')

#tests
# F1 =['indian', 'coffee']
# F2 = ['coffee']
# Fj = [F1]
# rates = [3]
# print rate_i(Fj,F2,rates,'jaccard_sim')
# print rate_i(Fj,F2,rates,'cos_sim')




