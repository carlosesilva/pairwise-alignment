/**
 * Build the dynamicProgrammingMatrixWrapper and call buildDynamicProgrammingMatrix()
 * @param  {string} seq1 
 * @param  {string} seq2
 * @return {string} result
 */
function buildMatrixHTML(seq1, seq2){
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
            result += '<select class="tracebackSelect" tabindex="-1">';
            result += '<option value="0">?</option>';
            result += '<option value="1">1</option>';
            result += '<option value="2">2</option>';
            result += '<option value="3">3</option>';
            result += '<option value="4">4</option>';
            result += '<option value="5">5</option>';
            result += '<option value="6">6</option>';
            result += '<option value="7">7</option>';
            result += '<option value="8">8</option>';
            result += '</select>';
            result += '<input type="text" class="dynamicProgrammingMatrixCell" pattern="^-?\\d+" i="' + (i+1) + '" j="' + (j+1) + '"/>';
            result += '</td>';
        }
        result += '</tr>';
    }
    
    result += '</tbody></table>';
    return result;
}