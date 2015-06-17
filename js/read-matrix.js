/**
 * Read data from dynamicProgrammingMatrix table into an array
 * @param  {object} dynamicProgrammingMatrix
 * @return {array} matrix
 */
function readMatrix (dynamicProgrammingMatrix) {
    var matrix = [];

    dynamicProgrammingMatrix.find('tr').each(function() {
        var row = [];
        $(this).find('td').each(function() {
            // prepare traceback. convert to binary then explode to array
            var traceback = parseInt($(this).find('.tracebackSelect').val()).toString(2);
            if (traceback.length < 4) traceback = Array(4 - traceback.length + 1 ).join("0") + traceback;
            traceback = traceback.split("");
            
            row.push({
                score: parseInt($(this).find('.dynamicProgrammingMatrixCell').val(), 10),
                traceback: traceback
            });
        });
        matrix.push(row);
    });
    return matrix;
}