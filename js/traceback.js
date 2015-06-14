// Function traceback()
function traceback(mode,matrix){

    // global: Traceback starts at last cell, travels back to first cell
    // semi: Traceback starts at max of last column or row. Stop traceback when reaching first row or column
    // local: Tracebacks starts at cell containing the maximum value (any cell). Traceback ends when first zero is reached.



    // I need the mode, the matrix(in this case the correct one)

    // initialize variables
    var i, j, current,
    tracedCells = [];


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
    // current.traceback[3] when set to true represents end of path
    while(!current.traceback[3]){
        if (current.traceback[0]){
            // [0] represents diagonal path next is S[i-1][j-1]

            // update i and j and current
            i--;
            j--;
            current = matrix[i][j];
            tracedCells.push({i: i,j: j});
        } else if (current.traceback[1]){
            // [1] represents vertical path next is S[i-1][j]
            // update i and current
            i--;
            current = matrix[i][j];
            tracedCells.push({i: i,j: j});
        } else if (current.traceback[2]){
            // [2] represents horizontal path next is S[i][j-1]
            // update j and current
            j--;
            current = matrix[i][j];
            tracedCells.push({i: i,j: j});
        }
    }
    // We've reached a traceback with no path, lets end the traceback function
    // most likely we will use "return" here

    return  tracedCells;


    // /*===========================
    // =            OLD            =
    // ===========================*/
    
    // current = matrix[i][j]

    // var current = S[m][n];
    // var i = m;
    // var j = n;
    // var alignment = [];
    



    // do {
    //     matrix.find("tr").eq(i+1).find("td").eq(j+1).addClass("traced");
    //     if (current[1] == 0){
    //         i--;
    //         j--;
    //         alignment.push([seq1[i],seq2[j]]);
    //     }else if (current[1] == 1){
    //         i--;
    //         alignment.push([seq1[i],"-"]);
    //     }else if (current[1] == 2){
    //         j--;                
    //         alignment.push(["-", seq2[j]]);
    //     }
        
    //     var current = S[i][j];
    //     matrix.find("tr").eq(i+1).find("td").eq(j+1).addClass("traced");
    // }while(current[1] != -1 );
    
    // alignment = alignment.reverse();
    
    // var seq1Result ="";
    // var seq2Result ="";
    // var score = "";
    
    // for (var i =0; i < alignment.length; i++){
    //     seq1Result += alignment[i][0] + "&nbsp;";
    //     seq2Result += alignment[i][1] + "&nbsp;";
    //     if (alignment[i][0] == alignment[i][1]){
    //         score += "|&nbsp;";
    //     }else if( alignment[i][0] == "-" || alignment[i][1] == "-" ){
    //         score += "&nbsp;&nbsp;";
    //     }else {
    //         score += "X&nbsp;";
    //     }
    // }
            
    // var result = seq1Result + "<br>" + score + "<br>" + seq2Result;
    // display.html(result);

    /*-----  End of OLD  ------*/
    
    
}


function printTraceback (tracedCells,matrixTable) {
    for (var k = 0; k < tracedCells.length; k++) {
        matrixTable.find('tr').eq(tracedCells[k].i).find('td').eq(tracedCells[k].j).find('input').addClass('traced');
    }
}