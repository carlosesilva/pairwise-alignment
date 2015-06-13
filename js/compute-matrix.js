function computeMatrix (mode,sequence1,sequence2,matchScore,mismatchScore,gapPenalty) {
    // Get length of the sequences
    var m = sequence1.length;
    var n = sequence2.length;

    
    // Declare our 3d array of lengths m, n and 2. The third dimension will hold the value calculated and the traceback information at the position [Xi][Yj]
    var S = createArray(m+1,n+1,2);
    // HERE
    // var S = createArray(m+1,n+1);
    
    // set the first element trace-back information to -1 so the traceback function knows when to stop
    S[0][0] = [0,-1];
    // HERE
    // S[0][0] = {
    //     score: 0,
    //     traceback: [false, false, false, true]
    // };
    
    



    // Set initialGapPenalty depending on mode
    // var initialGapPenalty = gapPenalty ;
    if (mode === 'global'){
        for (var i = 1; i<=m;i++){
            S[i][0] = [(S[i-1][0][0] + gapPenalty), 1];
            // HERE
            // S[i][0] = {
            //     score: (S[i-1][0] + gapPenalty),
            //     traceback: [false, true, false, false] // vertical
            // }
        }
        for (var j = 1; j<=n;j++){
            S[0][j] = [(S[0][j-1][0] + gapPenalty), 2];
            // HERE
            // S[0][j] = {
            //     score: (S[0][j-1] + gapPenalty),
            //     traceback: [false, false, true, false] // horizontal
            // }
        }
    }
    // else {
    //     // semi and local stuff
    // }


    
    
    
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
            // find the max and its index
            var tempArr = [ (S[i-1][j-1][0] + similarityScore), (S[i-1][j][0] + gapPenalty), (S[i][j-1][0] + gapPenalty) ];
            // HERE
            // var tempArr = [ (S[i-1][j-1].score + similarityScore), (S[i-1][j].score + gapPenalty), (S[i][j-1].score + gapPenalty) ];
            
            // for local mode consider the value 0 as an option for the max function
            if (mode === 'local'){
                tempArr.push(0);
            }

            // find max element in array
            var max = tempArr[0];
            var maxIndex = 0;
            for (var k = 1; k < tempArr.length; k++) {
                if (tempArr[k] > max) {
                    maxIndex = k;
                    max = tempArr[k];
                }
            }
            // HERE
            // var max = Math.max.apply(null, tempArr);
            // gather traceback information
            var traceback = tempArr.map(function(elem) {
                return (max === elem);
            });

            // supplement a false for the traceback array for when the mode is not local
            if (mode !== 'local'){
                traceback[3] = false;
            }
            console.log(traceback);


            // set S[i][j] to the calculated max and the trace-back information
            S[i][j] = [max,maxIndex];
            // HERE
            // S[i][j] = {
            //     score: max,
            //     traceback: traceback
            // };
        }
    }
    return S;
}