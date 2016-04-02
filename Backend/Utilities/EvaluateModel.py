import numpy as np
from scipy.sparse import lil_matrix,csr_matrix

def importDataFromCSV(ground_truth_filename,trainingdata_filename):
    trainingData= None
    testData = None
    shape_0_training=0
    shape_1_training = 0
    shape_0_testing =0
    shape_1_testing = 3
    with open(trainingdata_filename) as f:
        i = 0
        for line in f:
            if ~i:
                shape_1_training = len(line.split(','))
                i=1
            else:
                shape_0_training +=1
    shape_0_testing = shape_0_training

    trainingData = lil_matrix((shape_0_training,shape_1_training))
    testData = lil_matrix(shape_0_testing,shape_0_testing))).todense()
    #skip the first line in both of these
    with open(trainingdata_filename) as f:
        i = 0
        for line in f:
            if ~i:
                i=1
            else:
                row = line.split(',')
    with open(ground_truth_filename) as f:
        i = 0
        for line in f:
            if ~i:
                i=1
            else:
                row = line.split(',')





if __name__ == "__main__":
        importDataFromCSV('../Datasets/ground_truth.csv')