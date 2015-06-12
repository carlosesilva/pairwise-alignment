/**
 * Build the dynamicProgrammingMatrixWrapper and call buildDynamicProgrammingMatrix()
 * @param  {string} seq1 
 * @param  {string} seq2
 * @return {string} result
 */
function buildDynamicProgrammingMatrixWrapper(seq1, seq2){
    var result = '<table class="dynamicProgrammingMatrixWrapper"><tbody>';
    result += '<tr><td class="emptyCell"><input type="text" disabled></td><td class="emptyCell"><input type="text" disabled></td>';
    for (var j = 0; j<seq2.length; j++){
        result += '<td class="sequenceLetterCell"><input type="text" disabled value="' + seq2[j] + '"></td>';
    }
    result += '</tr><td class="emptyCell"><input type="text" disabled></td><td class="dynamicProgrammingMatrixContainer">' + buildDynamicProgrammingMatrix(seq1, seq2) + '</td></tr>';

    for (var i = 0; i<seq1.length; i++){
        result += '<tr><td class="sequenceLetterCell"><input type="text" disabled value="' + seq1[i] + '"></td></tr>';
    }
    result += '</tbody></table>';
    return result;
}

/**
 * Build the dynamicProgrammingMatrix
 * @param  {string} seq1
 * @param  {string} seq2
 * @return {string} result
 */
function buildDynamicProgrammingMatrix(seq1, seq2){
    var result = '<table class="dynamicProgrammingMatrix"><tbody>';
    
    for (var i = -1; i<seq1.length; i++){
        result += '<tr>';
        for (var j = -1; j<seq2.length; j++){
            result += '<td>';
            result += '<input type="text" class="dynamicProgrammingMatrixCell" i="' + i + '" j="' + j + '"/>';
            result += '</td>';
        }
        result += '</tr>';
    }
    
    result += '</tbody></table>';
    return result;
}