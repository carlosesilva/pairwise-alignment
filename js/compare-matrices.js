function compareMatrices (m1, m2) {
    var feedbackMatrix = createArray(m1.length, m2.length);

    for (var i = 0; i < m1.length; i++) {
        for (var j = 0; j < m1[i].length; j++) {
            feedbackMatrix[i][j] =  {
                score: m1[i][j].score === m2[i][j].score,
                traceback: m1[i][j].traceback.join('').slice(1) === m2[i][j].traceback.join('').slice(1)
            };
        }
    }
    return feedbackMatrix;
}