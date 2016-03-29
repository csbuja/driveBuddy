import sys,os
sys.path.append(os.path.realpath('./Utilities'))
from scipy.sparse import csr_matrix, lil_matrix
from ItemBasedFiltering_Utilities import *

if len(sys.argv) == 2:
 	data_filename = sys.argv[1] # first argument


 	M = lil_matrix((2,2))  # Done to rmeove the sparse efficiency warning if we only use csr matrix
	M[0,0] = 2.0
	M[0,1] = 5.0
	M[1,0] = 3.0
	M = csr_matrix(M)
	Ruj = np.array([3])
	SIMij = np.array([sim(M,0,1)]) #just [-1] by Test Case 1
	print pred(Ruj,SIMij)

