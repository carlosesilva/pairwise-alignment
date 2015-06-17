function computeMatrix (mode,sequence1,sequence2,matchScore,mismatchScore,gapPenalty) {
    // Get length of the sequences
    var m = sequence1.length;
    var n = sequence2.length;

    
    // Declare our 3d array of lengths m, n and 2. The third dimension will hold the value calculated and the traceback information at the position [Xi][Yj]
    // var S = createArray(m+1,n+1,2);
    // HERE
    var S = createArray(m+1,n+1);
    
    // Set the first element trace-back information to -1 so the traceback function knows when to stop
    S[0][0] = {
        score: 0,
        traceback: [1, 0, 0, 0]
    };



    // Initialize first column and first row
    if (mode === 'global'){
        for (var i = 1; i<=m;i++){
            S[i][0] = {
                score: S[i-1][0].score + gapPenalty,
                traceback: [0, 0, 1, 0] // vertical
            };
        }
        for (var j = 1; j<=n;j++){
            S[0][j] = {
                score: S[0][j-1].score + gapPenalty,
                traceback: [0, 1, 0, 0] // horizontal
            };
        }
    }
    else if (mode === 'semi'){
        // semi stuff
        for (var i = 1; i<=m;i++){
            S[i][0] = {
                score: 0,
                traceback: [0, 0, 1, 0] // vertical
            };
        }
        for (var j = 1; j<=n;j++){
            S[0][j] = {
                score: 0,
                traceback: [0, 1, 0, 0] // horizontal
            };
        }
    }
    else if (mode === 'local'){
        // local stuff
        for (var i = 1; i<=m; i++){
            S[i][0] = {
                score: 0,
                traceback: [1, 0, 0, 0]
            };
        }
        for (var j = 1; j<=n; j++){
            S[0][j] = {
                score: 0,
                traceback: [1, 0, 0, 0]
            };
        }
    }


    
    
    
    // initialize similarityScore which will hold the similarity score s(xi,yj)
    var similarityScore = 0;
    
    // loop through the whole matrix and set the optimal score values
    for (var i = 1; i<m+1;i++){
        for (var j = 1; j<n+1;j++){
            
            // compare s(xi,yj)
            if (sequence1[i-1] === sequence2[j-1]){
                similarityScore = matchScore;
            }else{
                similarityScore = mismatchScore;
            }
            
            // get value of the 3 options and put it into a tempArr
            var tempArr = [(S[i][j-1].score + gapPenalty), (S[i-1][j].score + gapPenalty), (S[i-1][j-1].score + similarityScore)];
            
            // for local mode consider the value 0 as an option for the max function
            if (mode === 'local'){
                tempArr.unshift(0);
            }

            // find max element in array
            var max = Math.max.apply(null, tempArr);

            // gather traceback information
            var traceback = tempArr.map(function(elem) {
                return (max === elem);
            });

            // supplement the fourth entry for the traceback array for when the mode is not local
            if (mode !== 'local'){
                traceback.unshift(0);
            }

            // set S[i][j] calculated max score and traceback information
            S[i][j] = {
                score: max,
                traceback: traceback
            };
        }
    }
    return S;
}