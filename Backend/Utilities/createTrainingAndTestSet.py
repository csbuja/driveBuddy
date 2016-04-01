import random as r
import numpy as np 
import sys

#modifies: nothing
def transform_index_to_matrix_index(i,mat):
	shape = mat.shape
	col = i % shape[1]


if __name__ == "__main__":
	RANDOM_SEED = 2
	from numpy import genfromtxt
	filename_data = 'recommenderdata.csv'
	trainingdatafile = filename_data[:-3] +'_trainingdata' + '.csv' #output a csv
	testdatafile = filename_data[:-3] +'_testdata' + '.csv' #output x,y pairs
	ground_truth_testfile = 'ground_truth.csv' #output x,y,true value

	my_data = genfromtxt('../Datasets/'+filename_data, delimiter=',')
	my_data = my_data[1:]
	my_data = np.matrix(my_data)
	my_data = my_data[:,2:]

	np.random.seed(RANDOM_SEED)
	r.seed(RANDOM_SEED)
	number_of_nonnans = np.count_nonzero(~np.isnan(my_data))
	fraction_TRAINDATA = 0.7
	NUMBER_TRAINDATA = int(number_of_nonnans * fraction_TRAINDATA)
	NUMBER_TESTDATA = number_of_nonnans - NUMBER_TRAINDATA
    SAMPLE_INDICES = np.random.choice(my_data.shape[0]*my_data.shape[1] -1, size=(my_data.shape[0]*my_data.shape[1]), replace=False, p=None) #same without replacement

	output_matrix = [np.nan]*my_data.shape[1]]*my_data.shape[0]
	number_of_values_in_trainingdata = 0
	i = 0
	while number_of_values_in_trainingdata < NUMBER_TRAINDATA:
		sample_index = SAMPLE_INDICES[i]
		sample_value = 
		i+=1 #guaranteeed to reach number training data
		number_of_values_in_trainingdata +=1





