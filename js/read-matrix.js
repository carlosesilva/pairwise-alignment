/**
 * Read data from dynamicProgrammingMatrix table into an array
 * @param  {object} dynamicProgrammingMatrix
 * @return {array} matrix
 */
function dynamicProgrammingMatrixRead (dynamicProgrammingMatrix) {
    var matrix = [];

    dynamicProgrammingMatrix.find('tr').each(function() {
        var row = [];
        $(this).find('td').each(function() {
            row.push([parseInt($(this).find('input').val()), ["traceback info goes here"]]);
        });
        matrix.push(row);
    });
    return matrix;
}