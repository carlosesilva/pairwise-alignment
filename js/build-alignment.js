function buildAlignmentInput(seq1, seq2, correctTraceback){
    var result = '<table><tbody>';
    
    result += '<tr>';
    for (var i = -1; i<seq1.length; i++){
        result += '<td>';
        result += '<input type="text" class="alignmentInputCell" />';
        result += '</td>';
    }
    result += '</tr><tr>';
    for (var i = -1; i<seq1.length; i++){
        result += '<td>';
        result += '<input type="text" class="alignmentInputCell" />';
        result += '</td>';
    }
    result += '</tr>';
    result += '</tbody></table>';
    return result;
}