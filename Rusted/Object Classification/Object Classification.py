# -*- coding: utf-8 -*-
"""
Created on 4/11/18

@author: Adel Beitvashahi
"""

from tempfile import mkdtemp
import os.path as path
import glob
import pickle
from PIL import Image
import numpy as np
from skimage.color import rgb2gray
from skimage.feature import (
    match_descriptors, corner_harris, corner_peaks, ORB, plot_matches)
from scipy.cluster.vq import *
from copy import *
import matplotlib.pyplot as plt
import matplotlib.colors
import random
from time import *
from scipy.spatial.distance import euclidean
from skimage import data
import operator

inittime = time()

# counts
featureCount = 400
kClusterCount = 200
# bool for saving images
saveImage = False
showImage = False

rewrite = True

# saves a dictionary to a text file for later use


def saveDict(d, s="file"):
    with open(s+'.txt', 'wb') as handle:
        pickle.dump(d, handle)

# returns a dictionary from a file


def loadDict(s='file'):
    with open(s+'.txt', 'rb') as handle:
        d = pickle.loads(handle.read())
    return d

# returns keypoints and descriptors from orb feature extraction


def getORB(img, kpn=200):
    # extract features
    descriptor_extractor = ORB(n_keypoints=kpn)
    # get the good stuff
    descriptor_extractor.detect_and_extract(img)
    keys = descriptor_extractor.keypoints
    # convert bool to nums
    descs = descriptor_extractor.descriptors*1.0

    return keys, descs

# get grayscale of image from its path


def getImage(imgPath):
    img = Image.open(imgPath).convert("RGB")
    img = np.array(img)
    img = rgb2gray(img)
    return img

# make Hisotgrams given code words frequency list


def makeHist():
    pass

# compare distance of the hist of a test image with the rest of the training set hists


def compareHists(qHist, allHists, realCat, algo, normalized):
    distances = []
    # get distance from test image to all training images
    for f in foldernames:
        allCount = len(orbFeatures[f])
        trainingCount = min(int(allCount*.7), 50)
        hists = allHists[f]
        for i in range(trainingCount):
            h = hists[i][0]
            if normalized:
                h = hists[i][1]
            # do euclidiean
            if algo == 'e':
                histDist = euclidean(qHist, h)

            # do hist intersection
            if algo == 'hi':
                minima = np.minimum(qHist, h)
                histDist = sum(minima)
            distances.append((histDist, str(f)))

    # sort by distance, min to max
    sortedDist = sorted(distances, key=lambda dist: dist[0])

    top5 = sortedDist[:5]
    top3 = sortedDist[:3]

    c5 = [0 for i in range(10)]
    c3 = [0 for i in range(10)]

    for d, cat in top5:
        i = foldernames.index(cat)
        c5[i] += 1

    for d, cat in top3:
        i = foldernames.index(cat)
        c3[i] += 1

    k3 = (top3[argmax(c3)][1] == realCat)*1
    k5 = (top5[argmax(c5)][1] == realCat)*1

    # return lowest 3 and lowest 5 distances
    return k3, k5


inittime = time() - inittime
print 'took ' + str(inittime) + ' secs to pre initialize everything'
inittime = time()

# get all foldernames
foldernames = ['airplanes', 'camera', 'chair', 'crab', 'crocodile',
               'elephant', 'headphone', 'pizza', 'soccer_ball', 'starfish']
# save images, must convert them for later use
images = {}
imageScores = {}
# load all the images into a dictionary
for fname in foldernames:
    imgs = glob.glob("objects\\"+fname+"\*.jpg")
    if fname == 'airplanes':
        imgs = imgs[:90]
    for i in imgs:
        imageScores[i] = 0
    images[fname] = imgs

inittime = time() - inittime
print 'took ' + str(inittime) + ' secs to initialize everything'

orbFeatures = {}
orbKeypoints = {}

print '----------------------- starting part1 --------------------------------'

orbtime = time()
part1total = time()

# get all the features and keypoints for all images
for cat in images:
    orbFeatures[cat] = []
    orbKeypoints[cat] = []
    for path in images[cat]:
        image = getImage(path)
        keypoints, features = getORB(image, featureCount)
        orbFeatures[cat] += [features]
        orbKeypoints[cat] += [keypoints]

orbtime = time() - orbtime
print 'got orb features in: ' + str(orbtime) + ' secs '

# gather training data, put all in 1 array
trainingSet = {}
training = []

kmeanstime = time()

# go through categories
for f in foldernames:
    allCount = len(orbFeatures[f])
    # get a training set of 50 or less
    count = min(int(allCount*.7), 1)
    for i in range(count):
        training.append(orbFeatures[f][i])
# concatenate all features from training
trainingSet = np.concatenate(training, axis=0)
# get the cluster centers (centroids for training set or curr category)
centroids, variance = kmeans(trainingSet, kClusterCount)

kmeanstime = time() - kmeanstime

print 'got kmeans centroids for training data in: ' + str(kmeanstime) + ' secs '

# check for precomputed histograms on disk, if not there, compute them
if rewrite:
    # make a dictionary to store histogram arrays for each image
    histograms = {}

    vqtime = 0
    histtime = 0
    t1 = 0
    vqhisttime = time()
    missedrange = 0

    # make histograms for each image
    for f in foldernames:
        count = len(orbFeatures[f])
        histograms[f] = []
        for i in range(count):

            t1 = time()
            codewords = vq(orbFeatures[f][i], centroids)[0]
            t1 = time() - t1
            vqtime += t1

            t1 = time()
            # get histograms (bag of words)
            hist, bins, patches = plt.hist(codewords, bins=200)
            t1 = time() - t1
            histtime += t1
            hlen = len(hist)

            if hlen < 200:
                missedrange += 1
                hist += [0 for i in range(200-hlen)]

            # store histogram for this picture
            histograms[f].append([hist, hist/np.sum(hist)])

    vqhisttime = time() - vqhisttime
    print 'got vq in: ' + str(vqtime) + ' secs '
    print 'got hists in: ' + str(histtime) + ' secs '
    print 'got vq and hists in: ' + str(vqhisttime) + ' secs '
    print 'had ' + str(missedrange) + ' missed ranges'

    # save all histograms to a txt file
    saveDict(histograms, 'histograms')
else:
    histograms = loadDict('histograms')

t1 = time()
comp1time = 0

# find top 5 or 3 matches
for f in foldernames:
    # find test images and cross compare their his dists
    allCount = len(orbFeatures[f])
    # only do max of 50 training images
    trainingCount = min(int(allCount*.7), 50)
    # only do 21 or less test images
    testCount = min(int(allCount-trainingCount), 21)
    hist = histograms[f]
    # k3, k5 counter, not normal, then normal
    counter = [(0, 0), (0, 0), (0, 0), (0, 0)]
    totalCounter = 0
    for i in range(trainingCount, allCount-testCount):
        # euclidean
        # not normalized
        testImage = histograms[f][i][0]

        t1 = time()

        k3, k5 = compareHists(testImage, histograms, f, 'e', False)

        t1 = time() - t1
        comp1time += t1

        counter[0][0] += k3
        counter[0][1] += k5
        # normalized
        testImage = histograms[f][i][1]

        t1 = time()

        k3, k5 = compareHists(testImage, histograms, f, 'e', True)

        t1 = time() - t1
        comp1time += t1

        counter[1][0] += k3
        counter[1][1] += k5

        # histogram intersection
        # not normalized
        testImage = histograms[f][i][0]

        t1 = time()

        k3, k5 = compareHists(testImage, histograms, f, 'hi', False)

        t1 = time() - t1
        comp1time += t1

        counter[2][0] += k3
        counter[2][1] += k5
        # normalized
        testImage = histograms[f][i][1]

        t1 = time()

        k3, k5 = compareHists(testImage, histograms, f, 'hi', True)

        t1 = time() - t1
        comp1time += t1

        counter[3][0] += k3
        counter[3][1] += k5

    print '----- euclidean distance results'
    print '--- not normalized'
    print f + ', k = 3, ' + counter[0][0] + "/" + totalCounter + '=' + counter[0][0]/totalCounter
    print f + ', k = 5, ' + counter[0][1] + "/" + totalCounter + '=' + counter[0][1]/totalCounter
    print '--- normalized'
    print f + ', k = 3, ' + counter[1][0] + "/" + totalCounter + '=' + counter[1][0]/totalCounter
    print f + ', k = 5, ' + counter[1][1] + "/" + totalCounter + '=' + counter[1][1]/totalCounter
    print ' '
    print '----- histogram intersection distance results'
    print '--- not normalized'
    print f + ', k = 3, ' + counter[2][0] + "/" + totalCounter + '=' + counter[2][0]/totalCounter
    print f + ', k = 5, ' + counter[2][1] + "/" + totalCounter + '=' + counter[2][1]/totalCounter
    print '--- normalized'
    print f + ', k = 3, ' + counter[3][0] + "/" + totalCounter + '=' + counter[3][0]/totalCounter
    print f + ', k = 5, ' + counter[3][1] + "/" + totalCounter + '=' + counter[3][1]/totalCounter

part1total = time() - part1total
print 'got comparison1 done in: ' + str(comp1time) + ' secs '
print '---------------------part 1 total time: ' + str(part1total) + ' secs -------------------------------'

# part 2
# counts
featureCount = 400
kClusterCount = 2000

orbFeatures = {}
orbKeypoints = {}

print '----------------------- starting part 2 ------------------------'
part2total = time()

# get all the features and keypoints for all images
for cat in images:
    orbFeatures[cat] = []
    orbKeypoints[cat] = []
    for path in images[cat]:
        image = getImage(path)
        keypoints, features = getORB(image, featureCount)
        orbFeatures[cat] += [features]
        orbKeypoints[cat] += [keypoints]

# gather training data, put all in 1 array
trainingSet = {}
training = []

kmeanstime = time()

# go through categories
for f in foldernames:
    allCount = len(orbFeatures[f])
    # get a training set of 50 or less
    count = min(int(allCount*.7), 1)
    for i in range(count):
        training.append(orbFeatures[f][i])
# concatenate all features from training
trainingSet = np.concatenate(training, axis=0)
# get the cluster centers (centroids for training set or curr category)
centroids, variance = kmeans(trainingSet, kClusterCount)

kmeanstime = time() - kmeanstime
print 'got kmeans done in: ' + str(kmeanstime) + ' secs '

# check for precomputed histograms on disk, if not there, compute them
if rewrite:
    # make a dictionary to store histogram arrays for each image
    histograms = {}

    vqtime = 0
    histtime = 0
    t1 = 0
    vqhisttime = time()
    missedrange = 0

    # make histograms for each image
    for f in foldernames:
        count = len(orbFeatures[f])
        histograms[f] = []
        for i in range(count):

            t1 = time()

            codewords = vq(orbFeatures[f][i], centroids)[0]

            t1 = time() - t1
            vqtime += t1
            t1 = time()

            # get histograms (bag of words)
            hist, bins, patches = plt.hist(codewords, bins=2000)

            t1 = time() - t1
            histtime += t1

            hlen = len(hist)

            if hlen < 2000:
                missedrange += 1
                hist += [0 for i in range(2000-hlen)]

            # store histogram for this picture
            histograms[f].append(hist/np.sum(hist))

    vqhisttime = time() - vqhisttime
    print 'got vq in: ' + str(vqtime) + ' secs '
    print 'got hists in: ' + str(histtime) + ' secs '
    print 'got vq and hists in: ' + str(vqhisttime) + ' secs '
    print 'had ' + str(missedrange) + ' missed ranges'

    # save all histograms to a txt file
    saveDict(histograms, 'histograms2')
else:
    histograms = loadDict('histograms')

# make the inverted file index histogram
IFI = {}

ifitime = time()

# go through all histograms to populate inverted file index hist
for k in range(kClusterCount):
    # each element in IFI is a list
    IFI[k] = []
    # go through all images
    # if their histogram[k] is bigger than 0, add their name to IFI[k]
    for f in images:
        count = len(histograms[f])
        for i in range(count):
            imgname = str(f) + ',' + str(i)
            currHist = histograms[f][i]
            if currHist[k] > 0:
                IFI[k] += [imgname]

ifitime = time() - ifitime

print 'made inverted file index in: ' + str(ifitime) + ' secs '

top10 = {}

comp2time = time()
t1 = 0
sortingtime = 0

# go through all test images
for f in foldernames:
    # imageScores
    scores = deepcopy(imageScores)
    allCount = len(histograms[f])
    queryHist = histograms[f][0]
    # go through hist entries for query image
    # compare with IFI
    for i in range(kClusterCount):
        if queryHist[i] > 0:
            # get list of names in this hist entry
            imgNameList = IFI[i]
            for imgName in imgNameList:
                # get the category and image name index of current img name in current
                # IFI hist entry
                cat, imgIndex = imgName.split(',')
                # increase score of image of category cat and index imgIndex
                scores[images[cat][imgIndex]] += 1

    t1 = time()
    # get top ten imagescores sorted by value, max to min
    sorted_scores = sorted(scores.items(), key=operator.itemgetter(1))[
        ::-1][:10]

    t1 = time() - t1
    sortingtime += t1

    top10[f] = sorted_scores

comp2time = time() - comp2time
part2total = time() - part2total
print 'got comparison2 done in: ' + str(comp2time) + ' secs '
print 'sorting for comp2 took: ' + str(sortingtime) + ' secs '
comp2time = comp2time - sortingtime
print 'comp2 minus sorting took: ' + str(comp2time) + ' secs '
print '---------------------part 2 total time: ' + str(part2total) + ' secs -------------------------------'

# print all stuff to text file
with open("test.txt", "w") as text_file:
    for cat in top10:
        for lst in top10[cat]:
            [text_file.write("%s," % i) for i in lst]
            text_file.write("\n")
        text_file.write("---\n")
