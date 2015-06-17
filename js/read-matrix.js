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
            row.push({
                score: parseInt($(this).find('.dynamicProgrammingMatrixCell').val(), 10),
                traceback: [false, false, false, false]
            });
        });
        matrix.push(row);
    });
    return matrix;
}