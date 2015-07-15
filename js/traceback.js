

// Function traceback()
function traceback(mode,matrix,sequence1,sequence2){

    // global: Traceback starts at last cell, travels back to first cell
    // semi: Traceback starts at max of last column or row. Stop traceback when reaching first row or column
    // local: Tracebacks starts at cell containing the maximum value (any cell). Traceback ends when first zero is reached.



    // initialize variables
    var i, j, current, max,
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
        // find all max elements from last row or last column
        max = {
            pos: [{i:m-1,j:n-1}],
            score: matrix[m-1][n-1].score
        };

        // loop through last column minus the very last element
        for (var i = 0; i < m-1; i++) {
            if (max.score < matrix[i][n-1].score){
                max.pos = [{i:i,j:n-1}];
                max.score = matrix[i][n-1].score;
            } else if (max.score === matrix[i][n-1].score){
                max.pos.push({i:i,j:n-1});
            }
        }
        // loop through last row minus the very last element
        for (var j = 0; j < n-1; j++) {
            if (max.score < matrix[m-1][j].score){
                max.pos = [{i:m-1,j:j}];
                max.score = matrix[m-1][j].score;
            } else if (max.score === matrix[m-1][j].score){
                max.pos.push({i:m-1,j:j});
            }
        }
        // Here we will loop through all max values, creating our possibly many starting points for semi global mode
        for (var k = 0; k < max.pos.length; k++) {
            // Add gaps to end if needed
            var tracedCellsTEMP = [],
            alignment1TEMP = [],
            alignment2TEMP = [];

            if (max.pos[k].i < m-1){
                for (var w = m-1; w > max.pos[k].i; w--) {
                    tracedCellsTEMP.push({i:w,j:n-1});
                    alignment1TEMP.unshift(sequence1[w-1]);
                    alignment2TEMP.unshift('-');
                }
            } else if (max.pos[k].j < n-1){
                for (var w = n - 1; w > max.pos[k].j; w--) {
                    tracedCellsTEMP.push({i:m-1,j:w});
                    alignment1TEMP.unshift('-');
                    alignment2TEMP.unshift(sequence2[w-1]);
                }
            }

            // push starting point cell to 
            tracedCellsTEMP.push({i:max.pos[k].i,j:max.pos[k].j});

            // add startingPoint to startingPoints array
            startingPoints.push({
                i: max.pos[k].i,
                j: max.pos[k].j,
                tracedCells: JSON.parse(JSON.stringify(tracedCellsTEMP)),
                alignment1: JSON.parse(JSON.stringify(alignment1TEMP)),
                alignment2: JSON.parse(JSON.stringify(alignment2TEMP))
            });
        }
    } else {
        // Mode = local
        // find all max elements overall
        max = {
            pos: [],
            score: 1
        };
        for (var i = 0; i < m; i++) {
            for (var j = 0; j < n; j++) {
                if (max.score < matrix[i][j].score){
                    max.pos = [{i:i,j:j}];
                    max.score = matrix[i][j].score;
                } else if (max.score === matrix[i][j].score){
                    max.pos.push({i:i,j:j});
                }
            }
        }

        // Loop through max elements and create startingPoints
        for (var k = 0; k < max.pos.length; k++) {
            startingPoints.push({
                i: max.pos[k].i,
                j: max.pos[k].j,
                tracedCells: [{i: max.pos[k].i,j: max.pos[k].j}],
                alignment1: [],
                alignment2: []
            });
        }
    }
    console.log('before calling traverse (inside traceback())', 't=0.000');
    start = new Date().getTime();

    console.log(startingPoints);
    for (var k = 0; k < startingPoints.length; k++) {
        console.log('startingPoint[' + k +  ']');
        traverse(mode, JSON.parse(JSON.stringify(matrix)), sequence1, sequence2, startingPoints[k].i, startingPoints[k].j, JSON.parse(JSON.stringify(startingPoints[k].tracedCells)), JSON.parse(JSON.stringify(startingPoints[k].alignment1)), JSON.parse(JSON.stringify(startingPoints[k].alignment2)), results);
    };

    return results;
    
    
}
function traverse (mode, matrix, sequence1, sequence2, i, j, tracedCells, alignment1, alignment2, results) {
    // set some testing info
    var now = new Date().getTime();
    var thisRecursion = recursionCounter;
    recursionCounter++;
    if (recursionCounter === 10){
        var r = confirm("There are more than 10 possible tracebacks, continuing might make browser slow or irresponsive. Hit cancel to stop, or ok to continue");
        if (r === false){
            console.log('Too many possible paths, error will be thrown to stop script');
            throw '\'Too many paths, abort script\'';
        }
    }
    console.log('Begin: traverse('+ (thisRecursion) +') start', 't=' + ((now - start)/1000) );


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
                traverse(mode, JSON.parse(JSON.stringify(matrix)), sequence1, sequence2, i, j, JSON.parse(JSON.stringify(tracedCells)), JSON.parse(JSON.stringify(alignment1)), JSON.parse(JSON.stringify(alignment2)), results);
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
                traverse(mode, JSON.parse(JSON.stringify(matrix)), sequence1, sequence2, i, j, JSON.parse(JSON.stringify(tracedCells)), JSON.parse(JSON.stringify(alignment1)), JSON.parse(JSON.stringify(alignment2)), results);
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
                traverse(mode, JSON.parse(JSON.stringify(matrix)), sequence1, sequence2, i, j, JSON.parse(JSON.stringify(tracedCells)), JSON.parse(JSON.stringify(alignment1)), JSON.parse(JSON.stringify(alignment2)), results);
            }
            
            // update j and current
            j--;
            current = matrix[i][j];
            tracedCells.push({i: i,j: j});
            alignment1.unshift('-');
            alignment2.unshift(sequence2[j]);
        }

        if (mode==="local" && current.score === 0){
            current.traceback[0] = 0;

            console.log('traceback', current.traceback);
            current.score = -1;
            console.log('score', current.score);

            // if there are other paths, call traverse again;
            // traverse stopping condition( when current.traceback == [1,0,0,0]) will always be met at some point since S(0,0).traceback always equals [1,0,0,0]
            if ( current.traceback.slice(1).join('') !== '000' ){
                traverse(mode, JSON.parse(JSON.stringify(matrix)), sequence1, sequence2, i, j, JSON.parse(JSON.stringify(tracedCells)), JSON.parse(JSON.stringify(alignment1)), JSON.parse(JSON.stringify(alignment2)), results);
            }

            break;
        }
    }

    results.push({
        tracedCells: tracedCells,
        alignment: [alignment1, alignment2]
    });

    var now = new Date().getTime();
    console.log('End: traverse('+ (thisRecursion) +') start', 't=' + ((now - start)/1000) );
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
        alignmentContainer.append( '<div><label class="alignmentSelectorLabel">s1:<br><input type="radio" name="alignmentSelectorRadio" class ="alignmentSelectorRadio"><br>s2:</label><div class="alignment">' + traceback[i].alignment[0].join('') + '<br>' + matchMismatch.join('') + '<br>' + traceback[i].alignment[1].join('') + '</div></div>');
    }
    // select first alignment to display traceback on matrix
    $('.alignmentSelectorRadio').eq(0).prop('checked', 'checked');
    matrixTable.find('.traced0').addClass('tracebackActive');
    // watch for changes on which alignment to display traceback info on matrix
    alignmentContainer.find('.alignmentSelectorRadio').change(function(event) {
        $('.dynamicProgrammingMatrixCell').removeClass('tracebackActive');
        matrixTable.find(('.traced' + alignmentContainer.find('.alignmentSelectorRadio').index(this))).addClass('tracebackActive');
    });
}