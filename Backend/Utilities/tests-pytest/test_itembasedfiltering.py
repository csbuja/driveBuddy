import sys, os 
from scipy.sparse import csr_matrix
import numpy as np
sys.path.append(os.path.realpath('..'))

from ItemBasedFiltering_Utilities import *

#Notes:
#1.
#Below is matrix for Test Cases 1 - 4
# Users#R1#R2
# U1   #2 #5
# U2   #3 #0
#2.




#Test Case 1
def test_sim_restaurant1andrestaurant2():
	M = csr_matrix((2,2))
	M[0,0] = 2.0
	M[0,1] = 5.0
	M[1,0] = 3.0
	assert(sim(M,0,1)==-1) 

#Test Case 2
def test_restaurant2andrestaurant2():
	M = csr_matrix((2,2))
	M[0,0] = 2.0
	M[0,1] = 5.0
	M[1,0] = 3.0
	assert(sim(M,1,1)==1)

#Test Case 3
def test_restaurant1andrestaurant1():
	M = csr_matrix((2,2))
	M[0,0] = 2.0
	M[0,1] = 5.0
	M[1,0] = 3.0
	assert(sim(M,0,0)==1)

#Test Case 4
def test_pred_user2restaurant2():
	M = csr_matrix((2,2))
	M[0,0] = 2.0
	M[0,1] = 5.0
	M[1,0] = 3.0
	Ruj = np.array([3])
	SIMij = np.array([sim(M,0,1)]) #just [-1] by Test Case 1

	assert(pred(Ruj,SIMij)==3)

