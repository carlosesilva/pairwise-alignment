

// Function traceback()
function traceback(mode,matrix,sequence1,sequence2){

    // global: Traceback starts at last cell, travels back to first cell
    // semi: Traceback starts at max of last column or row. Stop traceback when reaching first row or column
    // local: Tracebacks starts at cell containing the maximum value (any cell). Traceback ends when first zero is reached.



    // initialize variables
    var i, j, current, max2,
    startingPoints = [],
    results = [];


    // Extract matrix dimensions
    var m = matrix.length;
    var n = matrix[0].length;



    // Pick element to start from
    if (mode === "global"){
        startingPoints.push({
            i: m-1,
            j: n-1,
            tracedCells: [{i: m-1,j: n-1}],
            alignment1: [],
            alignment2: []
        });
    } else if (mode === "semi"){
        // find max element from last row or last column
        var max = {
            i: m-1,
            j: n-1,
            score: matrix[m-1][n-1].score
        };

        // find all max elements from last row or last column
        max2 = {
            pos: [],
            score: matrix[m-1][n-1].score
        };
        // loop through last column
        for (var i = 0; i < m; i++) {
            if (max.score < matrix[i][n-1].score){
                max.score = matrix[i][n-1].score;
                max.i = i;
                max.j = n-1;


                max2.pos = [{i:i,j:n-1}];
                max2.score = matrix[i][n-1].score;
            } else if (max.score === matrix[i][n-1].score){
                max2.pos.push({i:i,j:n-1});
            }
        }
        // loop through last row
        for (var j = 0; j < n; j++) {
            if (max.score < matrix[m-1][j].score){
                max.score = matrix[m-1][j].score;
                max.i = m-1;
                max.j = j;

                max2.pos = [{i:m-1,j:j}];
                max2.score = matrix[m-1][j].score;
            } else if (max.score === matrix[m-1][j].score){
                max2.pos.push({i:m-1,j:j});
            }
        }
        // Here we will loop through all max values, creating our possibly many starting points for semi global mode
        for (var k = 0; k < max2.pos.length; k++) {
            // Add gaps to end if needed
            var tracedCellsTEMP = [],
            alignment1TEMP = [],
            alignment2TEMP = [];

            if (max2.pos[k].i < m-1){
                console.log('test');
                for (var w = m-1; w > max2.pos[k].i; w--) {
                    tracedCellsTEMP.push({i:w,j:n-1});
                    alignment1TEMP.unshift(sequence1[w-1]);
                    alignment2TEMP.unshift('-');
                }
            } else if (max2.pos[k].j < n-1){
                console.log('test2');
                for (var w = n - 1; w > max2.pos[k].j; w--) {
                    tracedCellsTEMP.push({i:m-1,j:w});
                    alignment1TEMP.unshift('-');
                    alignment2TEMP.unshift(sequence2[w-1]);
                }
            }

            // push starting point cell to 
            tracedCellsTEMP.push({i:max2.pos[k].i,j:max2.pos[k].j});

            // add startingPoint to startingPoints array
            startingPoints.push({
                i: max2.pos[k].i,
                j: max2.pos[k].j,
                tracedCells: JSON.parse(JSON.stringify(tracedCellsTEMP)),
                alignment1: JSON.parse(JSON.stringify(alignment1TEMP)),
                alignment2: JSON.parse(JSON.stringify(alignment2TEMP))
            });
        }

        // // Add gaps to end if needed
        // if (max.i < m-1){
        //     for (var k = m - 1; k > max.i; k--) {
        //         tracedCells.push({i:k,j:n-1});
        //         alignment1.unshift(sequence1[k-1]);
        //         alignment2.unshift('-');
        //     }
        // } else if (max.j < n-1){
        //     for (var k = n - 1; k > max.j; k--) {
        //         tracedCells.push({i:m-1,j:k});
        //         alignment1.unshift('-');
        //         alignment2.unshift(sequence2[k-1]);
        //     }
        // }
        // // Set starting point cell (current) to the max value found and update our iterators i and j
        // current = matrix[max.i][max.j];
        // tracedCells.push({i: max.i,j: max.j});
        // i = max.i;
        // j = max.j;
    } else {
        // Mode = local
        // find max element overall
        var max = {
            i: m-1,
            j: n-1,
            score: matrix[m-1][n-1].score
        };

        max2 = {
            pos: [],
            score: 1
        };
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                if (max.score < matrix[i][j].score){
                    max.score = matrix[i][j].score;
                    max.i = i;
                    max.j = j;


                    max2.pos = [{i:i,j:j}];
                    max2.score = matrix[i][j].score;
                } else if (max.score === matrix[i][j].score){
                    max2.pos.push({i:i,j:j});
                }
            }
        }
        // tracedCells.push({i: max2.pos[0].i,j: max2.pos[0].j});
        // i = max2.pos[0].i;
        // j = max2.pos[0].j;

        for (var k = 0; k < max2.pos.length; k++) {
            startingPoints.push({
                i: max2.pos[k].i,
                j: max2.pos[k].j,
                tracedCells: [{i: max2.pos[k].i,j: max2.pos[k].j}],
                alignment1: [],
                alignment2: []
            });
        }
    }
    console.log(max2);
    console.log(startingPoints);
    console.log('before calling traverse (inside traceback())', 't=0');
    start = new Date().getTime();


    for (var k = 0; k < startingPoints.length; k++) {
        console.log('startingPoint[' + k +  ']');
        traverse(JSON.parse(JSON.stringify(matrix)), sequence1, sequence2, startingPoints[k].i, startingPoints[k].j, JSON.parse(JSON.stringify(startingPoints[k].tracedCells)), JSON.parse(JSON.stringify(startingPoints[k].alignment1)), JSON.parse(JSON.stringify(startingPoints[k].alignment2)), results);
    };

    return results;
    
    
}
recursionCounter = 0;
function traverse (matrix, sequence1, sequence2, i, j, tracedCells, alignment1, alignment2, results) {
    // set some testing info
    var now = new Date().getTime();
    var thisRecursion = recursionCounter;
    recursionCounter++;
    console.log('Begin: traverse('+ (thisRecursion) +') start', 't=' + ( now - start) );


    // set starting point to matrix position i,j
    var current = matrix[i][j];


    while( !current.traceback[0] ){
        if (current.traceback[3]){
            // [3] represents diagonal path next is S[i-1][j-1]
            
            // turn path flag off (matrix here is passed by value so no problem in modifying it)
            current.traceback[3] = 0;

            // if there are other paths, call traverse again;
            // traverse stopping condition( when current.traceback == [1,0,0,0]) will always be met at some point since S(0,0).traceback always equals [1,0,0,0]
            if ( current.traceback.slice(1).join('') !== '000' ){
                traverse(JSON.parse(JSON.stringify(matrix)), sequence1, sequence2, i, j, JSON.parse(JSON.stringify(tracedCells)), JSON.parse(JSON.stringify(alignment1)), JSON.parse(JSON.stringify(alignment2)), results);
            }

            // update i and j and current
            i--;
            j--;
            current = matrix[i][j];
            tracedCells.push({i: i,j: j});
            alignment1.unshift(sequence1[i]);
            alignment2.unshift(sequence2[j]);
        } else if (current.traceback[2]){
            // [2] represents vertical path next is S[i-1][j]
            
            // turn path flag off (matrix here is passed by value so no problem in modifying it)
            current.traceback[2] = 0;

            // if there are other paths, call traverse again;
            // traverse stopping condition( when current.traceback == [1,0,0,0]) will always be met at some point since S(0,0).traceback always equals [1,0,0,0]
            if ( current.traceback.slice(1).join('') !== '000' ){
                traverse(JSON.parse(JSON.stringify(matrix)), sequence1, sequence2, i, j, JSON.parse(JSON.stringify(tracedCells)), JSON.parse(JSON.stringify(alignment1)), JSON.parse(JSON.stringify(alignment2)), results);
            }

            // update i and current
            i--;
            current = matrix[i][j];
            tracedCells.push({i: i,j: j});
            alignment1.unshift(sequence1[i]);
            alignment2.unshift('-');
        } else if (current.traceback[1]){
            // [1] represents horizontal path next is S[i][j-1]
            
            // turn path flag off (matrix here is passed by value so no problem in modifying it)
            current.traceback[1] = 0;

            // if there are other paths, call traverse again;
            // traverse stopping condition( when current.traceback == [1,0,0,0]) will always be met at some point since S(0,0).traceback always equals [1,0,0,0]
            if ( current.traceback.slice(1).join('') !== '000' ){
                traverse(JSON.parse(JSON.stringify(matrix)), sequence1, sequence2, i, j, JSON.parse(JSON.stringify(tracedCells)), JSON.parse(JSON.stringify(alignment1)), JSON.parse(JSON.stringify(alignment2)), results);
            }
            
            // update j and current
            j--;
            current = matrix[i][j];
            tracedCells.push({i: i,j: j});
            alignment1.unshift('-');
            alignment2.unshift(sequence2[j]);
        }
    }

    results.push({
        tracedCells: tracedCells,
        alignment: [alignment1, alignment2]
    });

    var now = new Date().getTime();
    console.log('End: traverse('+ (thisRecursion) +') start', 't=' + ( now - start) );
    return results;

}







function printTraceback (traceback,matrixTable,alignmentContainer) {
    // Reset alignmentContainer to empty in case there were previous runs
    alignmentContainer.html('');

    // Loop through all possibles tracebacks
    for (var i = 0; i < traceback.length; i++) {
        var matchMismatch = [];
        // Loop through tracedCells and updated matrixTable and alignmentContainer
        for (var k = 0; k < traceback[i].tracedCells.length; k++) {
            // Add traced class to matrixTable cells that are part of alignment
            matrixTable.find('tr').eq(traceback[i].tracedCells[k].i).find('td').eq(traceback[i].tracedCells[k].j).find('.dynamicProgrammingMatrixCell').addClass('traced' + i);

            // Construct matchMismatch which holds the visual representation between both sequences in the alignment (e.g. X for mismatch, | for matches, &nbsp; for gap)
            if (traceback[i].alignment[0][k] === '-' || traceback[i].alignment[1][k] === '-'){
                matchMismatch.push('&nbsp;');
            } else if (traceback[i].alignment[0][k] === traceback[i].alignment[1][k]){
                matchMismatch.push('|');
            } else{
                matchMismatch.push('X');
            }
        }

        // The above loop gives matchMismatch an extra undesired character (runs one time too long) so we will remove it with .pop()
        matchMismatch.pop();

        // display alignment
        alignmentContainer.append( traceback[i].alignment[0].join('') + '<br>' + matchMismatch.join('') + '<br>' + traceback[i].alignment[1].join('') + '<br><br><br>');
    }
}