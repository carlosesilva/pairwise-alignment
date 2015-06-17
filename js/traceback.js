// Function traceback()
function traceback(mode,matrix,sequence1,sequence2){

    // global: Traceback starts at last cell, travels back to first cell
    // semi: Traceback starts at max of last column or row. Stop traceback when reaching first row or column
    // local: Tracebacks starts at cell containing the maximum value (any cell). Traceback ends when first zero is reached.



    // initialize variables
    var i, j, current,
    tracedCells = [],
    alignment1 = [],
    alignment2 = [];


    // Extract matrix dimensions
    var m = matrix.length;
    var n = matrix[0].length;



    // Pick element to start from
    if (mode === "global"){
        i = m-1;
        j = n-1;
        current = matrix[i][j];
        tracedCells.push({i: i,j: j});
    } else if (mode === "semi"){
        // find max element from last row or last column
        var max = {
            i: m-1,
            j: n-1,
            score: matrix[m-1][n-1].score
        };
        for (var i = 0; i < m; i++) {
            if (max.score < matrix[i][n-1].score){
                max.score = matrix[i][n-1].score;
                max.i = i;
                max.j = n-1;
            }
        }
        for (var j = 0; j < n; j++) {
            if (max.score < matrix[m-1][j].score){
                max.score = matrix[m-1][j].score;
                max.i = m-1;
                max.j = j;
            }
        }
        // Add gaps to end if needed
        if (max.i < m-1){
            for (var k = m - 1; k > max.i; k--) {
                tracedCells.push({i:k,j:n-1});
                alignment1.unshift(sequence1[k-1]);
                alignment2.unshift('-');
            }
        } else if (max.j < n-1){
            for (var k = n - 1; k > max.j; k--) {
                tracedCells.push({i:m-1,j:k});
                alignment1.unshift('-');
                alignment2.unshift(sequence2[k-1]);
            }
        }
        // Set starting point cell (current) to the max value found and update our iterators i and j
        current = matrix[max.i][max.j];
        tracedCells.push({i: max.i,j: max.j});
        i = max.i;
        j = max.j;
    } else {
        // find max element overall
        var max = {
            i: m-1,
            j: n-1,
            score: matrix[m-1][n-1].score
        };
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                if (max.score < matrix[i][j].score){
                    max.score = matrix[i][j].score;
                    max.i = i;
                    max.j = j;
                }
            }
        }
        current = matrix[max.i][max.j];
        tracedCells.push({i: max.i,j: max.j});
        i = max.i;
        j = max.j;
    }


    // current.traceback is an array with 4 elements
    // Elements are booleans. It is expected that atleast one is true
    // current.traceback[0] when set to true represents end of path
    while(!current.traceback[0]){
        if (current.traceback[3]){
            // [0] represents diagonal path next is S[i-1][j-1]
            // update i and j and current
            i--;
            j--;
            current = matrix[i][j];
            tracedCells.push({i: i,j: j});
            alignment1.unshift(sequence1[i]);
            alignment2.unshift(sequence2[j]);
        } else if (current.traceback[2]){
            // [1] represents vertical path next is S[i-1][j]
            // update i and current
            i--;
            current = matrix[i][j];
            tracedCells.push({i: i,j: j});
            alignment1.unshift(sequence1[i]);
            alignment2.unshift('-');
        } else if (current.traceback[1]){
            // [2] represents horizontal path next is S[i][j-1]
            // update j and current
            j--;
            current = matrix[i][j];
            tracedCells.push({i: i,j: j});
            alignment1.unshift('-');
            alignment2.unshift(sequence2[j]);
        }
    }
    // We've reached a traceback with no path, lets end the traceback function
    // most likely we will use "return" here

    return {
        tracedCells: tracedCells,
        alignment: [alignment1, alignment2]
    };
    
    
}


function printTraceback (traceback,matrixTable,alignmentContainer) {
    var matchMismatch = [];

    // Loop through tracedCells and updated matrixTable and alignmentContainer
    for (var k = 0; k < traceback.tracedCells.length; k++) {
        // Add traced class to matrixTable cells that are part of alignment
        matrixTable.find('tr').eq(traceback.tracedCells[k].i).find('td').eq(traceback.tracedCells[k].j).find('.dynamicProgrammingMatrixCell').addClass('traced');

        // Construct matchMismatch which holds the visual representation between both sequences in the alignment (e.g. X for mismatch, | for matches, &nbsp; for gap)
        if (traceback.alignment[0][k] === '-' || traceback.alignment[1][k] === '-'){
            matchMismatch.push('&nbsp;');
        } else if (traceback.alignment[0][k] === traceback.alignment[1][k]){
            matchMismatch.push('|');
        } else{
            matchMismatch.push('X');
        }
    }

    // The above loop gives matchMismatch an extra undesired character (runs one time too long) so we will remove it with .pop()
    matchMismatch.pop();

    // display alignment
    alignmentContainer.html( traceback.alignment[0].join('') + '<br>' + matchMismatch.join('') + '<br>' + traceback.alignment[1].join('') );
}