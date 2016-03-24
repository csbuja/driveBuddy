import sys, os 
from scipy.sparse import csr_matrix
sys.path.append(os.path.realpath('..'))

from ItemBasedFiltering_Utilities import *

def test_sim_restaurant1andrestaurant2():
	M = csr_matrix((2,2))
	M[0,0] = 2.0
	M[0,1] = 5.0
	M[1,0] = 3.0
	assert(sim(M,0,1)==-1) 

def test_restaurant2andrestaurant2():
	M = csr_matrix((2,2))
	M[0,0] = 2.0
	M[0,1] = 5.0
	M[1,0] = 3.0
	assert(sim(M,1,1)==1)

def test_restaurant1andrestaurant1():
	M = csr_matrix((2,2))
	M[0,0] = 2.0
	M[0,1] = 5.0
	M[1,0] = 3.0
	assert(sim(M,0,0)==1)

# def test_pred_user1restaurant2():
# 	M = csr_matrix((2,2))
# 	M[0,0] = 2.0
# 	M[0,1] = 5.0
# 	M[1,0] = 3.0
# 	assert(pred(M,1,1)==1) #TODO : not right syntax, specifically I need to build a list of similarity calculations

