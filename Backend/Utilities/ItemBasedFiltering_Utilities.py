import numpy as np
from collections import Counter
#TODO: DELETE THE IMPORT OF CSR_MATRIX NOT NEEDED
from scipy.sparse import csr_matrix
# Prediction function from Lecture 15 IBFNN - Returns a ranking score!
#Inputs: 
#1. numpy array Ruj, size of number of rated items
#2. numpy array SIMij = similarity(i,j), size of number of rated items
# 
# Note:This includes the corner case if i==j because if we rated i high, then we have a high prediction score
#
def pred(Ruj,SIMij):
    if len(Ruj) == 0:
        return float("-inf")
    return float(np.dot(Ruj,SIMij)/( np.dot(SIMij,np.ones(SIMij.shape)) ))

#Similarity function from Lecture 15 for IBFNN
#Inputs:
#1. R - a scipy.CSR sparse np matrix - rows are users - columns (i and j for restaurants)
#2. i,j are integer indices for the rows of AR
#Notes:
#M is number of Rows
# N is the number of columns
#
#ASSUME: no zero ratings in R
def sim(R,i,j):
    M,N = R.shape
    meanvalues = R.sum(1)
    number_of_non_zeros_per_row = np.zeros(R.sum(1).shape)

    nonzero = R.nonzero()
    for val in nonzero[0]:
        number_of_non_zeros_per_row[val][0] +=1

    #will get /0 runtimewarning but it doesn't matter by assumption that no zero ratings
    meanvalues = meanvalues/number_of_non_zeros_per_row #  FOR OPTIMIZATION , MOVE THIS OUTO F THIS FUNCTION 
    #each row is the average rating per user

    

    Rated = Counter()
    rows = nonzero[0]
    cols = nonzero[1]
    for row,col in zip(rows,cols):
        if col == i or col == j:
            if i ==j:
                Rated[row] +=2# same restaurant
            else:
                Rated[row] +=1 # the user has rated one of the restaurants

    RatedByBoth = []
    for key in Rated:
        if Rated[key] == 2:
            RatedByBoth.append(key)
    Ri = R[:,i][RatedByBoth].todense()
    Rj = R[:,j][RatedByBoth].todense()
    RAbar = meanvalues[RatedByBoth]
    RAbar = np.array(RAbar).T[0]
    Ri = np.array(Ri).T[0]
    Rj = np.array(Rj).T[0]
    
    return float(np.dot(Ri-RAbar,Rj-RAbar))/ (float(np.sqrt(np.dot(Ri-RAbar,Ri-RAbar) )) * float(np.sqrt(np.dot(Rj-RAbar,Rj-RAbar))))


# M = csr_matrix((2,2))
# M[0,0] = 2.0
# M[0,1] = 5.0
# M[1,0] = 3.0 
# print sim(M,0,0)
