function computeGlobal (mode,sequence1,sequence2,matchScore,mismatchScore,gapPenalty) {
    // Get length of the sequences
    var m = sequence1.length;
    var n = sequence2.length;
    
    // Set initialGapPenalty depending on mode
    var initialGapPenalty = gapPenalty ;
    if (mode !== 'global'){
        initialGapPenalty = 0;
    } 

    
    // Declare our 3d array of lengths m, n and 2. The third dimension will hold the value calculated and the traceback information at the position [Xi][Yj]
    var S = createArray(m+1,n+1,2);
    
    
    // set the first element trace-back information to -1 so the traceback function knows when to stop
    S[0][0] = [0,-1];
    
    
    
    // initialize the first row and the first column with the given initialGapPenalty
    for (var i = 1; i<m+1;i++){
        S[i][0] = [(S[i-1][0][0] + initialGapPenalty), 1];
        //alert(S[i][0]);
    }
    for (var j = 1; j<n+1;j++){
        S[0][j] = [(S[0][j-1][0] + initialGapPenalty), 2];
        //alert(S[0][j]);
        
    }
    
    
    
    
    // initialize score which will hold the score s(xi,yj)
    var score = 0;
    
    // loop through the whole matrix and set the optimal score values
    for (var i = 1; i<m+1;i++){
        for (var j = 1; j<n+1;j++){
            
            // compare s(xi,yj)
            if (sequence1[i-1] === sequence2[j-1]){
                score = matchScore;
            }else{
                score = mismatchScore;
            }
            
            // get value of the 3 options and put it into a tempArr
            // find the max and its index
            var tempArr = [ (S[i-1][j-1][0] + score), (S[i-1][j][0] + gapPenalty), (S[i][j-1][0] + gapPenalty) ];
            if (mode === 'local'){
                tempArr.push(0);
            }
            var max = tempArr[0];
            var maxIndex = 0;
            for (var k = 1; k < tempArr.length; k++) {
                if (tempArr[k] > max) {
                    maxIndex = k;
                    max = tempArr[k];
                }
            }
            
            // set S[i][j] to the calculated max and the trace-back information
            S[i][j] = [max,maxIndex];
        }
    }
    return S;
}